import { createTransport, type Transporter } from 'nodemailer'
import logger from '../../utils/logger.utils'

class MailService {
	private transporter: Transporter

	constructor() {
		this.transporter = createTransport({
			host: String(process.env.SMTP_HOST) || '',
			port: Number(process.env.SMTP_PORT) || 587,
			tls: { rejectUnauthorized: false },
			secure: false,
			auth: {
				user: process.env.SMTP_USER || '',
				pass: process.env.SMTP_PASSWORD || '',
			},
		})
	}
	//? Change url to CLIENT_URL: link
	async sendActivationMail(to: string, link: string): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to,
				subject: 'Активация аккаунта на E-Shopper ' + process.env.API_URL,
				text: '',
				html: `
					<div>
						<h1>Для активации аккаунта перейдите по ссылке:</h1>
						<a href="${link}">${link}</a>
					</div>
				`,
			})
		} catch (error) {
			logger.error('Ошибка при отправке письма:', error)
			throw new Error('Ошибка при отправке письма')
		}
	}
}

export const mailService = new MailService()
