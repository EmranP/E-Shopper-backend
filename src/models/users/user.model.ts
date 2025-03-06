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
		const sqlRequest: QueryResult<IUser> = await pool.query(sqlQuery)

		return sqlRequest.rows || null
	} catch (error) {
		logger.error('Ошибка при поиске users:', error)
		throw ApiError.BadRequest('Database error: unable to get users')
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
		const sqlRequest: QueryResult<IUser> = await pool.query(sqlQuery, [
			roleId,
			userId,
		])

		return sqlRequest.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при updated user-role:', error)
		throw ApiError.BadRequest('Database error: unable to updated user-role')
	}
}
// Delete
export const deleteModelUser = async (
	userId: string | number
): Promise<void> => {
	try {
		const sqlQuery: string = `DELETE FROM ${dbTableUsers} WHERE id = $1`

		await pool.query(sqlQuery, [userId])
	} catch (error) {
		logger.error(`Ошибка при delete ${dbTableUsers}:`, error)
		throw ApiError.BadRequest(
			`Database error: unable to delete ${dbTableUsers}`
		)
	}
}
