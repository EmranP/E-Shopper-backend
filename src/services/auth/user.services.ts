import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import type { TokenReturningType } from '../../models/auth/token.model'
import {
	createUser,
	getUserByActivateLink,
	getUserByEmail,
	updateUserByIsActivated,
	type IUser,
} from '../../models/auth/user.model'
import { UserDTO } from '../../utils/dtos/user-dto.utils'
import { ApiError, TokenGenerationError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'
import { mailService } from './mail.services'
import { tokenService, type IAccessTokenService } from './token.services'

export interface IUserServiceProps {
	login: string
	email: string
	password: string
}

export interface IUserService extends IAccessTokenService {
	user: UserDTO
}

class UserService {
	constructor(private readonly loggerError = logger) {}

	async registration({
		login,
		email,
		password,
	}: IUserServiceProps): Promise<IUserService> {
		const candidate = await getUserByEmail(email)
		const errorMessage = `Пользователь с почтой ${email} уже существует`

		if (candidate) {
			this.loggerError.error(errorMessage)
			throw ApiError.BadRequest(errorMessage)
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
			throw ApiError.BadRequest('Некорректная ссылка активации')
		}

		const updatedUser = await updateUserByIsActivated(activationLink, true)

		if (!updatedUser) {
			throw ApiError.BadRequest('Ошибка при обновлении статуса активации')
		}

		return updatedUser
	}

	async login({
		email,
		password,
	}: Partial<IUserServiceProps>): Promise<IUserService> {
		const user = await getUserByEmail(email as string)

		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким  email не найден')
		}
		const isPassEquals = await bcrypt.compare(
			password as string,
			user.password as string
		)

		if (!isPassEquals) {
			throw ApiError.BadRequest('Неверный пароль')
		}
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

	async logout(refreshToken: string): Promise<TokenReturningType> {
		const tokens = await tokenService.removeToken(refreshToken)

		if (!tokens) {
			throw ApiError.BadRequest('Токен не найден или уже удалён')
		}

		return tokens
	}
}

export const userService = new UserService()
