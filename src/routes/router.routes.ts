import { Router } from 'express'
import routerAuth from './auth/auth.routes'
import routerCartItems from './cart/cart-items.routes'
import routerCarts from './cart/carts.routes'
import routerCategories from './categories/categories.routes'
import routerOrders from './order/orders.route'
import routerProducts from './product/product.routes'
import routerUser from './user/user.routes'

const router = Router({ mergeParams: true })

router.use('/auth', routerAuth)
router.use('/user', routerUser)
router.use('/categories', routerCategories)
router.use('/product', routerProducts)
router.use('/cart', routerCarts)
router.use('/cart-item', routerCartItems)
router.use('/order', routerOrders)

export default router
