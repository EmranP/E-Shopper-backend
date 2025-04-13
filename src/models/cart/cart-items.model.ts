import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableCartItems } from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'
import type { IDeleteResponse } from './carts.model'

export interface ICartItems {
	id: number
	cart_id: number | string
	product_id: number | string
	quantity: number | string
	price: number
	created_at: Date | string
	updated_at: Date | string
}

// GET
export const getModelCartItems = async (
	cartId: number | string
): Promise<ICartItems[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableCartItems} WHERE cart_id = $1;`
		const sqlResult: QueryResult<ICartItems> = await pool.query(sqlQuery, [
			cartId,
		])

		logger.info(
			`Успешное получение всех cart-items (${sqlResult.rowCount} записей) для cart_id ${cartId}.`
		)
		return sqlResult.rows
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
		const { quantity, price } = cartItemData

		if (!quantity || !price) {
			return logAndThrow(
				'Отсутствуют обязательные параметры: quantity или price.'
			)
		}

		const sqlQuery: string = `
		UPDATE ${dbTableCartItems} 
		SET quantity = $1, price = $2
		WHERE id = $3
		RETURNING *;
		`
		const values = [quantity, price, id]
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

		const checkQuery: string = `SELECT * FROM ${dbTableCartItems} WHERE product_id = $1`
		const checkResult: QueryResult<ICartItems> = await pool.query(checkQuery, [
			id,
		])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(`Cart-items с id=${id} не найдена из model`)
		}

		const sqlQuery: string = `DELETE FROM ${dbTableCartItems} WHERE product_id = $1`
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
