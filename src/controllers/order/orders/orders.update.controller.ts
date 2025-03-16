import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import type { IOrders } from '../../../models/order/orders.model'
import { ordersService } from '../../../services/order/orders.service'
import logger from '../../../utils/logger.utils'

export const updateOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userRole = req.user?.role
		const { orderId } = req.params
		const { status } = req.body as Partial<IOrders>

		const editOrders = await ordersService.editOrders(
			userRole as ROLES,
			orderId,
			status as string
		)

		if (!editOrders) {
			logger.error('Ошибка при редактировании заказа')
			res.status(404).json({ message: 'Заказ не найден' })
			return
		}

		logger.info(`Заказ с ID ${orderId} успешно отредактирован`)
		res.status(200).json(editOrders)
	} catch (error) {
		next(error)
	}
}
