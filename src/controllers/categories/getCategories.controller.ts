import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'
import logger from '../../utils/logger.utils'

export const getCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const categories = await categoriesServices.getCategories()

		if (!categories || !categories.length) {
			logger.warn('No categories found')
			res.status(404).json({ message: 'No categories found' })
			return
		}

		logger.info('Categories retrieved successfully')
		res.status(200).json(categories)
	} catch (error) {
		logger.error(`Error retrieving categories: ${error}`)
		next(error)
	}
}
