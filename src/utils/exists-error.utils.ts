export class TokenGenerationError extends Error {
	constructor() {
		super('Ошибка генерации токена')
		this.name = 'TokenGenerationError'
	}
}

export class ApiError extends Error {
	status: number
	errors: string[]

	constructor(status: number, message: string, errors: string[] = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static UnauthorizedError(): ApiError {
		return new ApiError(401, 'Пользователь не авторизован')
	}

	static BadRequest(message: string, errors: string[]): ApiError {
		return new ApiError(400, message, errors)
	}
}
