import { prisma } from '../utils/db';

const TZ_COURSES = [
	'Основы алгоритмизации и программирования',
	'Основы веб-дизайна',
	'Основы проектирования баз данных',
];

export default defineEventHandler(async () => {
	// Авто-сид: если курсов нет — добавляем автоматически
	const count = await prisma.courses.count();
	if (count === 0) {
		await prisma.courses.createMany({
			data: TZ_COURSES.map((name) => ({ course_name: name })),
		});
	}

	// Возвращаем актуальный список (отсортированный по алфавиту)
	return prisma.courses.findMany({
		orderBy: { course_name: 'asc' },
	});
});
