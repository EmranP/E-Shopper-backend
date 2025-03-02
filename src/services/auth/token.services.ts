import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
	createToken,
	getTokenById,
	removeTokenData,
	type TokenReturningType,
} from '../../models/auth/token.model'
import type { IUser } from '../../models/auth/user.model'

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
		const tokenData = await getTokenById(userId)
		const hashedToken = await bcrypt.hash(refreshToken, 10)

		if (tokenData) {
			return await createToken(userId, hashedToken)
		}

		return await createToken(userId, hashedToken)
	}

	async removeToken(refreshToken: string): Promise<TokenReturningType> {
		const tokenData = await removeTokenData(refreshToken)
		return tokenData
	}
}

export const tokenService = new TokenService()
