import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
	const token = getCookie(event, 'auth_token');

	if (!token || token === 'admin') {
		throw createError({ statusCode: 401, statusMessage: 'Не авторизован' });
	}

	const userId = parseInt(token);
	if (isNaN(userId)) {
		throw createError({ statusCode: 401, statusMessage: 'Неверный токен пользователя' });
	}

	const body = await readBody(event);
	const { id_order, feedback } = body;

	if (!id_order || !feedback) {
		throw createError({ statusCode: 400, statusMessage: 'Отсутствуют id заказа или отзыв' });
	}

	try {
		const existingOrder = await prisma.order.findFirst({
			where: {
				id_order: parseInt(id_order),
				id_user: userId,
			},
		});

		if (!existingOrder) {
			throw createError({ statusCode: 404, statusMessage: 'Заказ не найден' });
		}

		if (existingOrder.id_status !== 3) {
			throw createError({ statusCode: 403, statusMessage: 'Отзыв можно оставить только для завершенных курсов' });
		}

		await prisma.order.update({
			where: { id_order: existingOrder.id_order },
			data: { feedback },
		});

		return { success: true, message: 'Отзыв добавлен' };
	} catch (error: any) {
		if (error.statusCode) throw error;
		console.error('Feedback error:', error);
		throw createError({ statusCode: 500, statusMessage: 'Не удалось оставить отзыв' });
	}
});
