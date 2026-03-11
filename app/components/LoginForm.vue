<template>
	<div class="max-w-md w-full backdrop-blur-xl bg-white/10 rounded-(--radius) p-8 shadow-xl border border-border">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-medium">Вход на платформу</h1>
			<p class="mt-2">Добро пожаловать в «Корочки.есть»</p>
		</div>

		<form
			@submit.prevent="handleLogin"
			class="flex flex-col gap-6"
		>
			<div>
				<label class="block text-sm font-medium mb-2">Логин</label>
				<input
					v-model="form.login"
					type="text"
					required
					maxlength="8"
					class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
					placeholder="Введите логин"
				/>
			</div>

			<div class="mb-12">
				<label class="block text-sm font-medium mb-2">Пароль</label>
				<div class="relative">
					<input
						v-model="form.pass"
						:type="showPassword ? 'text' : 'password'"
						required
						maxlength="6"
						class="w-full px-4 py-3 pr-12 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="Введите пароль"
					/>
					<button
						type="button"
						@click="showPassword = !showPassword"
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-text"
					>
						<svg
							v-if="!showPassword"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.223-3.592M6.7 6.7A9.98 9.98 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.088M15 12a3 3 0 11-6 0"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 3l18 18"
							/>
						</svg>
					</button>
				</div>
			</div>

			<div
				v-if="errorMsg"
				class="text-red-400 text-sm mt-2 text-center py-2 font-medium"
			>
				{{ errorMsg }}
			</div>

			<button
				type="submit"
				:disabled="loading"
				class="button w-full"
			>
				{{ loading ? 'Проверка...' : 'Войти' }}
			</button>

			<div class="mt-4 text-center">
				Еще не зарегистрированы?
				<NuxtLink
					to="/register"
					class="font-medium text-primary hover:text-secondary transition-colors"
				>
					Регистрация
				</NuxtLink>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
	login: '',
	pass: '',
});
const loading = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
	loading.value = true;
	errorMsg.value = '';

	try {
		const response: any = await $fetch('/api/auth/login', {
			method: 'POST',
			body: {
				login: form.login,
				pass: form.pass,
			},
		});

		if (response.role === 'admin') {
			await navigateTo('/admin');
		} else {
			await navigateTo('/orders');
		}
	} catch (err: any) {
		if (err.data?.statusCode === 401) {
			errorMsg.value = 'Некорректный логин или пароль';
		} else {
			errorMsg.value = 'Произошла ошибка при входе. Попробуйте еще раз.';
		}
	} finally {
		loading.value = false;
	}
};
</script>
