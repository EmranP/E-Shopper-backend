import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'
import type { ICartItemsDTO } from '../../../utils/dtos/carts-dto.utils'

export type TRequestBodyICartItems = Omit<
	ICartItemsDTO,
	'createdAt' | 'updatedAt' | 'id'
>

export const addCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const cartItemsData = req.body as TRequestBodyICartItems
		const newCartItems = await cartItemsService.addCartItems(cartItemsData)

		res.status(201).json(newCartItems)
	} catch (error) {
		next(error)
	}
}
