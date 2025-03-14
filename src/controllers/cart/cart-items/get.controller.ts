import type { RequestHandler } from 'express'

export const getCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
