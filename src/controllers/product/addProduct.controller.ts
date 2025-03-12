import type { RequestHandler } from 'express'
import { productService } from '../../services/product/products.service'
import type { IProductDTO } from '../../utils/dtos/product-dto.utils'
import logger from '../../utils/logger.utils'

export type TRequestBodyPostProduct = Omit<
	IProductDTO,
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
