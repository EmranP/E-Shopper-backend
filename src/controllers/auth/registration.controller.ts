import { type RequestHandler } from 'express'
import { userService } from '../../services/auth/user.services'
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
) => {
	try {
		const { login, email, password } = req.body as IRequestBodyRegistration

		if (!login || !email || !password) {
			logger.error(`User is not writing login, email or password`)
			res.status(400).json({ message: 'All fields are required' })
			return
		}

		const userData = await userService.registration({
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
		if (error instanceof Error) {
			logger.error(error.message)
			res.status(500).json({ message: error.message })
			return
		} else {
			logger.error('Something has been wrong (')
			res.status(500).json({ message: 'Internal server error' })
			return
		}
	}
}
