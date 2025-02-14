import { Pool } from 'pg'
import logger from '../utils/logger.utils'
import { DB_CONFIG } from './config'

export const pool = new Pool(DB_CONFIG)

export const checkDB = async () => {
	try {
		const res = await pool.query('SELECT NOW();')

		logger.info('Database connected:', res.rows[0])
	} catch (error) {
		logger.error('Database connection error:', error)
	}
}
