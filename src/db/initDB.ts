import { readFile } from 'fs/promises'
import path from 'path'
import { pool } from '../config/db.config'
import logger from '../utils/logger.utils'

export const initializeDatabase = async () => {
	try {
		const initSql = await readFile(
			path.join(__dirname, './migrations/init.sql'),
			'utf-8'
		)
		await pool.query(initSql)
		logger.info('✅ База данных успешно проинициализирована')
	} catch (error) {
		logger.error('❌ Ошибка инициализации базы данных:', error)
		throw error
	}
}
