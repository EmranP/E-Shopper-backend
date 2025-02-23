import type { IUser } from '../../models/auth/user.model'

export class UserDTO {
	email: string
	id: number
	isActivated: boolean
	role: number | string

	constructor(model: IUser) {
		this.email = model.email
		this.id = model.id
		this.isActivated = model.is_activated
		this.role = model.role
	}
}
