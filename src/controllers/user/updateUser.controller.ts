import type { RequestHandler } from 'express'
import type { ROLES } from '../../constants/roles'
import { userServices } from '../../services/user/user.services'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export const updatedUserController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { userId } = req.params
		const { role } = req.body as { role: ROLES }

		if (!userId || !role) {
			logger.error('User ID и Role обязательны')
			throw ApiError.BadRequest('User ID и Role обязательны')
		}

		const existingUser = await userServices.getUserById(userId)
		if (!existingUser) {
			logger.error('Пользователь не найден')
			throw ApiError.BadRequest('Пользователь не найден')
		}

		const updatedUserData = await userServices.updatedUser(role, userId)

		if (!updatedUserData) {
			throw ApiError.BadRequest('Не удалось обновить пользователя')
		}

		res.status(200).json(updatedUserData)
	} catch (error) {
		next(error)
	}
}
