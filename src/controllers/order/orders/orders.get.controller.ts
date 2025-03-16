import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import { ordersService } from '../../../services/order/orders.service'
import logger from '../../../utils/logger.utils'

export const getAllOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const adminRole = req.user?.role

		const ordersForAdmin = await ordersService.getOrdersForAdmin(
			adminRole as ROLES
		)

		logger.info('Получение всех заказов для администратора')
		res.status(200).json(ordersForAdmin)
	} catch (error) {
		next(error)
	}
}

export const getCustomerOrdersController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id

		const ordersCustomers = await ordersService.getOrdersForCustomers(
			userId as number
		)

		logger.info('Успешное получение заказов клиента')
		res.status(200).json(ordersCustomers)
	} catch (error) {
		next(error)
	}
}

export const getOrdersById: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const userId = req.user?.id
		const { orderId } = req.params

		const order = await ordersService.getOrdersById(orderId)

		if (!order || userId !== order.userId) {
			res.status(400).json({ message: 'Ошибка при получении заказа по ID' })
			return
		}

		logger.info(`Успешное получение заказа с ID ${orderId}`)
		res.status(200).json(order)
	} catch (error) {
		next(error)
	}
}
