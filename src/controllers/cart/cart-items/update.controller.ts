import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'
import type { ICartItems } from '../../../models/cart/cart-items.model'

export const editCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { cartId } = req.params
		const cartItemsData = req.body as Partial<ICartItems>
		const editCartItems = await cartItemsService.editCartItems(
			cartId,
			cartItemsData
		)

		res.status(200).json(editCartItems)
	} catch (error) {
		next(error)
	}
}
