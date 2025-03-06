import { Router } from 'express'
import { body } from 'express-validator'
import {
	activateController,
	loginController,
	logoutController,
	refreshController,
	registrationController,
} from '../../controllers/auth/index.export'

const routerAuth = Router({ mergeParams: true })

routerAuth.post(
	'/registration',
	body('login').isLength({ min: 3, max: 20 }),
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	registrationController
)
routerAuth.post('/login', loginController)
routerAuth.post('/logout', logoutController)
routerAuth.get('/activate/:link', activateController)
routerAuth.get('/refresh', refreshController)

export default routerAuth
