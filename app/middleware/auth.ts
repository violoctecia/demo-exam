export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token');

  // If there's no token, redirect to login
  if (!token.value) {
    return navigateTo('/Login');
  }
});
