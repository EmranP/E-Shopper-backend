import {
	addModelCategory,
	deleteModelCategories,
	getModelAllCategories,
	getModelCategoriesById,
	updateModelCategories,
	type ICategories,
} from '../../models/categories/categories.model'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

// !Todo: Should make Controller for categories

class CategoriesServices {
	async getCategories(): Promise<ICategories[]> {
		const categoriesData = await getModelAllCategories()

		if (!categoriesData.length) {
			logger.warn('Категории не найдены из services')
			throw ApiError.NotFound('Категории не найдены из services')
		}

		logger.info('Категории успешно получены из services')
		return categoriesData
	}

	async getCategoryById(categoryId: string | number): Promise<ICategories> {
		const categoryData = await getModelCategoriesById(categoryId)

		if (!categoryData) {
			logger.warn(`Категория с id=${categoryId} не найдена из services`)
			throw ApiError.NotFound(
				`Категория с id=${categoryId} не найдена из services`
			)
		}

		logger.info(`Категория с id=${categoryId} успешно найдена из services`)
		return categoryData
	}

	async addCategory(categoryName: string): Promise<ICategories> {
		const newCategory = await addModelCategory(categoryName)

		if (!newCategory) {
			logger.error('Ошибка при добавлении категории из services')
			throw ApiError.BadRequest('Ошибка при добавлении категории из services')
		}

		logger.info(`Категория '${categoryName}' успешно добавлена из services`)
		return newCategory
	}

	async updateCategory(
		categoryId: string | number,
		categoryName: string
	): Promise<ICategories> {
		const updateCategory = await updateModelCategories(categoryId, categoryName)

		if (!updateCategory) {
			logger.warn(
				`Категория с id=${categoryId} не найдена для обновления из services`
			)
			throw ApiError.NotFound(
				`Категория с id=${categoryId} не найдена из services`
			)
		}

		logger.info(`Категория с id=${categoryId} успешно обновлена из services`)
		return updateCategory
	}

	async removeCategory(
		categoryId: string | number
	): Promise<{ message: string }> {
		const removeCategory = await deleteModelCategories(categoryId)

		if (!removeCategory) {
			logger.warn(`Ошибка при удалении категории id=${categoryId} из services`)
			throw ApiError.BadRequest(
				`Ошибка при удалении категории id=${categoryId} из services`
			)
		}

		logger.info(`Категория с id=${categoryId} успешно удалена из services`)
		return removeCategory
	}
}

export const categoriesServices = new CategoriesServices()
