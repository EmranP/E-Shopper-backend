import type { NextFunction, Request, Response } from 'express'
import { userServices } from '../../services/user/user.services'
import logger from '../../utils/logger.utils'

export const getUsersController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const users = await userServices.getAllUsers()

		if (!users) {
			res.status(404).json({ message: 'Пользователь не были найдены' })
			return
		}
		logger.info('Данный о users успешно получены')

		res.status(200).json(users)
	} catch (error) {
		next(error)
	}
}
