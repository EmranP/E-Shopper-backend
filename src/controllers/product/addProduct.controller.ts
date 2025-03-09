import type { RequestHandler } from 'express'
import type { IResponseProductAPI } from '../../models/product/product.model'
import { productService } from '../../services/product/products.service'
import logger from '../../utils/logger.utils'

export type TRequestBodyPostProduct = Omit<
	IResponseProductAPI,
	'search_vector' | 'created_at' | 'updated_at'
>

export const addProduct: RequestHandler = async (req, res, next) => {
	try {
		const productData: TRequestBodyPostProduct = req.body

		if (!productData) {
			res.status(400).send({ message: 'Ошибка при добвалений нового product' })
			return
		}

		const newProduct = await productService.addedProduct(productData)

		logger.info(
			`Продукт успешно добавлена из controller: ${{ ...productData }}`
		)
		res.status(201).json(newProduct)
	} catch (error) {
		next(error)
	}
}
