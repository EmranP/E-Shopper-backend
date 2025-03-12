import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { addCartController } from '../../controllers/cart/carts/addCarts.controller'
import { getCartsController } from '../../controllers/cart/carts/getCarts.controller'
import { getCartByIdController } from '../../controllers/cart/carts/getCartsById.controller'
import { removeCartController } from '../../controllers/cart/carts/removedCarts.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

// !Todo: Make Orders, Order_items, Cart_item from db and Make logger file for show result logger

const routerCarts = Router({ mergeParams: true })

routerCarts.get(
	'/admin',
	authenticated,
	hasRole([ROLES.ADMIN]),
	getCartsController
)
routerCarts.get(
	'/',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getCartByIdController
)
routerCarts.post(
	'/add',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	addCartController
)
routerCarts.delete(
	'/remove/:cartId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	removeCartController
)

export default routerCarts
