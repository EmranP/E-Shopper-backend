import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableProducts } from '../../constants/db-table-name'
import { ROLES } from '../../constants/roles'
import {
	logAndThrow,
	logAndThrowForbidden,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
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
	user_id?: number | string
	image_url: string
	search_vector: string
}

export interface IResponseSearch {
	products: IResponseProductAPI[]
	total: number
}
// GET
export const getAllModelProducts = async (): Promise<IResponseProductAPI[]> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableProducts}`
		const sqlResult: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery
		)

		if (sqlResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Продукты не найдены в таблице ${dbTableProducts}`
			)
		}

		logger.info(
			`Успешное получение всех продуктов ${sqlResult.rowCount} записей)`
		)
		return sqlResult.rows
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно получить продукты.`,
			error
		)
	}
}
export const getModelProductById = async (
	productId: string | number
): Promise<IResponseProductAPI> => {
	try {
		const sqlQuery = `SELECT * FROM ${dbTableProducts} WHERE id = $1 LIMIT 1`
		const sqlResult: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery,
			[productId]
		)

		if (sqlResult.rowCount === 0) {
			logAndThrowNotFound(`Продукт с ID ${productId} не найден.`)
		}

		logger.info(`Продукт с ID ${productId} успешно найден.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(
			`Ошибка базы данных: невозможно получить продукт с ID ${productId}.`,
			error
		)
	}
}
// SEARCH
export const searchModelProducts = async (
	search: string,
	limit: number,
	offset: number
): Promise<IResponseSearch | null> => {
	try {
		let sqlQuery: string
		let values: (string | number)[]
		let countQuery: string
    let countValues: (string | number)[]


		if (search) {
			sqlQuery = `
				SELECT *, ts_rank(search_vector, plainto_tsquery($1)) AS rank
				FROM ${dbTableProducts}
				WHERE search_vector @@ plainto_tsquery($1)
				ORDER BY rank DESC
				LIMIT $2 OFFSET $3;`

			values = [search, limit, offset]

			countQuery = `SELECT COUNT(*) FROM ${dbTableProducts} WHERE search_vector @@ plainto_tsquery($1)`
      countValues = [search]
		} else {
			sqlQuery = `SELECT * FROM ${dbTableProducts} ORDER BY created_at DESC
				LIMIT $1 OFFSET $2`
			values = [limit, offset]

			countQuery = `SELECT COUNT(*) FROM ${dbTableProducts}`
      countValues = []
		}

		const [productsResult, countResult] = await Promise.all([
      pool.query<IResponseProductAPI>(sqlQuery, values),
      pool.query<{count: string}>(countQuery, countValues),
    ])

		if (productsResult.rowCount === 0) {
			logger.warn(`По запросу '${search}' ничего не найдено.`)
			return null
		}

		logger.info(
			`Найдено ${productsResult.rowCount} продуктов по запросу '${search}'.`
		)
		return {
      products: productsResult.rows,
      total: Number(countResult.rows[0].count),
    }
	} catch (error) {
		logAndThrow(`Ошибка базы данных: невозможно выполнить поиск.`, error)
		return null
	}
}
// POST
export const createdModelProduct = async (
	userId: number,
	product: Partial<IResponseProductAPI>
): Promise<IResponseProductAPI> => {
	try {
		const { name, description, image_url, price, stock, category_id } = product

		const sqlQuery: string = `INSERT INTO ${dbTableProducts} 
		(name, description, image_url, price, stock, category_id, user_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7) 
		RETURNING *;`

		const values = [
			name,
			description,
			image_url,
			price,
			stock,
			category_id,
			userId,
		]
		const sqlResult: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery,
			values
		)

		logger.info(`Продукт '${name}' успешно создан.`)
		return sqlResult.rows[0]
	} catch (error) {
		return logAndThrow(`Ошибка базы данных: невозможно создать продукт.`, error)
	}
}
// PATCH
export const updatedModelProduct = async (
	productId: number | string,
	product: Partial<IResponseProductAPI>
): Promise<IResponseProductAPI> => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')

		const checkQuery: string = `SELECT * FROM ${dbTableProducts} WHERE id = $1`
		const checkResult: QueryResult<IResponseProductAPI> = await pool.query(
			checkQuery,
			[productId]
		)

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Продукт с id=${productId} не найдена из model`
			)
		}

		const { name, description, image_url, price, stock, category_id } = product

		const sqlQuery = `
		UPDATE ${dbTableProducts} 
		SET name = $1, description = $2, image_url = $3, price = $4, stock = $5, category_id = $6
		WHERE id = $7
		RETURNING *;`
		const values = [
			name,
			description,
			image_url,
			price,
			stock,
			category_id,
			productId,
		]
		const sqlResult: QueryResult<IResponseProductAPI> = await pool.query(
			sqlQuery,
			values
		)
		await client.query('COMMIT')

		logger.info(`Продукт с ID ${productId} успешно обновлён.`)
		return sqlResult.rows[0]
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(
			`Ошибка при обновлении продукта с ID ${productId}.`,
			error
		)
	} finally {
		client.release()
	}
}
// DELETE
export const deleteModelProduct = async (
	productId: number | string,
	userId: number | string,
	userRole: ROLES | undefined
): Promise<{ message: string }> => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const checkQuery: string = `SELECT * FROM ${dbTableProducts} WHERE id = $1`
		const checkResult: QueryResult<IResponseProductAPI> = await pool.query(
			checkQuery,
			[productId]
		)

		if (checkResult.rowCount === 0) {
			return logAndThrowNotFound(
				`Продукт с id=${productId} не найдена из model`
			)
		}

		const product = checkResult.rows[0]

		if (product.user_id !== userId && userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden(
				`Удаление запрещено: у вас нет прав удалить продукт с ID ${productId}.`
			)
		}

		const sqlQuery = `DELETE FROM ${dbTableProducts} WHERE id = $1`
		await pool.query(sqlQuery, [productId])
		await client.query('COMMIT')

		logger.info(`Продукт с ID ${productId} успешно удалён.`)
		return { message: `Продукт id=${productId} успешно удалена из model` }
	} catch (error) {
		await client.query('ROLLBACK')
		return logAndThrow(`Ошибка при удалении продукта с ID ${productId}.`, error)
	} finally {
		client.release()
	}
}
