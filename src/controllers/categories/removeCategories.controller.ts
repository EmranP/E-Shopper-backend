import type { RequestHandler } from 'express'

export const removeCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
