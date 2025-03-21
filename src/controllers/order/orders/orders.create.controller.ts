import type { RequestHandler } from 'express'
import type { IOrders } from '../../../models/order/orders.model'
import { ordersService } from '../../../services/order/orders.service'
import logger from '../../../utils/logger.utils'

export const createOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id
		const { total_price } = req.body as Partial<IOrders>

		const newOrders = await ordersService.createOrders(
			userId as number,
			total_price as number
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
