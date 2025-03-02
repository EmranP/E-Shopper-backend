import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
	createToken,
	removeTokenData,
	type TokenReturningType,
} from '../../models/auth/token.model'
import type { IUser } from '../../models/auth/user.model'
import { ApiError } from '../../utils/exists-error.utils'

export interface IAccessTokenService {
	access: string
	refresh: string
}

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

	async saveToken(userId: number, refreshToken: string) {
		const hashedToken = await bcrypt.hash(refreshToken, 10)
		const token = await createToken(userId, hashedToken)

		if (!token) {
			throw ApiError.BadRequest(
				'Ошибка при сохранении токена: запись не была создана'
			)
		}

		return token
	}

	async removeToken(refreshToken: string): Promise<TokenReturningType> {
		const tokenData = await removeTokenData(refreshToken)
		return tokenData
	}
}

export const tokenService = new TokenService()
