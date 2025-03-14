import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'

export const getCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const cartId = req.params.cartId
		const cartItemsData = await cartItemsService.getCartItems(cartId)

		res.status(200).json(cartItemsData)
	} catch (error) {
		next(error)
	}
}
