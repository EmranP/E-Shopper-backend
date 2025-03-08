import { Router } from 'express'
import routerAuth from './auth/auth.routes'
import routerCategories from './categories/categories.routes'
import routerProducts from './product/product.routes'
import routerUser from './user/user.routes'

const router = Router({ mergeParams: true })

router.use('/auth', routerAuth)
router.use('/user', routerUser)
router.use('/categories', routerCategories)
router.use('/product', routerProducts)

export default router
