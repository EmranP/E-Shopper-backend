import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableCategories } from '../../constants/db-table-name'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

export interface ICategories {
	id: number | string
	name: string
	created_at: Date | string
	updated_at: Date | string
}

// GET
export const getModelAllCategories = async (): Promise<ICategories[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableCategories}`
		const sqlResult: QueryResult<ICategories> = await pool.query(sqlQuery)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound('Категории не найдены из model')
		}

		logger.info('Категории успешно получены из model')
		return sqlResult.rows
	} catch (error) {
		return logAndThrow('Ошибка при получении категорий из model', error)
	}
}

export const getModelCategoriesById = async (
	categoryId: string | number
): Promise<ICategories> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableCategories} WHERE id = $1`
		const sqlResult: QueryResult<ICategories> = await pool.query(sqlQuery, [
			categoryId,
		])

		if (sqlResult.rowCount === 0) {
			logAndThrowNotFound(`Категория с id=${categoryId} не найдена из model`)
		}

		logger.info(`Категория id=${categoryId} успешно найдена из model`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка при получении категории id=${categoryId} из model`,
			error
		)
	}
}
// Post
export const addModelCategory = async (
	categoryName: string
): Promise<ICategories> => {
	try {
		const sqlQuery: string = `
			INSERT INTO ${dbTableCategories} 
			VALUES ($1)
			RETURNING *;
		`
		const sqlResult: QueryResult<ICategories> = await pool.query(sqlQuery, [
			categoryName,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound('Не удалось добавить категорию из model')
		}

		logger.info('Категория успешно добавлена из model')
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка при добавлении категории (${categoryName}) из model`,
			error
		)
	}
}
// PATCH
export const updateModelCategories = async (
	categoryId: string | number,
	categoryName: string
): Promise<ICategories> => {
	try {
		const sqlQuery: string = `
			UPDATE ${dbTableCategories}
			SET name = $1
			WHERE id = $2
			RETURNING *;
		`
		const sqlResult: QueryResult<ICategories> = await pool.query(sqlQuery, [
			categoryName,
			categoryId,
		])

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Категория с id=${categoryId} не найдена из model`
			)
		}

		logger.info(`Категория id=${categoryId} успешно обновлена из model`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка при обновлении категории id=${categoryId} из model`,
			error
		)
	}
}
// DELETE
export const deleteModelCategories = async (
	categoryId: string | number
): Promise<{ message: string }> => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN') // Начинаем транзакцию

		// Проверяем существование категории перед удалением
		const checkQuery = `SELECT * FROM ${dbTableCategories} WHERE id = $1`
		const checkResult = await client.query(checkQuery, [categoryId])

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Категория с id=${categoryId} не найдена из model`
			)
		}

		const sqlQuery = `DELETE FROM ${dbTableCategories} WHERE id = $1`
		await client.query(sqlQuery, [categoryId])
		await client.query('COMMIT') // Подтверждаем транзакцию

		logger.info(`Категория id=${categoryId} успешно удалена из model`)
		return { message: `Категория id=${categoryId} успешно удалена` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(
			`Ошибка при удалении категории id=${categoryId} из model`,
			error
		)
	} finally {
		client.release()
	}
}
