import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableOrderItems } from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'
import type { IDeleteResponse } from '../cart/carts.model'

export interface IOrderItems {
	id: number
	order_id: number | string
	product_id: number | string
	quantity: number
	price: number
	created_at: Date | string
	updated_at: Date | string
}

// GET
export const getModelOrderItemsForAdmin = async (): Promise<IOrderItems[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrderItems}`
		const sqlResult: QueryResult<IOrderItems> = await pool.query(sqlQuery)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound('Заказы товаров для admin не найдены')
		}

		logger.info('Получениеы заказы товаров для admin')
		return sqlResult.rows
	} catch (error) {
		return logAndThrow('Ошибка при получении заказ товаров для admin', error)
	}
}
export const getModelOrderItems = async (
	orderId: string | number
): Promise<IOrderItems[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrderItems} WHERE order_id = $1`
		const sqlResult: QueryResult<IOrderItems> = await pool.query(sqlQuery, [
			orderId,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound('Заказы товаров для customers не найдены')
		}

		logger.info('Получениеы заказы товаров для admin')
		return sqlResult.rows
	} catch (error) {
		return logAndThrow('')
	}
}
export const getModelOrderItemsById = async (
	itemId: number | string,
	orderId: number | string
): Promise<IOrderItems> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrderItems} WHERE id = $1 AND order_id = $2`
		const sqlResult: QueryResult<IOrderItems> = await pool.query(sqlQuery, [
			itemId,
			orderId,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound('Order items not found')
		}

		logger.info('Success get order items')
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(`Ошибка при получений orders по ID ${orderId}`, error)
	}
}
// POST
export const createModelOrderItems = async (
	itemData: Partial<IOrderItems>
): Promise<IOrderItems> => {
	try {
		const { order_id, product_id, quantity, price } = itemData
		const sqlQuery: string = `
		INSERT INTO ${dbTableOrderItems} 
		(order_id, product_id, quantity, price)
		VALUES($1, $2, $3, $4)
		RETURNING *;
		`
		const values = [order_id, product_id, quantity, price]
		const sqlResult: QueryResult<IOrderItems> = await pool.query(
			sqlQuery,
			values
		)

		logger.info(`Order-items success added to orders ${order_id}`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow('Error create order-items')
	}
}
// PATCH
export const editModelOrderItems = async (
	itemId: string | number,
	itemData: Partial<IOrderItems>
): Promise<IOrderItems> => {
	try {
		const { order_id, product_id, quantity, price } = itemData
		const sqlQuery: string = `
		UPDATE ${dbTableOrderItems}
		SET order_id = $1, product_id = $2, 
		quantity = $3, price = $4
		WHERE id = $5
		RETURNING *;
		`
		const values = [order_id, product_id, quantity, price, itemId]
		const sqlResult: QueryResult<IOrderItems> = await pool.query(
			sqlQuery,
			values
		)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Order-items с ID ${itemId} не найден для обновления.`
			)
		}

		logger.info('Success updated order-items')
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow('Erorr handler')
	}
}
// DELETE
export const deleteModelOrderItems = async (
	itemId: number
): Promise<IDeleteResponse> => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const checkQuery: string = `SELECT * FROM ${dbTableOrderItems} WHERE id = $1`
		const checkResult: QueryResult<IOrderItems> = await pool.query(checkQuery, [
			itemId,
		])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Order-items с id=${itemId} не найдена из model`
			)
		}

		const sqlQuery: string = `DELETE FROM ${dbTableOrderItems} WHERE id = $1`
		await pool.query(sqlQuery, [itemId])
		await client.query('COMMIT')

		logger.info(`Order-item с ID ${itemId} успешно удалён.`)
		return { message: `Order-item с ID ${itemId} успешно удалён.` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(`Ошибка при удалении orderItems с ID ${itemId}.`, error)
	} finally {
		client.release()
	}
}
