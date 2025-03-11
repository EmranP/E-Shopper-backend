import { Router } from 'express'
import { ROLES } from '../../constants/roles'
import {
	addProduct,
	getProductItem,
	getProducts,
	removeProduct,
	searchProductsController,
	updateProduct,
} from '../../controllers/product/index.export'
import { authenticated } from '../../middlewares/auth.middleware'
import { hasRole } from '../../middlewares/hasRole.middleware'

const routerProducts = Router({ mergeParams: true })
// Get Products
routerProducts.get('/', getProducts)
routerProducts.get('/search', searchProductsController)
routerProducts.get('/:productId', getProductItem)
// Add Product
routerProducts.post(
	'/add',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	addProduct
)
// Updated Product
routerProducts.patch(
	'/edit/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	updateProduct
)
// Remove Product
routerProducts.delete(
	'/remove/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	removeProduct
)

export default routerProducts
