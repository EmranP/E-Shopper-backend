import { readFile } from 'fs/promises'
import path from 'path'
import { pool } from '../config/db.config'
import logger from '../utils/logger.utils'
import bcrypt from 'bcrypt'
import { createAdmin } from '../models/auth/auth-user.model'
import { ROLES } from '../constants/roles'
import { cartService } from '../services/cart/carts.service'

export const initializeDatabase = async () => {
	try {
		const initSql = await readFile(
			path.join(__dirname, './migrations/init.sql'),
			'utf-8'
		)
		await pool.query(initSql)
		logger.info('✅ База данных успешно проинициализирована')

		const adminLogin = 'admin'
		const adminEmail = 'admin@admin.com'
		const adminPass = process.env.ADMIN_PASS

		if (adminPass) {
			const hashedPass = await bcrypt.hash(adminPass, 10)
			const adminData = await createAdmin(
				adminLogin, 
				adminEmail, 
				hashedPass, 
				'activated', 
				true, 
				ROLES.ADMIN
			)

			if (adminData?.id) {
				await cartService.addCart(adminData.id)
				logger.info(
					`✅ Корзина для админа (ID: ${adminData.id}) успешно создана или уже существовала.`
				);
				logger.info('✅ Админ успешно создан или уже существовал.');
			} else {
				logger.error('❌ Не удалось создать или получить данные админа.');
			}
		} else {
				logger.warn('⚠️ Переменная окружения ADMIN_PASS не установлена. Админ не будет создан.');
		}
	} catch (error) {
		logger.error('❌ Ошибка инициализации базы данных:', error)
		throw error
	}
}
