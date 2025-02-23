export class UserAlreadyExistsError extends Error {
	constructor(email: string) {
		super(`Пользователь с почтой ${email} уже существует`)
		this.name = 'UserAlreadyExistsError'
	}
}

export class TokenGenerationError extends Error {
	constructor() {
		super('Ошибка генерации токена')
		this.name = 'TokenGenerationError'
	}
}
