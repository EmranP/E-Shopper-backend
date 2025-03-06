import type { ROLES } from '../../constants/roles'
import type { IUser } from '../../models/auth/auth-user.model'
import {
	deleteModelUser,
	getModelUsers,
	updatedModelUser,
} from '../../models/users/user.model'
import { UserDTO } from '../../utils/dtos/user-dto.utils'
import { ApiError } from '../../utils/exists-error.utils'

export interface IUserService {
	user: UserDTO
}

class UserServices {
	async getAllUsers(): Promise<IUser[]> {
		const users = await getModelUsers()

		if (!users) {
			throw ApiError.BadRequest('Пользователи не были найдены')
		}

		return users
	}

	async updatedUser(
		roleId: ROLES,
		userId: number | string
	): Promise<IUserService> {
		const updatedUserData = await updatedModelUser(roleId, userId)

		if (!updatedUserData) {
			throw ApiError.BadRequest('Данный о user не обновились')
		}

		const userDTO = new UserDTO(updatedUserData)

		return { user: userDTO }
	}

	async removeUser(userId: string | number): Promise<void> {
		await deleteModelUser(userId)
	}
}

export const userServices = new UserServices()
