import type { RequestHandler } from 'express'
import { userService } from '../../services/auth/user.services'

export const logoutController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const refreshToken: string = req.cookies?.refreshToken

		const token = await userService.logout(refreshToken)
		res
			.clearCookie('refreshToken', { httpOnly: true, secure: true })
			.json(token)
	} catch (error: unknown) {
		next(error)
	}
}
