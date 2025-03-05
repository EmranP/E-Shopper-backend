import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'

export const defaultMiddleware = (
	app: Express,
	expressInstance: typeof express
): void => {
	// 🔒 Включаем защиту через helmet
	app.use(helmet())

	// Статичный файлы

	// Парсинг JSON
	app.use(expressInstance.json())

	// Настройка CORS
	app.use(
		cors({
			credentials: true,
			origin: process.env.CLIENT_URL,
		})
	)

	// Парсинг URL-кодированных данных
	app.use(
		expressInstance.urlencoded({
			extended: true,
		})
	)

	// Парсинг cookie
	app.use(cookieParser())
}
