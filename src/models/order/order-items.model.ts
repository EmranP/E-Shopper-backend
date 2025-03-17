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
		const sqlResult = await pool.query<IOrderItems>(sqlQuery)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				'Заказы товаров для администратора не найдены.'
			)
		}

		logger.info('Успешное получение всех заказов товаров для администратора.')
		return sqlResult.rows
	} catch (error) {
		return logAndThrow(
			'Не удалось получить все заказы товаров для администратора.',
			error
		)
	}
}
export const getModelOrderItems = async (
	orderId: string | number
): Promise<IOrderItems[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrderItems} WHERE order_id = $1`
		const sqlResult = await pool.query<IOrderItems>(sqlQuery, [orderId])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Заказы товаров для заказа с ID ${orderId} не найдены.`
			)
		}

		logger.info(
			`Успешное получение заказов товаров для заказа с ID: ${orderId}.`
		)
		return sqlResult.rows
	} catch (error) {
		return logAndThrow(
			`Не удалось получить заказы товаров для заказа с ID: ${orderId}.`,
			error
		)
	}
}
export const getModelOrderItemsById = async (
	itemId: number | string,
	orderId: number | string
): Promise<IOrderItems> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrderItems} WHERE id = $1 AND order_id = $2`
		const sqlResult = await pool.query<IOrderItems>(sqlQuery, [itemId, orderId])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Заказ товара с ID ${itemId} для заказа с ID ${orderId} не найден.`
			)
		}

		logger.info(
			`Успешное получение заказа товара с ID: ${itemId} для заказа с ID: ${orderId}.`
		)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Не удалось получить заказ товара с ID: ${itemId} для заказа с ID: ${orderId}.`,
			error
		)
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
		const sqlResult = await pool.query<IOrderItems>(sqlQuery, values)

		logger.info(`Успешно добавлен заказ товара для заказа с ID: ${order_id}.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow('Не удалось создать заказ товара.', error)
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
		const sqlResult = await pool.query<IOrderItems>(sqlQuery, values)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Заказ товара с ID ${itemId} не найден для обновления.`
			)
		}

		logger.info(`Успешное обновление заказа товара с ID: ${itemId}.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow('Не удалось обновить заказ товара.', error)
	}
}
// DELETE
export const deleteModelOrderItems = async (
	itemId: number | string
): Promise<IDeleteResponse> => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const checkQuery = `SELECT * FROM ${dbTableOrderItems} WHERE id = $1`
		const checkResult = await pool.query<IOrderItems>(checkQuery, [itemId])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказ товара с ID ${itemId} не найден.`)
		}

		const sqlQuery = `DELETE FROM ${dbTableOrderItems} WHERE id = $1`
		await pool.query(sqlQuery, [itemId])
		await client.query('COMMIT')

		logger.info(`Успешное удаление заказа товара с ID: ${itemId}.`)
		return { message: `Успешное удаление заказа товара с ID: ${itemId}.` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(
			`Не удалось удалить заказ товара с ID: ${itemId}.`,
			error
		)
	} finally {
		client.release()
	}
}
