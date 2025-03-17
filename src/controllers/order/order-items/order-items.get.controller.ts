import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import { orderItemsService } from '../../../services/order/order-items.service'
import logger from '../../../utils/logger.utils'

export const getOrderItemsForAdminController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id
		const userRole = req.user?.role

		const orderItemsAdmin = await orderItemsService.getAllOrderItemsForAdmin(
			userId as number,
			userRole as ROLES
		)

		logger.info('Успешно получены позиции заказа для администратора')
		res.status(200).json(orderItemsAdmin)
	} catch (error) {
		next(error)
	}
}

export const getOrderItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { orderId } = req.params

		const orderItems = await orderItemsService.getAllOrderItems(orderId)

		logger.info('Успешно получены позиции заказа для пользователя')
		res.status(200).json(orderItems)
	} catch (error) {
		next(error)
	}
}

export const getOrderItemsByIdController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { orderId, itemId } = req.params

		const orderItem = await orderItemsService.getOrderItemsById(orderId, itemId)

		logger.info('Успешно получена позиция заказа по ID')
		res.status(200).json(orderItem)
	} catch (error) {
		next(error)
	}
}
