import type { NextFunction, Request, Response } from 'express'
import { userService } from '../../services/auth/user.services'
import logger from '../../utils/logger.utils'

interface IRequestParamsLink extends Request {
	params: {
		link: string
	}
}

export const activateController = async (
	req: IRequestParamsLink,
	res: Response,
	next: NextFunction
) => {
	try {
		const { link } = req.params

		if (!link) {
			logger.info('Params link is not defend')
			return
		}

		await userService.activate(link)

		const clientUrl = process.env.CLIENT_URL
		if (clientUrl) {
			res.redirect(clientUrl)
			return
		}
	} catch (error) {
		next(error)
	}
}
