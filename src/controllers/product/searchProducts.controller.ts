import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'

export const searchProductsController: RequestHandler = async (
	req,
	res,
	next
) => {
	try {
		const { search, limit = 10, offset = 0 } = req.query

		if (!search) {
			res.status(400).json({ message: 'Поисковый запрос обязателен' })
			return
		}

		const products = await productService.searchProducts(
			String(search),
			Number(limit),
			Number(offset)
		)

		logger.info(`Продукты по запросу "${search}" успешно найдены из controller`)
		res.status(200).json(products)
	} catch (error) {
		next(error)
	}
}
