import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { addCartItemsController } from '../../controllers/cart/cart-items/create.controller'
import { removeCartItemsController } from '../../controllers/cart/cart-items/delete.controller'
import { getCartItemsController } from '../../controllers/cart/cart-items/get.controller'
import { editCartItemsController } from '../../controllers/cart/cart-items/update.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerCartItems = Router({ mergeParams: true })

routerCartItems.get(
	'/:cartId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getCartItemsController
)
routerCartItems.post(
	'/add',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	addCartItemsController
)
routerCartItems.patch(
	'/edit/:cartId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	editCartItemsController
)
routerCartItems.delete(
	'/remove/:cartId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	removeCartItemsController
)

export default routerCartItems
