import {
	addModelCategory,
	deleteModelCategories,
	getModelAllCategories,
	getModelCategoriesById,
	updateModelCategories,
	type ICategories,
} from '../../models/categories/categories.model'
import {
	logAndThrow,
	logAndThrowNotFound,
} from '../../utils/log-and-throw.utils'
import logger from '../../utils/logger.utils'

class CategoriesServices {
	async getCategories(): Promise<ICategories[]> {
		const categoriesData = await getModelAllCategories()

		if (!categoriesData.length) {
			return logAndThrowNotFound('Категории не найдены из services')
		}

		logger.info('Категории успешно получены из services')
		return categoriesData
	}

	async getCategoryById(categoryId: string | number): Promise<ICategories> {
		const categoryData = await getModelCategoriesById(categoryId)

		if (!categoryData) {
			return logAndThrowNotFound(
				`Категория с id=${categoryId} не найдена из services`
			)
		}

		logger.info(`Категория с id=${categoryId} успешно найдена из services`)
		return categoryData
	}

	async addCategory(categoryName: string): Promise<ICategories> {
		const newCategory = await addModelCategory(categoryName)

		if (!newCategory) {
			logAndThrow('Ошибка при добавлении категории из services')
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
			logAndThrowNotFound(`Категория с id=${categoryId} не найдена из services`)
		}

		logger.info(`Категория с id=${categoryId} успешно обновлена из services`)
		return updateCategory
	}

	async removeCategory(
		categoryId: string | number
	): Promise<{ message: string }> {
		const removeCategory = await deleteModelCategories(categoryId)

		if (!removeCategory) {
			logAndThrow(`Ошибка при удалении категории id=${categoryId} из services`)
		}

		logger.info(`Категория с id=${categoryId} успешно удалена из services`)
		return removeCategory
	}
}

export const categoriesServices = new CategoriesServices()
