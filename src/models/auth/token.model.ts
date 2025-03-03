import bcrypt from 'bcrypt'
import type { QueryResult } from 'pg'
import { pool } from '../../config/db.config'

export interface ITokens {
	id: string | number
	user_id: string | number
	refresh_token: string
	created_at: string
}

export type TokenReturningType = Pick<ITokens, 'id' | 'refresh_token'> | null

export const getTokenByRefreshToken = async (
	refreshToken: string
): Promise<TokenReturningType> => {
	const query = `SELECT id, refresh_token FROM tokens`
	const result: QueryResult<ITokens> = await pool.query(query)

	for (const row of result.rows) {
		const isMatch = await bcrypt.compare(refreshToken, row.refresh_token)
		if (isMatch) {
			return { id: row.id, refresh_token: row.refresh_token }
		}
	}

	return null
}

export const createToken = async (
	userId: string | number,
	refreshToken: string
): Promise<ITokens> => {
	const query = `
		INSERT INTO tokens (user_id, refresh_token)
		VALUES ($1, $2)
		ON CONFLICT (user_id)
		DO UPDATE SET refresh_token = EXCLUDED.refresh_token
		RETURNING *
	`
	const request = await pool.query(query, [userId, refreshToken])

	return request.rows[0]
}

export const removeTokenData = async (
	refresh_token: string
): Promise<TokenReturningType> => {
	const query: string = `SELECT id, refresh_token FROM tokens`
	const result: QueryResult<ITokens> = await pool.query(query)

	for (const row of result.rows) {
		const isMatch = await bcrypt.compare(refresh_token, row.refresh_token)

		if (isMatch) {
			await pool.query(`DELETE FROM tokens WHERE user_id = $1`, [row.user_id])
			return { id: row.id, refresh_token }
		}
	}

	return null
}
