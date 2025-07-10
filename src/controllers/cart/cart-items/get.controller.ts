import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'

export const getCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { limit = 'all', offset = 0 } = req.query as unknown as {
			limit: number | 'all', 
			offset: number
		}
		const cartId = req.params.cartId
		const cartItemsData = await cartItemsService.getCartItems(
			cartId, 
			limit, 
			Number(offset)
		)

		res.status(200).json(cartItemsData)
	} catch (error) {
		next(error)
	}
}
