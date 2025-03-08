import type { RequestHandler } from 'express'
import { categoriesServices } from '../../services/categories/categories.services'

export const getCategoryByIdController: RequestHandler = async (
	req,
	res,
	next
): Promise<void> => {
	try {
		const { categoryId } = req.params

		if (!categoryId) {
			res.status(404).json({ message: 'Error not found' })
		}

		const categoryData = await categoriesServices.getCategoryById(categoryId)

		if (!categoryData) {
			res.status(404).json({ message: 'Error not found' })
		}

		res.status(200).json(categoryData)
	} catch (error) {
		next(error)
	}
}
