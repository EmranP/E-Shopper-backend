import { Router } from 'express'
import {
	activateController,
	getUsersController,
	loginController,
	logoutController,
	refreshController,
	registrationController,
} from '../../controllers/auth/index.export'

const routerAuth = Router({ mergeParams: true })

routerAuth.post('/registration', registrationController)
routerAuth.post('/login', loginController)
routerAuth.post('/logout', logoutController)
routerAuth.get('/activate/:link', activateController)
routerAuth.get('/refresh', refreshController)
routerAuth.get('/users', getUsersController)

export default routerAuth
