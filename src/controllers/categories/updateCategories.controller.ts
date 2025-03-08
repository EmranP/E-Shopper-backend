import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'
import logger from '../../utils/logger.utils'

export const updateCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { categoryId } = req.params
		const { categoryName } = req.body as { categoryName: string }

		if (!categoryId || !categoryName) {
			logger.warn('Missing category ID or name in request')
			res.status(400).json({ message: 'Category ID and name are required' })
			return
		}

		const updatedCategory = await categoriesServices.updateCategory(
			categoryId,
			categoryName
		)

		if (!updatedCategory) {
			logger.error(`Failed to update category: ID ${categoryId}`)
			res.status(400).json({ message: 'Failed to update category' })
			return
		}

		logger.info(`Category updated successfully: ID ${categoryId}`)
		res.status(202).json(updatedCategory)
	} catch (error) {
		logger.error(`Error updating category: ${error}`)
		next(error)
	}
}
