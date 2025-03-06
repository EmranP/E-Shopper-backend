import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableProducts } from '../../constants/db-table-name'
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
		const sqlQuery: string = `SELECT * FROM ${dbTableProducts}`
		const sqlRequest: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery
		)

		return sqlRequest.rows || null
	} catch (error) {
		logger.error(`Ошибка при получении всех ${dbTableProducts}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to get ${dbTableProducts}`
		)
	}
}
export const getItemProduct = async (
	productId: string | number
): Promise<Partial<IResponseProductAPI> | null> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableProducts} WHERE id = $1 LIMIT 1`
		const sqlRequest: QueryResult<Partial<IResponseProductAPI>> =
			await pool.query(sqlQuery, [productId])

		return sqlRequest.rows[0] || null
	} catch (error) {
		logger.error(`Ошибка при поиске ${dbTableProducts} по id:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to get ${dbTableProducts} by id`
		)
	}
}
// GET SEARCH
export const searchProducts = async (
	search: string,
	limit: number,
	offset: number
): Promise<IResponseProductAPI[] | null> => {
	try {
		const sqlQuery: string = `
		SELECT *, 
      ts_rank(search_vector, to_tsquery('russian', $1) || to_tsquery('english', $1)) AS rank
    FROM ${dbTableProducts}
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
		logger.error(`Ошибка при поиске ${dbTableProducts}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to get ${dbTableProducts} by search`
		)
	}
}
// POST
export const createdProduct = async (
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

		const sqlQuery: string = `INSERT INTO ${dbTableProducts} 
		(name, description, image_url, price, stock, category_id, user_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING id, name,	description, price, stock, category_id, user_id, created_at, image_url;`
		const sqlRequest: QueryResult<Partial<IResponseProductAPI>> =
			await pool.query(sqlQuery, values)

		return sqlRequest.rows[0]
	} catch (error) {
		logger.error(`Ошибка при создании ${dbTableProducts}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to create ${dbTableProducts}`
		)
	}
}
// PATCH
export const updatedProduct = async (
	name: string,
	description: string,
	image_url: string,
	user_id: number,
	category_id: number,
	price: number,
	stock: number
): Promise<Partial<IResponseProductAPI> | null> => {
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

		const sqlQuery: string = `
			UPDATE ${dbTableProducts} 
			SET name = $1,
					description = $2,
					image_url = $3,
					price = $5,
					stock = $6
					category_id = $4,
			WHERE id = $7
		`
		const sqlRequest: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery,
			values
		)

		return sqlRequest.rows[0] || null
	} catch (error) {
		logger.error(`Ошибка при updated ${dbTableProducts}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to updated ${dbTableProducts}`
		)
	}
}
// DELETE
export const deleteProduct = async (
	productId: number | string
): Promise<void> => {
	try {
		const sqlQuery: string = `DELETE FROM ${dbTableProducts} WHERE id = $1`
		await pool.query(sqlQuery, [productId])
	} catch (error) {
		logger.error(`Ошибка при delete ${dbTableProducts}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to delete ${dbTableProducts}`
		)
	}
}
