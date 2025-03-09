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

// !Todo: Fixed Search, Add file for show logger result and Testing other controller post, patch, remove
const routerProducts = Router({ mergeParams: true })
// Get Products
routerProducts.get('/', getProducts)
routerProducts.get('/:productId', getProductItem)
routerProducts.get('/search', searchProductsController)
// Add Product
routerProducts.post(
	'/',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	addProduct
)
// Updated Product
routerProducts.patch(
	'/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	updateProduct
)
// Remove Product
routerProducts.delete(
	'/:productId',
	authenticated,
	hasRole([ROLES.ADMIN, ROLES.CUSTOMER]),
	removeProduct
)

export default routerProducts
