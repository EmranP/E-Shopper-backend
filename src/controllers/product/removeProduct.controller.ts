import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'

export const removeProduct: RequestHandler = async (req, res, next) => {
	try {
		const { productId } = req.params
		const userId = req.user?.id
		const userRole = req.user?.role

		if (!productId) {
			res.status(404).json({
				message: `Ошибка при удалении Продукт id=${productId} из controller`,
			})
			return
		}

		const removedProductData = await productService.removeProduct(
			productId,
			userId,
			userRole
		)

		logger.info(`Продукт с id=${productId} успешно удалена из controller`)
		res.status(201).json(removedProductData)
	} catch (error) {
		next(error)
	}
}
