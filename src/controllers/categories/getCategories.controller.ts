import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'

export const getCategoriesController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const categories = await categoriesServices.getCategories()

		if (!categories) {
			res.status(404).json({ message: 'Error' })
		}

		res.status(200).json(categories)
	} catch (error) {
		next(error)
	}
}
