import dotenv from 'dotenv'
import express, {
	type NextFunction,
	type Request,
	type Response,
} from 'express'
import { checkDB } from './config/db.config'
import { defaultMiddleware } from './middlewares/appMiddleware.middleware'
import logger from './utils/logger.utils'

dotenv.config()

const app = express()
const port = process.env.PORT

// Инициализация middleware
defaultMiddleware(app, express)

// Routes =================

// Глобальный обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
	logger.error(`[ERROR]: ${err.message}`)
	res.status(500).json({
		error: 'Internal Server Error',
		message: err.message,
	})
})

// Start Server ===========
const startApp = async (): Promise<void> => {
	try {
		// Проверка подключение к базе данных
		await checkDB()

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
