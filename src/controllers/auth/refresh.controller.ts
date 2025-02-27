import type { NextFunction, Request, Response } from 'express'

export const refreshController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
