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
import {
	ProductsDTO,
	type IProductDTO,
} from '../../utils/dtos/product-dto.utils'
import { ApiError } from '../../utils/exists-error.utils'
import {
	logAndThrow,
	logAndThrowForbidden,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

class ProductService {
	async getProducts(): Promise<IProductDTO[]> {
		const productsData = await getAllModelProducts()

		if (!productsData?.length) {
			return logAndThrowNotFound('Продукты не найдены из services')
		}

		const productDTOs = productsData.map(product => new ProductsDTO(product))
		const plainProducts = productDTOs.map(dto => dto.toPlain())

		logger.info('Продукты успешно получены из services')
		return plainProducts
	}

	async getProductById(
		productId: string | number
	): Promise<Partial<IProductDTO>> {
		const productItem = await getModelProductById(productId)

		if (!productItem) {
			return logAndThrowNotFound(
				`Продукт с id=${productId} не найдена из services`
			)
		}

		const productItemDTO = new ProductsDTO(productItem).toPlain()

		logger.info(`Продукт с id=${productId} успешно найдена из services`)
		return productItemDTO
	}

	async searchProducts(
		search: string,
		limit: number,
		offset: number
	): Promise<IProductDTO[]> {
		const searchProducts = await searchModelProducts(search, limit, offset)

		if (!searchProducts?.length) {
			return logAndThrowNotFound(
				`Продукты по запросу "${search}" не найдены из services`
			)
		}

		const searchProductDTOs = searchProducts.map(
			product => new ProductsDTO(product)
		)
		const searchPlainProducts = searchProductDTOs.map(dto => dto.toPlain())

		logger.info(`Продукты по запросу "${search}" успешно найдены из services`)
		return searchPlainProducts
	}

	async addedProduct(
		product: Partial<IResponseProductAPI>
	): Promise<IProductDTO> {
		const newProduct = await createdModelProduct(product)

		if (!newProduct) {
			return logAndThrow('Ошибка при добавлении Продукт из services')
		}

		const newProductDTO = new ProductsDTO(newProduct).toPlain()

		logger.info(`Продукт успешно добавлена из services: ${product}`)
		return newProductDTO
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

		const updatedProductDTO = new ProductsDTO(updatedProduct).toPlain()

		logger.info(`Продукт с id=${id} успешно обновлена из services`)
		return updatedProductDTO
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
