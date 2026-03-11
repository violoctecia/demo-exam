<template>
	<header class="sticky py-3 top-0 z-50 bg-background backdrop-blur-md border-b border-border">
		<div class="container flex justify-between gap-4">
			<nuxt-link
				to="/"
				class="flex items-center gap-4"
			>
				<div class="w-10 h-10 rounded-(--radius) bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
					<svg
						class="w-6 h-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
					</svg>
				</div>
				<span class="text-xl font-medium hidden md:block">Корочки.есть</span>
			</nuxt-link>
			<div class="flex items-center gap-4">
				<nuxt-link
					v-if="!isUserAuthorized"
					class="button"
					to="/login"
				>
					Вход
				</nuxt-link>
				<nuxt-link
					class="button"
					to="/orders/create"
				>
					Оформить заявку
				</nuxt-link>
				<button
					v-if="isUserAuthorized"
					class="button bg-transparent! text-primary!"
					@click="logout"
				>
					Выход
				</button>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
const token = useCookie('auth_token');
const isUserAuthorized = computed(() => !!token.value);

const logout = async () => {
	await $fetch('/api/auth/logout', { method: 'POST' });
	token.value = null;
	navigateTo('/login');
};
</script>
