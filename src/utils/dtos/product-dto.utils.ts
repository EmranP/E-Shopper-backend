import type { IResponseProductAPI } from '../../models/product/product.model'

export interface IProductDTO {
	id: number
	name: string
	description: string
	price: number
	stock: number
	categoryId: number
	createdAt: Date | string
	updatedAt: Date | string
	imageUrl: string
	userId: number | string
	searchVector: string
}

export class ProductsDTO {
	id: number
	name: string
	description: string
	price: number
	stock: number
	categoryId: number
	createdAt: Date | string
	updatedAt: Date | string
	imageUrl: string
	userId: number | string
	searchVector: string

	constructor(model: IResponseProductAPI) {
		this.id = model.id
		this.name = model.name
		this.description = model.description
		this.price = model.price
		this.stock = model.stock
		this.categoryId = model.category_id
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
		this.imageUrl = model.image_url
		this.userId = model.user_id
		this.searchVector = model.search_vector
	}

	toPlain(): IProductDTO {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			stock: this.stock,
			categoryId: this.categoryId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			imageUrl: this.imageUrl,
			userId: this.userId,
			searchVector: this.searchVector,
		}
	}
}
