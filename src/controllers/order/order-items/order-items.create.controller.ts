import type { RequestHandler } from 'express'
import type { IOrderItems } from '../../../models/order/order-items.model'
import { orderItemsService } from '../../../services/order/order-items.service'
import logger from '../../../utils/logger.utils'

export const addOrderItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const orderItemData = req.body as IOrderItems

		const newOrderItems = await orderItemsService.createOrderItems(
			orderItemData
		)

		logger.info('Успешно созданы новые позиции заказа')
		res.status(201).json(newOrderItems)
	} catch (error) {
		next(error)
	}
}
