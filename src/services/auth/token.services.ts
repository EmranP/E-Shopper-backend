import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import {
	createToken,
	getTokenByRefreshToken,
	removeTokenData,
	type TokenReturningType,
} from '../../models/auth/token.model'
import type { IUser } from '../../models/auth/user.model'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export interface IAccessTokenService {
	access: string
	refresh: string
}

type ValidateTokenT = string | JwtPayload | null | ApiError | IUser

class TokenService {
	async generateToken(payload: Partial<IUser>): Promise<IAccessTokenService> {
		const accessSecretKey = process.env.JWT_ACCESS_SECRET
		const refreshSecretKey = process.env.JWT_REFRESH_SECRET
		if (!accessSecretKey || !refreshSecretKey) {
			throw new Error('JWT secrets tokens is not defend')
		}
		const access = jwt.sign(payload, accessSecretKey, {
			expiresIn: '30m',
			algorithm: 'HS256',
		})
		const refresh = jwt.sign(payload, refreshSecretKey, {
			expiresIn: '30d',
			algorithm: 'HS256',
		})

		return {
			access,
			refresh,
		}
	}

	validateAccessToken(token: string): ValidateTokenT {
		try {
			const tokenSecret = process.env.JWT_ACCESS_SECRET

			if (!tokenSecret) {
				return ApiError.BadRequest('У токена нет секретного ключа')
			}

			const userData = jwt.verify(token, tokenSecret)
			return userData
		} catch (error) {
			return null
		}
	}

	validateRefreshToken(token: string): ValidateTokenT {
		try {
			const tokenSecret = process.env.JWT_REFRESH_SECRET

			if (!tokenSecret) {
				return ApiError.BadRequest('У токена нет секретного ключа')
			}

			const userData = jwt.verify(token, tokenSecret)
			return userData
		} catch (error) {
			return null
		}
	}

	async saveToken(userId: number, refreshToken: string) {
		const hashedToken = await bcrypt.hash(refreshToken, 10)

		await this.removeToken(refreshToken)

		const token = await createToken(userId, hashedToken)

		if (!token) {
			logger.error(`Ошибка сохранения токена для userId ${userId}`)
			throw ApiError.BadRequest('Не удалось сохранить токен')
		}

		return token
	}

	async removeToken(refreshToken: string): Promise<TokenReturningType> {
		const tokenData = await removeTokenData(refreshToken)
		return tokenData
	}

	async findToken(refreshToken: string): Promise<TokenReturningType> {
		const tokenData = await getTokenByRefreshToken(refreshToken)
		return tokenData
	}
}

export const tokenService = new TokenService()
