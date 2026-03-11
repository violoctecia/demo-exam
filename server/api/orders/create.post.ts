import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
	const token = getCookie(event, 'auth_token');

	if (!token) {
		throw createError({ statusCode: 401, statusMessage: 'Не авторизован' });
	}

	if (token === 'admin') {
		throw createError({ statusCode: 403, statusMessage: 'Администраторы не могут создавать заказы' });
	}

	const userId = parseInt(token);
	if (isNaN(userId)) {
		throw createError({ statusCode: 401, statusMessage: 'Неверный токен пользователя' });
	}

	const body = await readBody(event);
	const { id_cours, start_date, payment_method } = body;

	if (!id_cours || !start_date || !payment_method) {
		throw createError({ statusCode: 400, statusMessage: 'Отсутствуют курс, дата начала или способ оплаты' });
	}

	try {
		const order = await prisma.order.create({
			data: {
				id_user: userId,
				id_cours: parseInt(id_cours),
				id_status: 1, // 'Новая'
				start_date,
				payment_method,
			},
		});

		return { success: true, order };
	} catch (error: any) {
		console.error('Order creation error:', error?.message ?? error);
		throw createError({ statusCode: 500, statusMessage: error?.message ?? 'Не удалось создать заказ' });
	}
});
