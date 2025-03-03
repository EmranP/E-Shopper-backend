import { Router } from 'express'
import { body } from 'express-validator'
import { ROLES } from '../../constants/roles'
import {
	activateController,
	getUsersController,
	loginController,
	logoutController,
	refreshController,
	registrationController,
} from '../../controllers/auth/index.export'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

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
routerAuth.get(
	'/users',
	authenticated,
	hasRole([ROLES.ADMIN]),
	getUsersController
)

export default routerAuth
