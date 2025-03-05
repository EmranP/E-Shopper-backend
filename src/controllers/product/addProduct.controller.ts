import type { RequestHandler } from 'express'

export const addProduct: RequestHandler = (req, res, next) => {
	try {
	} catch (error) {
		next(error)
	}
}
