import { ApiError } from './exists-error.utils'
import logger from './logger.utils'

//! Helper function for logging and throwing errors
export const logAndThrow = (message: string, error?: unknown): never => {
	logger.error(`${message}: ${error instanceof Error ? error.message : error}`)
	throw ApiError.BadRequest(message)
}

// !Helper function for logging and throwing not found errors
export const logAndThrowNotFound = (
	message: string,
	error?: unknown
): never => {
	logger.error(`${message}: ${error instanceof Error ? error.message : error}`)
	throw ApiError.NotFound(message)
}

// !Helper function for logging and throwing not Forbidden errors
export const logAndThrowForbidden = (
	message: string,
	error?: unknown
): never => {
	logger.error(`${message}: ${error instanceof Error ? error.message : error}`)
	throw ApiError.Forbidden(message)
}
