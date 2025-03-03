import type { RequestHandler } from 'express'
import type { ROLES } from '../constants/roles'

export const hasRole = (roles: ROLES[]): RequestHandler => {
	return (req, res, next) => {
		if (!roles.includes(req.user?.role as ROLES)) {
			res.status(403).send({ error: 'Access forbidden' })

			return
		}

		next()
	}
}
