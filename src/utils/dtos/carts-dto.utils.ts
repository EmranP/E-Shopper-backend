import type { ICartItems } from '../../models/cart/cart-items.model'
import type { ICarts } from '../../models/cart/carts.model'

export interface ICartsDTO {
	id: number
	userId: number
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ICartItemsDTO  {
	id: number
	name: string
	imageUrl: string
	cartId: number | string
	productId: number | string
	quantity: number | string
	price: number
	createdAt: Date | string
	updatedAt: Date | string
	productCreatedAt: Date | string
	productUpdatedAt: Date | string
}

export interface ICartItemsCommonApiDTO {
	cartItems: ICartItemsDTO[]
	total: number
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
	private id: number
	private cartId: number | string
	private productId: number | string
	private quantity: number | string
	protected price: number
	private createdAt: Date | string
	private updatedAt: Date | string
	protected imageUrl: string
	protected name: string
	private productCreatedAt: Date | string
	private productUpdatedAt: Date | string


	constructor(model: ICartItems) {
		this.id = model.id
		this.cartId = model.cart_id
		this.productId = model.product_id
		this.name = model.name
		this.quantity = model.quantity
		this.price = model.price
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
		this.imageUrl = model.image_url
		this.productCreatedAt = model.product_created_at
		this.productUpdatedAt = model.product_updated_at

	}

	toPlain(): ICartItemsDTO {
		return {
			id: this.id,
			cartId: this.cartId,
			productId: this.productId,
			name: this.name,
			imageUrl: this.imageUrl,
			quantity: this.quantity,
			price: this.price,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			productCreatedAt: this.productCreatedAt,
			productUpdatedAt: this.productUpdatedAt
		}
	}
}
