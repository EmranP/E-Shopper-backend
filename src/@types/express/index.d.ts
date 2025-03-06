import type { IUser } from '../../models/auth/auth-user.model'

declare module 'express-serve-static-core' {
	interface Request {
		user?: IUser
	}
}
