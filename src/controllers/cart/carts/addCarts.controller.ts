import type { RequestHandler } from 'express'
import { cartService } from '../../../services/cart/carts.service'
import type { ICartsDTO } from '../../../utils/dtos/carts-dto.utils'
import logger from '../../../utils/logger.utils'

export type TRequestBodyPostCart = Omit<ICartsDTO, 'created_at' | 'updated_at'>

export const addCartController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id

		if (!userId) {
			res
				.status(400)
				.json({ message: `Ошибка при добвалений нового cart из controller` })
			return
		}

		const newCart = await cartService.addCart(userId)
		logger.info(`Cart успешно добавлена из controller`)
		res.status(201).json(newCart)
	} catch (error) {
		next(error)
	}
}
