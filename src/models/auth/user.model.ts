import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import logger from '../../utils/logger.utils'

export interface IUser {
	login: any
	id: number
	name: string
	email: string
	password?: string
	role: number | string
	created_at: Date | string
	updated_at: Date | string
	is_activated: boolean
	activation_link: string
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
	try {
		const query = `
			SELECT id, name, email, role, created_at, updated_at, is_activated, activation_link 
	  	FROM users WHERE email = $1 LIMIT 1
		`
		const result: QueryResult<IUser> = await pool.query(query, [email])

		return result.rows.length > 0 ? result.rows[0] : null
	} catch (error) {
		logger.error('Ошибка при поиске пользователя по email:', error)
		throw new Error('Database error: unable to get user by email')
	}
}

export const createUser = async (
	login: string,
	email: string,
	password: string,
	activationLink: string
): Promise<IUser> => {
	try {
		const query = `
		INSERT INTO users (name, email, password, activation_link)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, email, role, created_at, updated_at, is_activated, activation_link`
		const result: QueryResult<IUser> = await pool.query(query, [
			login,
			email,
			password,
			activationLink,
		])
		return result.rows[0]
	} catch (error) {
		logger.error('Ошибка при создании пользователя:', error)
		throw new Error('Database error: unable to create user')
	}
}
