import type { RequestHandler } from 'express'

export const deleteCartItemsController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
