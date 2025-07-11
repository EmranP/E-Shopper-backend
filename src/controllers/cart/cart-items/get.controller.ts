import type { RequestHandler } from 'express'
import { cartItemsService } from '../../../services/cart/cart-items.service'
import { ApiError } from '../../../utils/exists-error.utils'

export const getCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const rawLimit = req.query.limit
		const rawOffset = req.query.offset

		const limit = rawLimit === 'all' ? 'all' : Number(rawLimit ?? 10)
		const offset = Number(rawOffset ?? 0)

		if (limit !== 'all' && (isNaN(limit) || limit <= 0)) {
			throw ApiError.BadRequest('Некорректный параметр limit')
		}
		if (isNaN(offset) || offset < 0) {
			throw ApiError.BadRequest('Некорректный параметр offset')
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
