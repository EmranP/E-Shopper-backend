import type { RequestHandler } from 'express'

export const updateCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
