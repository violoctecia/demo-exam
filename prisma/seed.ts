/// <reference types="node" />
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

dotenv.config();

const pool = new PrismaPg({
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`,
});
const prisma = new PrismaClient({ adapter: pool });

async function seed() {
	console.log('Очищаем старые таблицы');
	await prisma.order.deleteMany();
	await prisma.courses.deleteMany();
	await prisma.status.deleteMany();
	await prisma.user.deleteMany();

	console.log('Добавляем статусы...');
	await prisma.status.createMany({
		data: [
			{ id_status: 1, name_status: 'Новая' },
			{ id_status: 2, name_status: 'Идет обучение' },
			{ id_status: 3, name_status: 'Обучение завершено' },
		],
	});

	console.log('Добавляем курсы...');
	await prisma.courses.createMany({
		data: [
			{ course_name: 'Основы алгоритмизации и программирования' },
			{ course_name: 'Основы веб-дизайна' },
			{ course_name: 'Основы проектирования баз данных' },
		],
	});

	console.log('База данных готова!');
	await prisma.$disconnect();
}

seed().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
