import type { RequestHandler } from 'express'
import { cartService } from '../../../services/cart/carts.service'
import logger from '../../../utils/logger.utils'

export const removeCartController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { cartId } = req.params

		if (!cartId) {
			res.status(404).json({
				message: `Ошибка при удалении Cart id=${cartId} из controller`,
			})
			return
		}

		const removedCartData = await cartService.removeCart(cartId)
		logger.info(`Cart с user id=${cartId} успешно удалена из controller`)
		res.status(201).json(removedCartData)
	} catch (error) {
		next(error)
	}
}
