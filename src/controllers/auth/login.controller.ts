import type { RequestHandler } from 'express'
import { userService } from '../../services/auth/user.services'
import logger from '../../utils/logger.utils'

export interface IRequestBodyLogin {
	email: string
	password: string
}

export const loginController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { email, password } = req.body as IRequestBodyLogin

		if (!email || !password) {
			logger.error(`User is not writing email or password`)
			res.status(400).json({ message: 'All fields are required' })
			return
		}

		const userAuthData = await userService.login({ email, password })

		logger.info('User success has been login')

		res
			.cookie('refreshToken', userAuthData.refresh, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			.json(userAuthData)
	} catch (error) {
		next(error)
	}
}
