import dotenv from 'dotenv'
import express from 'express'
import { checkDB } from './config/db.config'
import { initializeDatabase } from './db/initDB'
import { defaultMiddleware } from './middlewares/appMiddleware.middleware'
import { errorMiddleware } from './middlewares/error-middleware.middleware'
import router from './routes/router.routes'
import logger from './utils/logger.utils'

dotenv.config()

const app = express()
const port = process.env.PORT

// Инициализация default middlewares
defaultMiddleware(app, express)

// Routes =================
app.use('/api', router)

// Custom Middleware
app.use(errorMiddleware)

// Start Server ===========
const startApp = async (): Promise<void> => {
	try {
		// Проверка подключение к базе данных
		await checkDB()
		await initializeDatabase()

		// Запуск сервера
		app.listen(port, () => {
			logger.info(`🚀 Сервер запущен на http://localhost:${port}`)
		})
	} catch (error) {
		logger.error(`❌ Ошибка запуска сервера: ${error}`)
		process.exit(1)
	}
}

startApp()
