import type { RequestHandler } from 'express'
import type { IOrders } from '../../../models/order/orders.model'
import { ordersService } from '../../../services/order/orders.service'
import logger from '../../../utils/logger.utils'
import { type ICarts } from '../../../models/cart/carts.model'

export const createOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id
		const { total_price, id } = req.body as Partial<IOrders & ICarts>

		if (!total_price || !id) {
			res.status(404).json({message: 'User not write date'})
			return
		}

		const newOrders = await ordersService.createOrders(
			userId,
			id,
			total_price
		)

		if (!newOrders) {
			res
				.status(400)
				.json({
					message: 'Некорректные данные для создания заказа в controller',
				})
			return
		}

		logger.info('Заказ успешно создан')
		res.status(201).json(newOrders)
	} catch (error) {
		next(error)
	}
}
