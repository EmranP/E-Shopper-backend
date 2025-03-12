import type { ICarts } from '../../models/cart/carts.model'

export interface ICartsDTO {
	id: number
	userId: number
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
