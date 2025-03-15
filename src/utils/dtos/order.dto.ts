import type { IOrderItems } from '../../models/order/order-items.model'
import type { IOrders } from '../../models/order/orders.model'

export interface IOrdersDTO {
	id: number
	userId: number | string
	totalPrice: number | string
	status: string
	createdAt: Date | string
	updatedAt: Date | string
}

export interface IOrderItemsDTO {
	id: number
	orderId: number | string
	productId: number | string
	quantity: number
	price: number
	createdAt: Date | string
	updatedAt: Date | string
}

export class OrdersDTO {
	id: number
	userId: number | string
	totalPrice: number | string
	status: string
	createdAt: Date | string
	updatedAt: Date | string

	constructor(model: IOrders) {
		this.id = model.id
		this.userId = model.user_id
		this.totalPrice = model.total_price
		this.status = model.status
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
	}

	toPlain(): IOrdersDTO {
		return {
			id: this.id,
			userId: this.userId,
			totalPrice: this.totalPrice,
			status: this.status,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}

export class OrderItemsDTO {
	id: number
	orderId: number | string
	productId: number | string
	quantity: number
	price: number
	createdAt: Date | string
	updatedAt: Date | string

	constructor(model: IOrderItems) {
		this.id = model.id
		this.orderId = model.order_id
		this.productId = model.product_id
		this.quantity = model.quantity
		this.price = model.price
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
	}

	toPlain(): IOrderItemsDTO {
		return {
			id: this.id,
			orderId: this.orderId,
			productId: this.productId,
			quantity: this.quantity,
			price: this.price,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}
}
