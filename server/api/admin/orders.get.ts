import { prisma } from '../../utils/db';

export default defineEventHandler(async () => {
	const orders = await prisma.order.findMany({
		orderBy: { date: 'asc' },
		include: {
			user: {
				select: {
					id_user: true,
					login: true,
					first_name: true,
					last_name: true,
					email: true,
					phone: true,
				},
			},
			course: {
				select: { course_name: true },
			},
			status: {
				select: { name_status: true },
			},
		},
	});

	return orders.map((o) => ({
		id_order: o.id_order,
		date: o.date,
		pay: o.pay,
		feedback: o.feedback,
		id_status: o.id_status,
		status_name: o.status?.name_status ?? null,
		id_user: o.user?.id_user ?? null,
		login: o.user?.login ?? null,
		first_name: o.user?.first_name ?? null,
		last_name: o.user?.last_name ?? null,
		email: o.user?.email ?? null,
		phone: o.user?.phone ?? null,
		course_name: o.course?.course_name ?? null,
		id_cours: o.id_cours,
		start_date: o.start_date,
		payment_method: o.payment_method,
	}));
});
