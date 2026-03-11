import { prisma } from '../utils/db';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { login, pass, First_name, Last_name, Surname, Phone, Email } = body;

	if (!login || !pass || !First_name || !Last_name || !Email) {
		throw createError({ statusCode: 400, statusMessage: 'Отсутствуют обязательные поля' });
	}

	try {
		const user = await prisma.user.create({
			data: {
				login,
				pass,
				first_name: First_name,
				last_name: Last_name,
				surname: Surname ?? null,
				phone: Phone ?? null,
				email: Email,
			},
		});

		return { success: true, user };
	} catch (error: any) {
		// P2002 = Prisma unique constraint violation
		if (error.code === 'P2002') {
			throw createError({
				statusCode: 409,
				statusMessage: 'Пользователь с таким логином или email уже существует',
			});
		}

		console.error('Registration Error:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Внутренняя ошибка сервера при регистрации',
		});
	}
});
