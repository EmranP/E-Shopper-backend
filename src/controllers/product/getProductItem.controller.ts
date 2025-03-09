import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'

export const getProductItem: RequestHandler = async (req, res, next) => {
	try {
		const { productId } = req.params

		if (!productId) {
			res
				.status(404)
				.send({ message: `Продукт с id=${productId} не найдена из controller` })
			return
		}

		const productItem = await productService.getProductById(productId)

		logger.info(`Продукт с id=${productId} успешно найдена из controller`)
		res.status(200).json(productItem)
	} catch (error) {
		next(error)
	}
}
