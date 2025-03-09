import { ROLES } from '../../constants/roles'
import {
	createdModelProduct,
	deleteModelProduct,
	getAllModelProducts,
	getModelProductById,
	searchModelProducts,
	updatedModelProduct,
	type IResponseProductAPI,
} from '../../models/product/product.model'
import { ApiError } from '../../utils/exists-error.utils'
import {
	logAndThrow,
	logAndThrowForbidden,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

class ProductService {
	async getProducts(): Promise<IResponseProductAPI[]> {
		const productsData = await getAllModelProducts()

		if (!productsData?.length) {
			return logAndThrowNotFound('Продукты не найдены из services')
		}

		logger.info('Продукты успешно получены из services')
		return productsData
	}

	async getProductById(
		productId: string | number
	): Promise<Partial<IResponseProductAPI>> {
		const productItem = await getModelProductById(productId)

		if (!productItem) {
			return logAndThrowNotFound(
				`Продукт с id=${productId} не найдена из services`
			)
		}

		logger.info(`Продукт с id=${productId} успешно найдена из services`)
		return productItem
	}

	async searchProducts(
		search: string,
		limit: number,
		offset: number
	): Promise<IResponseProductAPI[]> {
		const searchProducts = await searchModelProducts(search, limit, offset)

		if (!searchProducts?.length) {
			return logAndThrowNotFound(
				`Продукты по запросу "${search}" не найдены из services`
			)
		}

		logger.info(`Продукты по запросу "${search}" успешно найдены из services`)
		return searchProducts
	}

	async addedProduct(
		product: Partial<IResponseProductAPI>
	): Promise<IResponseProductAPI> {
		const newProduct = await createdModelProduct(product)

		if (!newProduct) {
			return logAndThrow('Ошибка при добавлении Продукт из services')
		}

		logger.info(`Продукт успешно добавлена из services: ${product}`)
		return newProduct
	}

	async updateProduct(
		id: number | string,
		product: Partial<IResponseProductAPI>,
		userId: number | undefined,
		userRole: ROLES | undefined
	): Promise<Partial<IResponseProductAPI>> {
		if (product.user_id !== userId && userRole !== ROLES.ADMIN) {
			return logAndThrowForbidden(
				`Обновление запрещено: у вас нет прав обновлять продукт с ID ${id}.`
			)
		}

		const updatedProduct = await updatedModelProduct(id, product)

		if (!updatedProduct) {
			return logAndThrowNotFound(`Продукт с id=${id} не найдена из services`)
		}

		logger.info(`Продукт с id=${id} успешно обновлена из services`)
		return updatedProduct
	}

	async removeProduct(
		id: string | number,
		userId: number | undefined,
		userRole: ROLES | undefined
	): Promise<{ message: string }> {
		if (!userId || !userRole) {
			throw ApiError.UnauthorizedError()
		}

		const removedProduct = await deleteModelProduct(id, userId, userRole)

		if (!removedProduct) {
			return logAndThrowNotFound(
				`Ошибка при удалении Продукт id=${id} из services`
			)
		}

		logger.info(`Продукт с id=${id} успешно удалена из services`)
		return removedProduct
	}
}

export const productService = new ProductService()
