import type { ROLES } from '../../constants/roles'
import type { IUser } from '../../models/auth/auth-user.model'
import {
	deleteModelUser,
	getModelUserById,
	getModelUsers,
	updatedModelUser,
} from '../../models/users/user.model'
import { UserDTO } from '../../utils/dtos/user-dto.utils'
import { ApiError } from '../../utils/exists-error.utils'
import logger from '../../utils/logger.utils'

export interface IUserService {
	user: UserDTO
}

class UserServices {
	async getAllUsers(): Promise<IUser[]> {
		const users = await getModelUsers()

		if (!users?.length) {
			throw ApiError.BadRequest('Пользователи не найдены')
		}

		return users
	}

	async getUserById(userId: number | string): Promise<IUser | null> {
		return await getModelUserById(userId)
	}

	async updatedUser(
		roleId: ROLES,
		userId: number | string
	): Promise<IUserService | null> {
		const updatedUserData = await updatedModelUser(roleId, userId)
		if (!updatedUserData) {
			return null
		}

		return { user: new UserDTO(updatedUserData) }
	}

	async removeUser(userId: string | number): Promise<IUser | null> {
		if (!userId) {
			logger.warn('Attempted to delete a user without ID')
			throw ApiError.BadRequest('User ID is required')
		}

		const existingUser = await getModelUserById(userId)
		if (!existingUser) {
			logger.warn(`User ${userId} does not exist`)
			return null
		}

		const removedUser = await deleteModelUser(userId)

		logger.info(`User ${userId} deleted successfully`)
		return removedUser
	}
}

export const userServices = new UserServices()
