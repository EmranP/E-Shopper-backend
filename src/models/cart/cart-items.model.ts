import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableCartItems, dbTableProducts } from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'
import type { IDeleteResponse } from './carts.model'
import type { IResponseProductAPI } from '../product/product.model'

export interface ICartItems extends Omit<IResponseProductAPI, 
	'category_id' | 
	'search_vector' | 'id' | 'created_at' | 'updated_at'> 
	{
		id: number
		cart_id: number | string
		product_id: number | string
		quantity: number | string
		price: number
		created_at: Date | string
		updated_at: Date | string,
		product_created_at: Date | string
		product_updated_at: Date | string
	}

export interface IResponseCommonCartItems {
	cartItems: ICartItems[]
	total: number
}

// GET
export const getModelCartItems = async (
	cartId: number | string, 
	limit: number | 'all', 
	offset: number
): Promise<IResponseCommonCartItems> => {
	try {
		let sqlQuery = `
			SELECT 
				ci.*, 
				p.id AS product_id,
				p.name,
				p.description,
				p.price,
				p.image_url,
				p.stock,
				p.created_at AS product_created_at,
				p.updated_at AS product_updated_at
			FROM ${dbTableCartItems} ci
			JOIN ${dbTableProducts} p ON p.id = ci.product_id
			WHERE ci.cart_id = $1
			ORDER BY ci.created_at DESC
		`

		const countQuery = `SELECT COUNT(*) FROM ${dbTableCartItems} WHERE cart_id = $1`

		const params = [cartId]

		if (limit !== 'all') {
			sqlQuery += ' LIMIT $2 OFFSET $3'
			params.push(limit, offset)
		}

		const [sqlResult, countResult] = await Promise.all([
			pool.query<ICartItems>(sqlQuery, params),
			pool.query<{count: string}>(countQuery, [cartId])
		])


		logger.info(
			`Успешное получение всех cart-items (${sqlResult.rowCount} записей) для cart_id ${cartId}.`
		)
		return {
			cartItems: sqlResult.rows,
			total: Number(countResult.rows[0].count)
		}
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно получить данные из ${dbTableCartItems}.`,
			error
		)
	}
}

// POST
export const addModelCartItems = async (
	cartItemData: Partial<ICartItems>
): Promise<ICartItems> => {
	try {
		const { cart_id, product_id, quantity, price } = cartItemData

		if (!cart_id || !product_id || !quantity || !price) {
			return logAndThrow(
				'Отсутствуют обязательные параметры: cart_id, product_id, quantity или price.'
			)
		}

		const sqlQuery: string = `
		INSERT INTO ${dbTableCartItems} 
		(cart_id, product_id, quantity, price) 
		VALUES ($1, $2, $3, $4)
		RETURNING *;
		`
		const values = [cart_id, product_id, quantity, price]
		const sqlResult: QueryResult<ICartItems> = await pool.query(
			sqlQuery,
			values
		)

		logger.info(`Cart-item добавлен в корзину ${cart_id}.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно создать cart-item.`,
			error
		)
	}
}

// PATCH
export const editModelCartItems = async (
	id: number | string,
	cartItemData: Partial<ICartItems>
): Promise<ICartItems> => {
	try {
		const { quantity } = cartItemData

		if (!quantity) {
			return logAndThrow(
				'Отсутствуют обязательные параметры: quantity.'
			)
		}

		const sqlQuery: string = `
		UPDATE ${dbTableCartItems} 
		SET quantity = $1
		WHERE id = $2
		RETURNING *;
		`
		const values = [quantity, id]
		const sqlResult: QueryResult<ICartItems> = await pool.query(
			sqlQuery,
			values
		)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Cart-items с ID ${id} не найден для обновления.`
			)
		}

		logger.info(`Cart-items с ID ${id} успешно обновлён`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(`Ошибка при обновлении cart-items с ID ${id}.`, error)
	}
}

// DELETE By ID
export const deleteModelCartItems = async (
	id: number | string
): Promise<IDeleteResponse> => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const checkQuery: string = `SELECT * FROM ${dbTableCartItems} WHERE id = $1`
		const checkResult: QueryResult<ICartItems> = await pool.query(checkQuery, [
			id,
		])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(`Cart-items с id=${id} не найдена из model`)
		}

		const sqlQuery: string = `DELETE FROM ${dbTableCartItems} WHERE id = $1`
		await pool.query(sqlQuery, [id])
		await client.query('COMMIT')

		logger.info(`Cart-item с ID ${id} успешно удалён.`)
		return { message: `Cart-item с ID ${id} успешно удалён из model.` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(`Ошибка при удалении продукта с ID ${id}.`, error)
	} finally {
		client.release()
	}
}
