import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import { ordersService } from '../../../services/order/orders.service'
import logger from '../../../utils/logger.utils'

export const deleteOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userRole = req.user?.role
		const { orderId } = req.params

		const removeOrder = await ordersService.removeOrders(
			userRole as ROLES,
			orderId
		)

		if (!removeOrder) {
			logger.error('Ошибка при удалении заказа')
			res.status(404).json({ message: 'Заказ не найден' })
			return
		}

		logger.info(`Заказ с ID ${orderId} успешно удалён`)
		res.status(201).json(removeOrder)
	} catch (error) {
		next(error)
	}
}
