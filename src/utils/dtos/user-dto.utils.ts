import type { ROLES } from '../../constants/roles'
import type { IUser } from '../../models/auth/auth-user.model'

export class UserDTO {
	id: number
	login: string
	email: string
	isActivated: boolean
	role: ROLES
	createdAt: string | Date
	updatedAt: string | Date

	constructor(model: IUser) {
		this.id = model.id
		this.login = model.name
		this.email = model.email
		this.isActivated = model.is_activated
		this.role = model.role
		this.createdAt = model.created_at
		this.updatedAt = model.updated_at
	}
}
