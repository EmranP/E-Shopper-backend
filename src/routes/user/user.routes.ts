import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { getUsersController } from '../../controllers/user/getUsers.controller'
import { removeUserController } from '../../controllers/user/removeUser.controller'
import { updatedUserController } from '../../controllers/user/updateUser.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerUser = Router({ mergeParams: true })

routerUser.get('/', authenticated, hasRole([ROLES.ADMIN]), getUsersController)
routerUser.patch(
	'/:userId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	updatedUserController
)
routerUser.delete(
	'/:userId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	removeUserController
)

export default routerUser
