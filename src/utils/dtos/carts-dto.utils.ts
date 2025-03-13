import type { ICartItems } from '../../models/cart/cart-items.model'
import type { ICarts } from '../../models/cart/carts.model'

export interface ICartsDTO {
	id: number
	userId: number
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ICartItemsDTO {
	id: number
	cartId: number | string
	productId: number | string
	quantity: number | string
	price: number
	createdAt: Date | string
	updatedAt: Date | string
}

export class CartsDTO {
	id: number
	userId: number
	createdAt: Date | string
	updatedAt: Date | string

	constructor(model: ICarts) {
		this.id = model.id
		this.userId = Number(model.user_id)
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
	}

	toPlain(): ICartsDTO {
		return {
			id: this.id,
			userId: this.userId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}

export class CartItemsDTO {
	id: number
	cartId: number | string
	productId: number | string
	quantity: number | string
	price: number
	createdAt: Date | string
	updatedAt: Date | string

	constructor(model: ICartItems) {
		this.id = model.id
		this.cartId = model.cart_id
		this.productId = model.product_id
		this.quantity = model.quantity
		this.price = model.price
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
	}

	toPlain(): ICartItemsDTO {
		return {
			id: this.id,
			cartId: this.cartId,
			productId: this.productId,
			quantity: this.quantity,
			price: this.price,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
