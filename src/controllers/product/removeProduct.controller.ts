import type { RequestHandler } from 'express'

export const removeProduct: RequestHandler = (req, res, next) => {
	try {
	} catch (error) {
		next(error)
	}
}
