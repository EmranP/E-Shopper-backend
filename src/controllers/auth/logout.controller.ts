import type { NextFunction, Request, Response } from 'express'

export const logoutController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
	} catch (error) {
		next(error)
	}
}
