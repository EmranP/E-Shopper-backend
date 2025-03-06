import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { getUsersController } from '../../controllers/user/getUsers.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerUser = Router({ mergeParams: true })

routerUser.get('/', authenticated, hasRole([ROLES.ADMIN]), getUsersController)

export default routerUser
