import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import { removeOrderItemsForAdminController } from '../../controllers/order/order-items/order-items.delete.controller'
import {
	getOrderItemsByIdController,
	getOrderItemsController,
	getOrderItemsForAdminController,
} from '../../controllers/order/order-items/order-items.get.controller'
import { editOrderItemsForAdminController } from '../../controllers/order/order-items/order-items.update.controller'
import { createOrdersController } from '../../controllers/order/orders/orders.create.controller'
import { deleteOrdersController } from '../../controllers/order/orders/orders.delete.controller'
import {
	getAllOrdersController,
	getCustomerOrdersController,
	getOrdersById,
} from '../../controllers/order/orders/orders.get.controller'
import { updateOrdersController } from '../../controllers/order/orders/orders.update.controller'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerOrders = Router({ mergeParams: true })

// Orders =================

// GET
routerOrders.get(
	'/admin',
	authenticated,
	hasRole([ROLES.ADMIN]),
	getAllOrdersController
)
routerOrders.get(
	'/',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getCustomerOrdersController
)
routerOrders.get(
	'/:orderId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getOrdersById
)
// POST
routerOrders.post(
	'/add',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	createOrdersController
)
// PATCH
routerOrders.patch(
	'/edit/:orderId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	updateOrdersController
)
// DELETE
routerOrders.delete(
	'/remove/:orderId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	deleteOrdersController
)

// Order-items ====================

// GET
routerOrders.get(
	'/items/admin',
	authenticated,
	hasRole([ROLES.ADMIN]),
	getOrderItemsForAdminController
)
routerOrders.get(
	'/:orderId/items',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getOrderItemsController
)
routerOrders.get(
	'/:orderId/items/:itemId',
	authenticated,
	hasRole([ROLES.CUSTOMER, ROLES.ADMIN]),
	getOrderItemsByIdController
)

// PATCH
routerOrders.patch(
	'/items/:itemId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	editOrderItemsForAdminController
)
// DELETE
routerOrders.delete(
	'/items/:itemId',
	authenticated,
	hasRole([ROLES.ADMIN]),
	removeOrderItemsForAdminController
)
export default routerOrders
