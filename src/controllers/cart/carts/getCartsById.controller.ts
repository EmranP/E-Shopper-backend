import type { RequestHandler } from 'express'
import { cartService } from '../../../services/cart/carts.service'
import logger from '../../../utils/logger.utils'

export const getCartByIdController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id

		if (!userId) {
			res
				.status(404)
				.send({ message: `Carts с user id=${userId} не найдена из controller` })
			return
		}

		const cart = await cartService.getCartById(userId)
		logger.info(`Cart с user id=${userId} успешно найдена из controller`)
		res.status(200).json(cart)
	} catch (error) {
		next(error)
	}
}
