import type { RequestHandler } from 'express'
import { cartService } from '../../../services/cart/carts.service'
import logger from '../../../utils/logger.utils'

export const getCartsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const carts = await cartService.getCarts()

		logger.info(`Carts успешно получены из controller`)
		res.status(200).json(carts)
	} catch (error) {
		next(error)
	}
}
