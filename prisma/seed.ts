/// <reference types="node" />
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

dotenv.config();

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

async function seed() {
	console.log('Clearing old data to prepare for TZ...');
	await prisma.order.deleteMany();
	await prisma.courses.deleteMany();
	await prisma.status.deleteMany();
	await prisma.user.deleteMany();

	console.log('Inserting TZ statuses...');
	await prisma.status.createMany({
		data: [
			{ id_status: 1, name_status: 'Новая' },
			{ id_status: 2, name_status: 'Идет обучение' },
			{ id_status: 3, name_status: 'Обучение завершено' },
		],
	});

	console.log('Inserting TZ courses...');
	await prisma.courses.createMany({
		data: [
			{ course_name: 'Основы алгоритмизации и программирования' },
			{ course_name: 'Основы веб-дизайна' },
			{ course_name: 'Основы проектирования баз данных' },
		],
	});

	console.log('Database seeded and ready!');
	await prisma.$disconnect();
}

seed().catch(async (err) => {
	console.error(err);
	await prisma.$disconnect();
	process.exit(1);
});
