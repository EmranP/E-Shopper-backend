import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export interface IResponseProductAPI {
	id: number
	name: string
	description: string
	price: number
	stock: number
	category_id: number
	created_at: Date | string
	updated_at: Date | string
	image_url: string
	search_vector: string
}
// GET
export const getAllProducts = async (): Promise<
	IResponseProductAPI[] | null
> => {
	try {
		const sqlQuery: string = `SELECT * FROM products`
		const sqlRequest: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery
		)

		return sqlRequest.rows || null
	} catch (error) {
		logger.error('Ошибка при получении всех products:', error)
		throw ApiError.BadRequest('Database error: unable to get products')
	}
}
export const searchProducts = async (
	search: string,
	limit: number,
	offset: number
): Promise<IResponseProductAPI[] | null> => {
	try {
		const sqlQuery: string = `
		SELECT *, 
      ts_rank(search_vector, to_tsquery('russian', $1) || to_tsquery('english', $1)) AS rank
    FROM product
      WHERE search_vector @@ (to_tsquery('russian', $1) || to_tsquery('english', $1))
    ORDER BY rank DESC
    LIMIT $2 OFFSET $3`

		const values = [`${search}`, Number(limit), offset]
		const sqlRequest: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery,
			values
		)

		return sqlRequest.rows || null
	} catch (error) {
		logger.error('Ошибка при поиске product:', error)
		throw ApiError.BadRequest('Database error: unable to get product by search')
	}
}
export const getItemProduct = async (
	productId: string | number
): Promise<Partial<IResponseProductAPI> | null> => {
	try {
		const sqlQuery: string = `SELECT * FROM products WHERE id = $1 LIMIT 1`
		const sqlRequest: QueryResult<Partial<IResponseProductAPI>> =
			await pool.query(sqlQuery, [productId])

		return sqlRequest.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при поиске product по id:', error)
		throw ApiError.BadRequest('Database error: unable to get product by id')
	}
}

// POST
export const createProduct = async (
	name: string,
	description: string,
	image_url: string,
	user_id: number,
	category_id: number,
	price: number,
	stock: number
): Promise<Partial<IResponseProductAPI>> => {
	try {
		const values: [string, string, string, number, number, number, number] = [
			name,
			description,
			image_url,
			price,
			stock,
			category_id,
			user_id,
		]

		const sqlQuery: string = `INSERT INTO products 
		(name, description, image_url, price, stock, category_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id, name,	description, price, stock, category_id, user_id, create_at, image_url;`
		const sqlRequest: QueryResult<Partial<IResponseProductAPI>> =
			await pool.query(sqlQuery, values)

		return sqlRequest.rows[0]
	} catch (error) {
		logger.error('Ошибка при создании product:', error)
		throw ApiError.BadRequest('Database error: unable to create product')
	}
}
// PATCH

// DELETE
