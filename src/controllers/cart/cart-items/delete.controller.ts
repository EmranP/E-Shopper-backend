import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'

export const removeCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { cartId } = req.params

		const removeCartItems = await cartItemsService.removeCartItems(cartId)

		res.status(201).json(removeCartItems)
	} catch (error) {
		next(error)
	}
}
