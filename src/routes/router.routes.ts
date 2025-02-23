import { Router } from 'express'
import routerAuth from './auth/auth.routes'

const router = Router({ mergeParams: true })

router.use('/auth', routerAuth)

export default router
