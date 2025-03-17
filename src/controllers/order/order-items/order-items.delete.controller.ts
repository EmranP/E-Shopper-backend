import type { RequestHandler } from 'express'
import type { ROLES } from '../../../constants/roles'
import { orderItemsService } from '../../../services/order/order-items.service'
import logger from '../../../utils/logger.utils'

export const removeOrderItemsForAdminController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { itemId } = req.params
		const userId = req.user?.id
		const userRole = req.user?.role

		const removeOrderItems = await orderItemsService.deleteOrderItems(
			userId as number,
			userRole as ROLES,
			itemId
		)

		logger.info(`Success remove order-items ${itemId}`)
		res.status(201).json(removeOrderItems)
	} catch (error) {
		next(error)
	}
}
