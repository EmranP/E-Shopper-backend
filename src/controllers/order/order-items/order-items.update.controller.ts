import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import type { IOrderItems } from '../../../models/order/order-items.model'
import { orderItemsService } from '../../../services/order/order-items.service'
import logger from '../../../utils/logger.utils'

export const editOrderItemsForAdminController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { itemId } = req.params
		const orderItemData = req.body as IOrderItems
		const userId = req.user?.id
		const userRole = req.user?.role

		const editOrderItem = await orderItemsService.updateOrderItems(
			userId as number,
			userRole as ROLES,
			itemId,
			orderItemData
		)

		logger.info('Успешно обновлены позиции заказа')
		res.status(201).json(editOrderItem)
	} catch (error) {
		next(error)
	}
}
