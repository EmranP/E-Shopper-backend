import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import {
	dbTableCartItems,
	dbTableOrderItems,
	dbTableOrders,
} from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'
import type { ICartItems } from '../cart/cart-items.model'
import type { IDeleteResponse } from '../cart/carts.model'

export interface IOrders {
	id: number
	user_id: number
	total_price: number
	status: string
	created_at: Date | string
	updated_at: Date | string
}

// GET

export const getModelOrdersForAdmin = async (): Promise<IOrders[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrders}`
		const sqlResult: QueryResult<IOrders> = await pool.query(sqlQuery)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказы для admin не найдены`)
		}

		logger.info(`Получениеы заказы для admin`)
		return sqlResult.rows
	} catch (error) {
		return logAndThrow('Ошибка при получении заказов для admin', error)
	}
}

export const getModelOrdersForCustomers = async (
	userId: number | string
): Promise<IOrders[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrders} WHERE user_id = $1`
		const sqlResult: QueryResult<IOrders> = await pool.query(sqlQuery, [userId])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказы для customers не найдены`)
		}

		logger.info(`Получениеы заказы для customers`)
		return sqlResult.rows
	} catch (error) {
		return logAndThrow('Ошибка при получении заказов для admin', error)
	}
}

export const getModelOrdersById = async (
	orderId: number | string
): Promise<IOrders> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableOrders} WHERE id = $1`
		const sqlResult: QueryResult<IOrders> = await pool.query(sqlQuery, [
			orderId,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказ с id=${orderId} не найден`)
		}

		logger.info(`Получение заказа с id=${orderId}`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(`Ошибка при получений orders по ID ${orderId}`, error)
	}
}

// POST
export const createModelOrders = async (
	userId: number | string | null,
	cartId: number | string | null,
	totalPrice: number
): Promise<IOrders> => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')

		const cartItemsQuery = `SELECT * FROM ${dbTableCartItems} WHERE cart_id = $1`
		const cartItemsResult = await client.query<ICartItems>(cartItemsQuery, [
			cartId,
		])

		if (cartItemsResult.rowCount === 0) {
			return logAndThrowNotFound(`Корзина с id=${cartId} пуста или не найдена`)
		}

		const orderQuery: string = `
		INSERT INTO ${dbTableOrders} (user_id, total_price) 
		VALUES($1, $2)
		RETURNING *;
		`
		const orderResult = await pool.query<IOrders>(orderQuery, [
			userId,
			totalPrice,
		])

		const order = orderResult.rows[0]

		if (!order) {
			return logAndThrow('Ошибка при создании заказа')
		}

		for (const item of cartItemsResult.rows) {
			const orderItemQuery = `
        INSERT INTO ${dbTableOrderItems} (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `
			await client.query(orderItemQuery, [
				order.id,
				item.product_id,
				item.quantity,
				item.price,
			])
		}

		const deleteCartItemsQuery = `DELETE FROM ${dbTableCartItems} WHERE cart_id = $1`
		await client.query(deleteCartItemsQuery, [cartId])

		await client.query('COMMIT')
		logger.info(`Новый заказ с id=${order.id} успешно создан, корзина очищена.`)
		return order
	} catch (error) {
		await client.query('COMMIT');
		return logAndThrow('Ошибка при создании заказа', error)
	} finally {
		client.release()
	}
}

// PATCH
export const editModelOrders = async (
	orderId: number | string,
	status: string
): Promise<IOrders> => {
	try {
		const sqlQuery: string = `
			UPDATE ${dbTableOrders} 
			SET status = $1
			WHERE id = $2
			RETURNING *;
		`
		const sqlResult: QueryResult<IOrders> = await pool.query(sqlQuery, [
			status,
			orderId,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказ с id=${orderId} не найден`)
		}

		logger.info(`Заказ с id=${orderId} успешно обновлён.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow('Ошибка при обновлении заказа', error)
	}
}

// DELETE
export const deleteModelOrders = async (
	orderId: number | string
): Promise<IDeleteResponse> => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const checkQuery: string = `SELECT * FROM ${dbTableOrders} WHERE id = $1`
		const checkResult: QueryResult<IOrders> = await pool.query(checkQuery, [
			orderId,
		])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(`Заказ с id=${orderId} не найден`)
		}

		const sqlQuery: string = `DELETE FROM ${dbTableOrders} WHERE id = $1`
		await pool.query(sqlQuery, [orderId])
		await client.query('COMMIT')

		logger.info(`Заказ с id=${orderId} успешно удалён.`)
		return { message: `Заказ с id=${orderId} успешно удалён.` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(`Ошибка при удалении oders с ID ${orderId}.`, error)
	} finally {
		client.release()
	}
}
