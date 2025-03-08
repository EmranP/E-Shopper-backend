import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'
import logger from '../../utils/logger.utils'

export const getCategoryByIdController: RequestHandler = async (
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

		const categoryData = await categoriesServices.getCategoryById(categoryId)

		if (!categoryData) {
			logger.warn(`Category not found: ID ${categoryId}`)
			res.status(404).json({ message: 'Category not found' })
			return
		}

		logger.info(`Category retrieved successfully: ID ${categoryId}`)
		res.status(200).json(categoryData)
	} catch (error) {
		logger.error(`Error retrieving category: ${error}`)
		next(error)
	}
}
