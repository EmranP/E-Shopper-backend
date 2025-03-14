import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'
import type { TRequestBodyICartItems } from './create.controller'

export const editCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { id } = req.params
		const cartItemsData = req.body as TRequestBodyICartItems
		const editCartItems = await cartItemsService.editCartItems(
			id,
			cartItemsData
		)

		res.status(200).json(editCartItems)
	} catch (error) {
		next(error)
	}
}
