import path from 'path'
import winston, { format, Logger, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const levels: winston.config.AbstractConfigSetLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
}

type LogLevel = keyof typeof levels

const level: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

const logFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.printf(
		({ timestamp, level, message }: winston.Logform.TransformableInfo) =>
			`[${timestamp}] ${level.toUpperCase()}: ${message}`
	)
)

const logger: Logger = winston.createLogger({
	level,
	levels,
	format: logFormat,
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), logFormat),
		}),
		new DailyRotateFile({
			filename: path.join(__dirname, '../../logs', 'error-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			level: 'error',
			maxFiles: '14d',
		}),
		new DailyRotateFile({
			filename: path.join(__dirname, '../../logs', 'combined-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			maxFiles: '14d',
		}),
	],
})

export default logger
