import type { RequestHandler } from 'express'
import { userAuthService } from '../../services/auth/user-auth.services'
import logger from '../../utils/logger.utils'

export const logoutController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const refreshToken: string | undefined = req.cookies?.refreshToken

		if (!refreshToken) {
			res.status(400).json({ message: 'Токен отсутствует' })
			return
		}

		const token = await userAuthService.logout(refreshToken)

		if (!token) {
			res.status(400).json({ message: 'Токен не найден' })
			return
		}

		logger.info('User success has been logout')

		res
			.clearCookie('refreshToken', { httpOnly: true, secure: true })
			.json(token)
	} catch (error: unknown) {
		next(error)
	}
}
