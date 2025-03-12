import {
	addModelCart,
	deleteModelCarts,
	getModelCartById,
	getModelCarts,
	type IDeleteResponse,
} from '../../models/cart/carts.model'
import { CartsDTO, type ICartsDTO } from '../../utils/dtos/carts-dto.utils'
import { ApiError } from '../../utils/exists-error.utils'

class CartService {
	async getCarts(): Promise<ICartsDTO[]> {
		const carts = await getModelCarts()
		if (!carts?.length) throw ApiError.NotFound('Carts не найдены из service.')

		return carts.map(cart => new CartsDTO(cart).toPlain())
	}

	async getCartById(userId: number): Promise<ICartsDTO> {
		if (!userId) throw ApiError.UnauthorizedError()

		const cart = await getModelCartById(userId)
		if (!cart)
			throw ApiError.NotFound(`Cart с userId=${userId} не найдена из service.`)

		return new CartsDTO(cart).toPlain()
	}

	async addCart(userId: number): Promise<ICartsDTO> {
		if (!userId) throw ApiError.UnauthorizedError()

		const newCart = await addModelCart(userId)
		return new CartsDTO(newCart).toPlain()
	}

	async removeCart(cartId: number | string): Promise<IDeleteResponse> {
		if (!cartId) throw ApiError.UnauthorizedError()

		const removedCart = await deleteModelCarts(cartId)
		return removedCart
	}
}

export const cartService = new CartService()
