import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import {
	createUser,
	getUserByActivateLink,
	getUserByEmail,
	updateUserByIsActivated,
	type IUser,
} from '../../models/auth/user.model'
import { UserDTO } from '../../utils/dtos/user-dto.utils'
import {
	TokenGenerationError,
	UserAlreadyExistsError,
} from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'
import { mailService } from './mail.services'
import { tokenService, type IAccessTokenService } from './token.services'

export interface IUserServiceRegistrationProps {
	login: string
	email: string
	password: string
}

export interface IUserServiceRegistration extends IAccessTokenService {
	user: UserDTO
}

class UserService {
	constructor(private readonly loggerError = logger) {}

	async registration({
		login,
		email,
		password,
	}: IUserServiceRegistrationProps): Promise<IUserServiceRegistration> {
		const candidate = await getUserByEmail(email)

		if (candidate) {
			this.loggerError.error(`Пользователь с почтой ${email} уже существует`)
			throw new UserAlreadyExistsError(email)
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const activationLink = uuidV4()

		const user = await createUser(login, email, hashedPassword, activationLink)
		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		)

		const userDTO = new UserDTO(user)
		const tokens = await tokenService.generateToken({ ...userDTO })

		if (!tokens.refresh) {
			throw new TokenGenerationError()
		}

		await tokenService.saveToken(userDTO.id, tokens.refresh)

		return {
			...tokens,
			user: userDTO,
		}
	}

	async activate(activationLink: string): Promise<IUser> {
		const user = await getUserByActivateLink(activationLink)

		if (!user) {
			throw new Error('Некорректная ссылка активации')
		}

		const updatedUser = await updateUserByIsActivated(activationLink, true)

		if (!updatedUser) {
			throw new Error('Ошибка при обновлении статуса активации')
		}

		return updatedUser
	}
}

export const userService = new UserService()
