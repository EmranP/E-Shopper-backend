import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'

export const getProducts: RequestHandler = async (req, res, next) => {
	try {
		const products = await productService.getProducts()

		logger.info('Продукты успешно получены из controller')
		res.status(200).json(products)
	} catch (error) {
		next(error)
	}
}
