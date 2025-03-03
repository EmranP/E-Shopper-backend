import type { RequestHandler } from 'express'
import { userService } from '../../services/auth/user.services'
import logger from '../../utils/logger.utils'

export const refreshController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const refreshToken: string | undefined = req.cookies?.refreshToken

		if (!refreshToken) {
			logger.warn('Попытка обновления без refresh token')
			res.status(400).json({ message: 'Токен отсутствует' })
			return
		}

		const userData = await userService.refresh(refreshToken)

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
