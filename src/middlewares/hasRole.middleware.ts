import type { RequestHandler } from 'express'
import type { ROLES } from '../constants/roles'
import logger from '../utils/logger.utils'

export const hasRole = (roles: ROLES[]): RequestHandler => {
	return (req, res, next) => {
		if (!roles.includes(req.user?.role as ROLES)) {
			logger.warn('Access have just Admin')
			res.status(403).send({ error: 'Access forbidden' })

			return
		}

		next()
	}
}
