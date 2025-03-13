import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableCarts } from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

export interface ICarts {
	id: number
	user_id: number
	created_at: Date | string
	updated_at: Date | string
}

export interface IDeleteResponse {
	message: string
}

// GET

// Retrieve all carts (Admin only)
export const getModelCarts = async (): Promise<ICarts[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableCarts};`
		const sqlResult: QueryResult<ICarts> = await pool.query(sqlQuery)

		logger.info(
			`Успешное получение всех carts для admin (${sqlResult.rowCount} записей)`
		)
		return sqlResult.rows
	} catch (error) {
		return logAndThrow(
			'Ошибка базы данных: невозможно получить корзину.',
			error
		)
	}
}

export const getModelCartById = async (
	userId: number
): Promise<ICarts | null> => {
	try {
		const sqlQuery: string = `
			SELECT * FROM ${dbTableCarts} WHERE user_id = $1
		`
		const sqlResult: QueryResult<ICarts> = await pool.query(sqlQuery, [userId])

		if (sqlResult.rowCount === 0) {
			return null
		}

		logger.info(`Корзина с user ID ${userId} успешно найден.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно получить корзину.`,
			error
		)
	}
}

// POST
export const addModelCart = async (userId: number): Promise<ICarts> => {
	try {
		const existingCartQuery: string = `SELECT * FROM ${dbTableCarts} WHERE user_id = $1;`
		const existingCartResult: QueryResult<ICarts> = await pool.query(
			existingCartQuery,
			[userId]
		)

		if (existingCartResult.rowCount && existingCartResult.rowCount > 0) {
			logger.warn(`Пользователь с ID ${userId} уже имеет корзину.`)
			return existingCartResult.rows[0]
		}

		const sqlQuery: string = `INSERT INTO ${dbTableCarts} (user_id) VALUES($1) RETURNING *;`
		const sqlResult: QueryResult<ICarts> = await pool.query(sqlQuery, [userId])

		logger.info(`Корзина пользователя с ID'${userId}' успешно создан.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно получить корзину.`,
			error
		)
	}
}

// DELETE
export const deleteModelCarts = async (
	id: number | string
): Promise<IDeleteResponse> => {
	try {
		const sqlQuery: string = `DELETE FROM ${dbTableCarts} WHERE id = $1 RETURNING id;`
		const sqlResult: QueryResult<ICarts> = await pool.query(sqlQuery, [id])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(`Carts с id=${id} не найдена.`)
		}

		logger.info(`Carts с ID ${id} успешно удалён.`)
		return { message: `Carts id=${id} успешно удалена.` }
	} catch (error) {
		return logAndThrow(`Ошибка при удалении carts с ID ${id}.`, error)
	}
}
