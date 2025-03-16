import { ROLES } from '../../constants/roles'
import type { IDeleteResponse } from '../../models/cart/carts.model'
import {
	createModelOrders,
	deleteModelOrders,
	editModelOrders,
	getModelOrdersById,
	getModelOrdersForAdmin,
	getModelOrdersForCustomers,
} from '../../models/order/orders.model'
import { OrdersDTO, type IOrdersDTO } from '../../utils/dtos/order.dto'
import { ApiError } from '../../utils/exists-error.utils'
import {
	logAndThrow,
	logAndThrowForbidden,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

class OrdersService {
	async getOrdersForAdmin(userRole: ROLES): Promise<IOrdersDTO[]> {
		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden('Нет прав для получения заказов.')
		} else if (userRole === undefined || null) {
			throw ApiError.UnauthorizedError()
		}

		const orders = await getModelOrdersForAdmin()

		if (!orders.length) logAndThrowNotFound('Заказы не найдены.')

		logger.info('Получены заказы для администратора.')
		return orders.map(order => new OrdersDTO(order))
	}

	async getOrdersForCustomers(userId: number): Promise<IOrdersDTO[]> {
		if (!userId) {
			throw ApiError.UnauthorizedError()
		}

		const ordersCustomers = await getModelOrdersForCustomers(userId)

		if (!ordersCustomers.length) logAndThrowNotFound('Заказы не найдены.')

		logger.info(`Получены заказы для пользователя ${userId}.`)
		return ordersCustomers.map(order => new OrdersDTO(order))
	}

	async getOrdersById(orderId: number | string): Promise<IOrdersDTO> {
		if (!orderId) return logAndThrow('Неверный идентификатор заказа.')

		const order = await getModelOrdersById(orderId)

		if (!order) {
			return logAndThrowNotFound('Заказ не найден.')
		}

		logger.info(`Получен заказ с ID ${orderId}.`)
		return new OrdersDTO(order).toPlain()
	}

	async createOrders(
		userId: number | string,
		totalPrice: number
	): Promise<IOrdersDTO> {
		if (!userId) throw ApiError.UnauthorizedError()
		if (!totalPrice || totalPrice <= 0)
			throw ApiError.BadRequest('Неверная цена заказа.')

		const newOrder = await createModelOrders(userId, totalPrice)

		if (!newOrder) logAndThrow('Не удалось создать заказ.')

		logger.info(`Создан новый заказ для пользователя ${userId}.`)
		return new OrdersDTO(newOrder).toPlain()
	}

	async editOrders(
		userRole: ROLES,
		orderId: number | string,
		status: string
	): Promise<IOrdersDTO> {
		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden(`У вас нет права  обновлять этот заказ. :(`)
		}

		if (!orderId || !status)
			logAndThrow('Неверные данные для обновления заказа.')

		const editOrder = await editModelOrders(orderId, status)

		if (!editOrder) {
			return logAndThrow('Заказ для обновления не найден.')
		}

		logger.info(`Заказ с ID ${orderId} успешно обновлён.`)
		return new OrdersDTO(editOrder).toPlain()
	}

	async removeOrders(
		userRole: ROLES,
		orderId: string | number
	): Promise<IDeleteResponse> {
		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden(`Нет прав для удаления заказов.`)
		}

		if (!orderId) {
			return logAndThrowNotFound('Неверный идентификатор заказа.')
		}

		const removeData = await deleteModelOrders(orderId)

		if (!removeData) {
			return logAndThrow('Заказ для удаления не найден.')
		}

		return removeData
	}
}

export const ordersService = new OrdersService()
