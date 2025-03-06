import type { RequestHandler } from 'express'
import { userAuthService } from '../../services/auth/user-auth.services'
import logger from '../../utils/logger.utils'

export const refreshController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const refreshToken: string = req.cookies?.refreshToken
		const userData = await userAuthService.refresh(refreshToken)

		if (!userData) {
			logger.warn(`Ошибка при обновлении токена: refreshToken не найден в БД`)
			res.status(401).json({ message: 'Неверный или устаревший токен' })
			return
		}

		logger.info('Refresh token успешно обновлён')

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
