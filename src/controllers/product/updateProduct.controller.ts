import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'
import type { TRequestBodyPostProduct } from './addProduct.controller'

export const updateProduct: RequestHandler = async (req, res, next) => {
	try {
		const { productId } = req.params
		const updatedProductData: TRequestBodyPostProduct = req.body

		if (!productId) {
			res
				.status(404)
				.json({ message: `Продукт с id=${productId} не найдена из controller` })
			return
		}

		const updatedProduct = await productService.updateProduct(
			productId,
			updatedProductData
		)

		logger.info(`Продукт с id=${productId} успешно обновлена из controller`)
		res.status(201).json(updatedProduct)
	} catch (error) {
		next(error)
	}
}
