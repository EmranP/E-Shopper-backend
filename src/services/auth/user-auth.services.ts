import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import {
	createUser,
	getUserByActivateLink,
	getUserByEmail,
	updateUserByIsActivated,
	type IUser,
} from '../../models/auth/auth-user.model'
import type { TokenReturningType } from '../../models/auth/token.model'
import { getModelUserById } from '../../models/users/user.model'
import { UserDTO } from '../../utils/dtos/user-dto.utils'
import { ApiError, TokenGenerationError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'
import { mailService } from './mail.services'
import { tokenService, type IAccessTokenService } from './token.services'

export interface IUserAuthServiceProps {
	login: string
	email: string
	password: string
}

export interface IUserAuthService extends IAccessTokenService {
	user: UserDTO
}

class UserAuthService {
	constructor(private readonly loggerError = logger) {}

	async registration({
		login,
		email,
		password,
	}: IUserAuthServiceProps): Promise<IUserAuthService> {
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
		console.log(userDTO)
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
	}: Partial<IUserAuthServiceProps>): Promise<IUserAuthService> {
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

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			logger.warn('Попытка обновления без refresh token')
			throw ApiError.UnauthorizedError()
		}

		const userData = tokenService.validateRefreshToken(refreshToken) as IUser
		console.log(userData)

		if (!userData) {
			logger.warn('Невалидный refresh token')
			throw ApiError.UnauthorizedError()
		}

		const tokenFromDb = await tokenService.findToken(refreshToken)

		if (!tokenFromDb) {
			logger.warn('Refresh token отсутствует в базе (возможно, удалён)')
			throw ApiError.UnauthorizedError()
		}

		const user = await getModelUserById(userData.id)

		if (!user) {
			logger.error(`Пользователь с id ${userData.id} не найден`)
			throw ApiError.BadRequest('Пользователь не найден')
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
}

export const userAuthService = new UserAuthService()
