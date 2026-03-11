import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
	const token = getCookie(event, 'auth_token');

	if (!token) {
		throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
	}

	if (token === 'admin') {
		throw createError({ statusCode: 403, statusMessage: 'Admins view all orders elsewhere' });
	}

	const userId = parseInt(token);
	if (isNaN(userId)) {
		throw createError({ statusCode: 401, statusMessage: 'Invalid user token' });
	}

	try {
		const userOrders = await prisma.order.findMany({
			where: { id_user: userId },
			orderBy: { date: 'desc' },
			include: {
				course: { select: { course_name: true } },
				status: { select: { id_status: true, name_status: true } },
			},
		});

		return {
			success: true,
			orders: userOrders.map((o) => ({
				id_order: o.id_order,
				date: o.date,
				start_date: o.start_date,
				payment_method: o.payment_method,
				feedback: o.feedback,
				course_name: o.course?.course_name ?? null,
				status_name: o.status?.name_status ?? null,
				id_status: o.status?.id_status ?? null,
			})),
		};
	} catch (error: any) {
		console.error('Fetch orders error:', error);
		throw createError({ statusCode: 500, statusMessage: 'Не удалось получить заказы' });
	}
});
