import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'
import logger from '../../utils/logger.utils'

export const removeCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { categoryId } = req.params

		if (!categoryId) {
			logger.warn('Category ID is missing in request')
			res.status(400).json({ message: 'Category ID is required' })
			return
		}

		const removedCategory = await categoriesServices.removeCategory(categoryId)

		if (!removedCategory) {
			logger.warn(`Failed to remove category: ID ${categoryId}`)
			res.status(400).json({ message: 'Failed to remove category' })
			return
		}

		logger.info(`Category removed successfully: ID ${categoryId}`)
		res.status(200).json({ message: 'Category removed successfully' })
	} catch (error) {
		logger.error(`Error removing category: ${error}`)
		next(error)
	}
}
