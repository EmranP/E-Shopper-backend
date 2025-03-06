import { type RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { userAuthService } from '../../services/auth/user-auth.services'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export interface IRequestBodyRegistration {
	login: string
	email: string
	password: string
}

export const registrationController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { login, email, password } = req.body as IRequestBodyRegistration

		if (!login || !email || !password) {
			logger.error(`User is not writing login, email or password`)
			res.status(400).json({ message: 'All fields are required' })
			return
		}

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
		}

		const userData = await userAuthService.registration({
			login,
			email,
			password,
		})

		logger.info('User success has been added')

		res
			.cookie('refreshToken', userData.refresh, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			.json(userData)
	} catch (error) {
		next(error)
	}
}
