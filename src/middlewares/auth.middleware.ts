import type { RequestHandler } from 'express'
import type { IUser } from '../models/auth/auth-user.model'
import { tokenService } from '../services/auth/token.services'
import { ApiError } from '../utils/exists-error.utils'

export const authenticated: RequestHandler = async (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization

		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError())
		}

		const accessToken = authorizationHeader.split(' ')[1]

		if (!accessToken) {
			return next(ApiError.UnauthorizedError())
		}

		const userData = tokenService.validateAccessToken(accessToken) as IUser

		if (!userData) {
			return next(ApiError.UnauthorizedError())
		}

		req.user = userData
		next()
	} catch (error) {
		next(ApiError.UnauthorizedError())
	}
}
