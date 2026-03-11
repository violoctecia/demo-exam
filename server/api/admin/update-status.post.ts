import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { id_order, id_status } = body;

	if (!id_order || !id_status) {
		throw createError({ statusCode: 400, statusMessage: 'Missing id_order or id_status' });
	}

	const order = await prisma.order.findUnique({
		where: { id_order: parseInt(id_order) },
	});

	if (!order) {
		throw createError({ statusCode: 404, statusMessage: 'Order not found' });
	}

	const updated = await prisma.order.update({
		where: { id_order: parseInt(id_order) },
		data: { id_status: parseInt(id_status) },
	});

	return { success: true, order: updated };
});
