import { ROLES } from '../../constants/roles'
import type { IDeleteResponse } from '../../models/cart/carts.model'
import {
	createModelOrderItems,
	deleteModelOrderItems,
	editModelOrderItems,
	getModelOrderItems,
	getModelOrderItemsById,
	getModelOrderItemsForAdmin,
	type IOrderItems,
} from '../../models/order/order-items.model'
import { OrderItemsDTO, type IOrderItemsDTO } from '../../utils/dtos/order.dto'
import { ApiError } from '../../utils/exists-error.utils'
import {
	logAndThrow,
	logAndThrowForbidden,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'

class OrderItemsService {
	async getAllOrderItemsForAdmin(
		userId: number,
		userRole: number
	): Promise<IOrderItemsDTO[]> {
		if (!userId) {
			throw ApiError.UnauthorizedError()
		}

		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden('Только администраторы имеют доступ.')
		}

		const orderItemsForAdmin = await getModelOrderItemsForAdmin()

		if (!orderItemsForAdmin?.length) {
			return logAndThrowNotFound('Заказанные товары не найдены.')
		}

		return orderItemsForAdmin.map(orderItem =>
			new OrderItemsDTO(orderItem).toPlain()
		)
	}

	async getAllOrderItems(orderId: string | number): Promise<IOrderItemsDTO[]> {
		if (!orderId) {
			return logAndThrowNotFound('ID заказа не найден.')
		}

		const orderItems = await getModelOrderItems(orderId)

		if (!orderItems?.length) {
			return logAndThrowNotFound('Не найдено заказов для клиентов.')
		}

		return orderItems.map(orderItem => new OrderItemsDTO(orderItem).toPlain())
	}

	async getOrderItemsById(
		itemId: number | string,
		orderId: number | string
	): Promise<IOrderItemsDTO> {
		if (!itemId || !orderId) {
			return logAndThrowNotFound('Заказанный товар не найден по указанному id.')
		}

		const orderItem = await getModelOrderItemsById(itemId, orderId)

		if (!orderItem) {
			return logAndThrowNotFound('Ошибка при получении заказа товара.')
		}

		return new OrderItemsDTO(orderItem).toPlain()
	}

	async createOrderItems(
		itemData: Partial<IOrderItems>
	): Promise<IOrderItemsDTO> {
		if (
			!itemData.order_id ||
			!itemData.product_id ||
			!itemData.quantity ||
			!itemData.price
		) {
			return logAndThrow('Ошибка в данных для создания товара.')
		}

		const newOrderItems = await createModelOrderItems(itemData)

		if (!newOrderItems) {
			return logAndThrow('Ошибка при создании нового заказа товара.')
		}

		return new OrderItemsDTO(newOrderItems).toPlain()
	}

	async updateOrderItems(
		userId: number,
		userRole: ROLES,
		itemId: number | string,
		itemData: Partial<IOrderItems>
	): Promise<IOrderItemsDTO> {
		if (!userId) {
			throw ApiError.UnauthorizedError()
		}

		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden('Только администраторы имеют доступ.')
		}

		if (!itemId) {
			return logAndThrow(
				'Ошибка при редактировании товара элемент не был найден.'
			)
		}

		const { order_id, product_id, quantity, price } = itemData

		if (!order_id || !product_id || !quantity || !price) {
			return logAndThrow(
				'Ошибка при редактировании товара неверно указоны данный'
			)
		}

		const editOrderItem = await editModelOrderItems(itemId, itemData)

		if (!editOrderItem) {
			return logAndThrow('Ошибка при редактировании товара.')
		}

		return new OrderItemsDTO(editOrderItem).toPlain()
	}

	async deleteOrderItems(
		userId: number,
		userRole: ROLES,
		itemId: number | string
	): Promise<IDeleteResponse> {
		if (!userId) {
			throw ApiError.UnauthorizedError()
		}

		if (userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden('Только администраторы имеют доступ.')
		}

		if (!itemId) {
			return logAndThrowNotFound('Товар для удаления не найден.')
		}

		const removeOrderItems = await deleteModelOrderItems(itemId)

		if (!removeOrderItems) {
			return logAndThrow('Ошибка при удалении заказа товара.')
		}

		return removeOrderItems
	}
}

export const orderItemsService = new OrderItemsService()
