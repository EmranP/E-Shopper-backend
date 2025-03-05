import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import {
	addProduct,
	getProductItem,
	getProducts,
	removeProduct,
	updateProduct,
} from '../../controllers/product/index.export'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerProducts = Router({ mergeParams: true })

routerProducts.get('/', getProducts)
routerProducts.get('/:productId', getProductItem)
routerProducts.post(
	'/',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	addProduct
)
routerProducts.patch(
	'/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	updateProduct
)
routerProducts.delete(
	'/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	removeProduct
)

export default routerProducts
