import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { addCategoriesController } from '../../controllers/categories/addCategories.controller'
import { getCategoriesController } from '../../controllers/categories/getCategories.controller'
import { getCategoryByIdController } from '../../controllers/categories/getCategoryById.controller'
import { removeCategoriesController } from '../../controllers/categories/removeCategories.controller'
import { updateCategoriesController } from '../../controllers/categories/updateCategories.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerCategories = Router({ mergeParams: true })

routerCategories.get('/', getCategoriesController)
routerCategories.get('/:categoryId', getCategoryByIdController)
routerCategories.post(
	'/add',
	authenticated,
	hasRole([ROLES.ADMIN]),
	addCategoriesController
)
routerCategories.patch(
	'/edit/:categoryId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	updateCategoriesController
)
routerCategories.delete(
	'/remove/:categoryId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	removeCategoriesController
)

export default routerCategories
