import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import { dbTableUsers } from '../../constants/db-table-name'
import type { ROLES } from '../../constants/roles'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'
import type { IUser } from '../auth/auth-user.model'

// Get
export const getModelUsers = async (): Promise<IUser[] | null> => {
	try {
		const sqlQuery: string = `SELECT * FROM ${dbTableUsers}`
		const sqlResult: QueryResult<IUser> = await pool.query(sqlQuery)

		return sqlResult.rows || null
	} catch (error) {
		logger.error('Ошибка при поиске users:', error)
		throw ApiError.BadRequest('Database error: unable to get users')
	}
}
export const getModelUserById = async (
	userId: string | number
): Promise<IUser | null> => {
	try {
		const query: string = `SELECT * FROM ${dbTableUsers} WHERE id = $1`
		const result: QueryResult<IUser> = await pool.query(query, [userId])

		return result.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при поиске пользователя по id:', error)
		throw ApiError.BadRequest(
			`Database error: unable to get ${dbTableUsers} by id`
		)
	}
}
// Patch
export const updatedModelUser = async (
	roleId: ROLES,
	userId: string | number
): Promise<IUser | null> => {
	try {
		const sqlQuery: string = `
			UPDATE ${dbTableUsers}
			SET role = $1
			WHERE id = $2
			RETURNING id, name, email, role, created_at, updated_at
		`
		const sqlResult: QueryResult<IUser> = await pool.query(sqlQuery, [
			roleId,
			userId,
		])

		return sqlResult.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при updated user-role:', error)
		throw ApiError.BadRequest('Database error: unable to updated user-role')
	}
}
// Delete
export const deleteModelUser = async (
	userId: string | number
): Promise<IUser | null> => {
	try {
		const sqlQuery: string = `
			DELETE FROM ${dbTableUsers} WHERE id = $1
			RETURNING id, name, email, role, created_at, updated_at
		`

		const sqlResult: QueryResult<IUser> = await pool.query(sqlQuery, [userId])

		return sqlResult.rows[0] || null
	} catch (error) {
		logger.error(`Database error while deleting user ${userId}:`, error)
		throw ApiError.BadRequest('Database error: unable to delete user')
	}
}
