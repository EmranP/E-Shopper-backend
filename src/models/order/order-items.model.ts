export interface IOrderItems {
	id: number
	order_id: number | string
	product_id: number | string
	quantity: number
	price: number
	created_at: Date | string
	updated_at: Date | string
}
