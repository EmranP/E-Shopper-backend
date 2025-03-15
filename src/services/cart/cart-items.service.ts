import {
	addModelCartItems,
	deleteModelCartItems,
	editModelCartItems,
	getModelCartItems,
	type ICartItems,
} from '../../models/cart/cart-items.model'
import type { IDeleteResponse } from '../../models/cart/carts.model'
import {
	CartItemsDTO,
	type ICartItemsDTO,
} from '../../utils/dtos/carts-dto.utils'
import { ApiError } from '../../utils/exists-error.utils'

class CartItemsService {
	async getCartItems(cartId: number | string): Promise<ICartItemsDTO[]> {
		if (!cartId) throw ApiError.UnauthorizedError()

		const cartItems = await getModelCartItems(cartId)

		if (!cartItems?.length) {
			throw ApiError.NotFound('Элементы корзины не найдены в сервисе')
		}

		return cartItems.map(cartItem => new CartItemsDTO(cartItem).toPlain())
	}

	async addCartItems(
		cartItemData: Partial<ICartItems>
	): Promise<ICartItemsDTO> {
		if (!cartItemData || !cartItemData.cart_id || !cartItemData.product_id) {
			throw ApiError.BadRequest('Неверные данные элемента корзины')
		}

		const newCartItems = await addModelCartItems(cartItemData)

		if (!newCartItems) {
			throw ApiError.BadRequest('Не удалось добавить элементы корзины')
		}

		return new CartItemsDTO(newCartItems).toPlain()
	}

	async editCartItems(
		id: number | string,
		cartItemData: Partial<ICartItems>
	): Promise<ICartItemsDTO> {
		if (!id || !cartItemData.price || !cartItemData.quantity) {
			throw ApiError.BadRequest('ID или данные элемента корзины отсутствуют')
		}

		const editCartItems = await editModelCartItems(id, cartItemData)

		if (!editCartItems) {
			throw ApiError.BadRequest('Не удалось изменить элементы корзины')
		}

		return new CartItemsDTO(editCartItems).toPlain()
	}

	async removeCartItems(id: number | string): Promise<IDeleteResponse> {
		if (!id) {
			throw ApiError.NotFound('Требуется ID элемента корзины')
		}

		const removeCartItems = await deleteModelCartItems(id)

		if (!removeCartItems) {
			throw ApiError.BadRequest('Не удалось удалить элементы корзины')
		}

		return removeCartItems
	}
}

export const cartItemsService = new CartItemsService()
