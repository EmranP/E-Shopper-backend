import type { NextFunction, Request, Response } from 'express'
import { userAuthService } from '../../services/auth/user-auth.services'
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

		await userAuthService.activate(link)
		const clientUrl = process.env.CLIENT_URL
		if (!clientUrl) return

		logger.info('Activate link success sended & redirected user to  page')
		res.redirect(clientUrl)
	} catch (error) {
		next(error)
	}
}
