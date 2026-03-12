import { prisma } from '../../utils/db';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { login, pass } = body;

	if (!login || !pass) {
		throw createError({ statusCode: 400, statusMessage: 'Логин и пароль обязательны' });
	}

	// Check for admin role logic
	if (login === 'adminka' && pass === 'pass') {
		setCookie(event, 'auth_token', 'admin', {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});
		return { success: true, role: 'admin' };
	}

	// Database check for regular users
	const user = await prisma.user.findUnique({
		where: { login },
	});

	if (!user || user.pass !== pass) {
		throw createError({ statusCode: 401, statusMessage: 'Неверный логин или пароль' });
	}

	setCookie(event, 'auth_token', String(user.id_user), {
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return { success: true, role: 'user', user: { id: user.id_user, login: user.login } };
});
