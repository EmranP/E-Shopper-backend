import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'
import type { ROLES } from '../../constants/roles'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export interface IUser {
	login: any
	id: number
	name: string
	email: string
	password?: string
	role: ROLES
	created_at: Date | string
	updated_at: Date | string
	is_activated: boolean
	activation_link: string
}

// GET
export const getUserById = async (
	userId: string | number
): Promise<IUser | null> => {
	try {
		const query: string = `SELECT * FROM users WHERE id = $1`
		const result: QueryResult<IUser> = await pool.query(query, [userId])

		return result.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при поиске пользователя по id:', error)
		throw ApiError.BadRequest('Database error: unable to get user by id')
	}
}
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
	try {
		const query: string = `
			SELECT * FROM users WHERE email = $1 LIMIT 1
		`
		const result: QueryResult<IUser> = await pool.query(query, [email])

		return result.rows[0] || null
	} catch (error) {
		logger.error('Ошибка при поиске пользователя по email:', error)
		throw ApiError.BadRequest('Database error: unable to get user by email')
	}
}
export const getUserByActivateLink = async (
	activationLink: string
): Promise<IUser | null> => {
	try {
		const query: string = `SELECT id, name, email, role, created_at, updated_at, is_activated, activation_link FROM users WHERE activation_link = $1`
		const resultQuery: QueryResult<IUser> = await pool.query(query, [
			activationLink,
		])

		if (!resultQuery.rows.length) {
			logger.warn('Некоректная ссылка активации')
			return null
		}

		return resultQuery.rows[0]
	} catch (error) {
		logger.error('Ошибка при поиске пользователя по activation-link:', error)
		throw ApiError.BadRequest(
			'Database error: unable to get user by activation-link'
		)
	}
}
export const getUsers = async (): Promise<IUser[] | null> => {
	try {
		const query: string = `SELECT * FROM users`
		const result: QueryResult<IUser> = await pool.query(query)

		return result.rows || null
	} catch (error) {
		logger.error('Ошибка при поиске users:', error)
		throw ApiError.BadRequest('Database error: unable to get users')
	}
}
// POST
export const createUser = async (
	login: string,
	email: string,
	password: string,
	activationLink: string
): Promise<IUser> => {
	try {
		const query: string = `
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
		throw ApiError.BadRequest('Database error: unable to create user')
	}
}
// PATCH
export const updateUserByIsActivated = async (
	activationLink: string,
	isActivated: boolean
): Promise<IUser | null> => {
	try {
		const query: string = `
				UPDATE users 
				SET is_activated = $1 
				WHERE activation_link = $2
				RETURNING id, name, email, role, created_at, updated_at, is_activated, activation_link
			`
		const resultQuery: QueryResult<IUser> = await pool.query(query, [
			isActivated,
			activationLink,
		])

		if (!resultQuery.rowCount) {
			logger.warn(
				'Не удалось активировать пользователя: ссылка "${activationLink}" не найдена'
			)
			return null
		}

		return resultQuery.rows[0]
	} catch (error) {
		logger.error(
			`Ошибка при обновлении пользователя с activation_link "${activationLink}":`,
			error
		)
		throw ApiError.BadRequest(
			'Database error: Не удалось обновить статус активации пользователя'
		)
	}
}
