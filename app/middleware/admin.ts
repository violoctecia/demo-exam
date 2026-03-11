export default defineNuxtRouteMiddleware((to, from) => {
	const token = useCookie('auth_token');

	// If there's no admin token, redirect to login
	if (token.value !== 'admin') {
		return navigateTo('/login');
	}
});
