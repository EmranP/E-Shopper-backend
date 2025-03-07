import type { RequestHandler } from 'express'
import { userServices } from '../../services/user/user.services'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export const removeUserController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { userId } = req.params

		if (!userId) {
			logger.warn('User ID is missing in request params')
			throw ApiError.BadRequest('User ID is required')
		}

		const removedUser = await userServices.removeUser(userId)

		if (!removedUser) {
			logger.warn(`User with ID ${userId} not found`)
			throw ApiError.BadRequest(`User with ID ${userId} not found`)
		}

		logger.info(`User ${userId} has been removed successfully`)
		res.status(200).json({ message: 'User deleted successfully', removedUser })
	} catch (error) {
		next(error)
	}
}
