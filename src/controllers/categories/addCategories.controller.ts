import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'
import logger from '../../utils/logger.utils'

export const addCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { categoryName } = req.body as { categoryName: string }

		if (!categoryName) {
			logger.warn('Category name is missing in request body')
			res.status(400).json({ message: 'Category name is required' })
			return
		}

		const newCategory = await categoriesServices.addCategory(categoryName)

		if (!newCategory) {
			logger.error('Failed to add category')
			res.status(400).json({ message: 'Failed to add category' })
			return
		}

		logger.info(`Category added successfully: ${newCategory.name}`)
		res.status(201).json(newCategory)
	} catch (error) {
		logger.error(`Error adding category: ${error}`)
		next(error)
	}
}
