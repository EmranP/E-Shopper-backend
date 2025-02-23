import { pool } from '../../config/db.config'

export interface ITokens {
	id: string | number
	user_id: string | number
	refresh_token: string | number
	created_at: string
}

export const getTokenById = async (
	userId: string | number
): Promise<Pick<ITokens, 'id' | 'refresh_token'> | null> => {
	const query = `SELECT id, refresh_token FROM tokens WHERE user_id = $1`
	const request = await pool.query(query, [userId])

	return request.rows.length > 0 ? request.rows[0] : null
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
