<template>
	<div class="max-w-xl w-full backdrop-blur-xl bg-white/10 rounded-(--radius) p-8 shadow-xl border border-border">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-medium">Создание аккаунта</h1>
			<p class="mt-2">Заполните данные для начала обучения на платформе</p>
		</div>

		<form
			class="flex flex-col gap-6"
			@submit.prevent="submitForm"
		>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- First Name -->
				<div>
					<label
						for="first_name"
						class="block text-sm font-medium mb-2"
					>
						Имя (только кириллица)
					</label>
					<input
						id="first_name"
						:value="form.First_name"
						@input="applyNameMask($event, 'First_name')"
						type="text"
						required
						autocomplete="given-name"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="Иван"
					/>
				</div>

				<!-- Last Name -->
				<div>
					<label
						for="last_name"
						class="block text-sm font-medium mb-2"
					>
						Фамилия (только кириллица)
					</label>
					<input
						id="last_name"
						:value="form.Last_name"
						@input="applyNameMask($event, 'Last_name')"
						type="text"
						required
						autocomplete="family-name"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="Иванов"
					/>
				</div>

				<!-- Surname -->
				<div class="sm:col-span-2">
					<label
						for="surname"
						class="block text-sm font-medium mb-2"
					>
						Отчество (если есть)
					</label>
					<input
						id="surname"
						:value="form.Surname"
						@input="applyNameMask($event, 'Surname')"
						type="text"
						autocomplete="additional-name"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="Иванович"
					/>
				</div>

				<!-- Phone -->
				<div>
					<label
						for="phone"
						class="block text-sm font-medium mb-2"
					>
						Телефон (11 цифр)
					</label>
					<input
						id="phone"
						type="tel"
						:value="form.Phone"
						@input="applyPhoneMask"
						required
						autocomplete="tel"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="8(999)000-00-00"
						maxlength="18"
					/>
				</div>

				<!-- Email -->
				<div>
					<label
						for="email"
						class="block text-sm font-medium mb-2"
					>
						Email
					</label>
					<input
						id="email"
						v-model="form.Email"
						type="email"
						required
						autocomplete="email"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="ivan@example.com"
					/>
				</div>

				<!-- Login -->
				<div>
					<label
						for="login"
						class="block text-sm font-medium mb-2 flex justify-between"
					>
						<span>Логин</span>
						<span class="font-normal opacity-60">({{ form.login.length }}/8)</span>
					</label>
					<input
						id="login"
						type="text"
						:value="form.login"
						@input="applyLoginMask"
						required
						maxlength="8"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
						placeholder="Ivan123"
						autocomplete="username"
					/>
				</div>

				<!-- Password -->
				<div>
					<label
						for="password"
						class="block text-sm font-medium mb-2 flex justify-between"
					>
						<span>Пароль</span>
						<span class="font-normal opacity-60">(макс. 6 симв.)</span>
					</label>
					<div class="relative">
						<input
							id="password"
							v-model="form.pass"
							:type="showPassword ? 'text' : 'password'"
							required
							maxlength="6"
							class="w-full px-4 py-3 pr-12 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all duration-300"
							placeholder="Введите пароль"
							autocomplete="new-password"
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
			</div>

			<!-- Error -->
			<div
				v-if="errorMsg"
				class="text-red-400 text-sm text-center py-2 font-medium"
			>
				{{ errorMsg }}
			</div>

			<!-- Success -->
			<div
				v-if="successMsg"
				class="text-green-400 text-sm text-center py-2 font-medium"
			>
				{{ successMsg }}
			</div>

			<button
				type="submit"
				id="create-user-btn"
				:disabled="loading"
				class="button w-full"
			>
				{{ loading ? 'Проверка данных...' : 'Создать пользователя' }}
			</button>

			<div class="text-center">
				Уже зарегистрированы?
				<NuxtLink
					to="/login"
					class="font-medium text-primary hover:text-secondary transition-colors"
				>
					Войти
				</NuxtLink>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

useHead({ title: 'Регистрация' });

const form = ref({
	login: '',
	pass: '',
	First_name: '',
	Last_name: '',
	Surname: '',
	Phone: '',
	Email: '',
});

const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const showPassword = ref(false);
const router = useRouter();

// --- Phone mask ---
function applyPhoneMask(e: Event) {
	const input = e.target as HTMLInputElement;
	let val = input.value.replace(/\D/g, '');

	if (val.startsWith('8') || val.startsWith('9')) {
		if (val.startsWith('9')) val = '7' + val;
		else val = '7' + val.slice(1);
	}
	if (!val.startsWith('7') && val.length > 0) val = '7' + val;

	val = val.slice(0, 11);

	let result = '';
	if (val.length > 0) result = '+7';
	if (val.length > 1) result += '(' + val.slice(1, 4);
	if (val.length >= 5) result += ')' + val.slice(4, 7);
	if (val.length >= 8) result += '-' + val.slice(7, 9);
	if (val.length >= 10) result += '-' + val.slice(9, 11);

	form.value.Phone = result;
	input.value = result;
}

// --- Login mask: only latin letters and digits ---
function applyLoginMask(e: Event) {
	const input = e.target as HTMLInputElement;
	const filtered = input.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
	form.value.login = filtered;
	input.value = filtered;
}

// --- Name mask: only cyrillic ---
function applyNameMask(e: Event, field: 'First_name' | 'Last_name' | 'Surname') {
	const input = e.target as HTMLInputElement;
	const filtered = input.value.replace(/[^а-яА-ЯёЁ\s-]/g, '');
	form.value[field] = filtered;
	input.value = filtered;
}

async function submitForm() {
	errorMsg.value = '';
	successMsg.value = '';

	if (!form.value.login) {
		errorMsg.value = 'Пожалуйста, введите логин';
		return;
	}
	if (!form.value.pass) {
		errorMsg.value = 'Пожалуйста, введите пароль';
		return;
	}

	loading.value = true;

	try {
		const res: any = await $fetch('/api/register', {
			method: 'POST',
			body: form.value,
		});

		if (res.success) {
			successMsg.value = 'Пользователь успешно создан! Сейчас вы будете перенаправлены на вход.';
			setTimeout(() => router.push('/login'), 2000);
		}
	} catch (err: any) {
		errorMsg.value = err.data?.statusMessage || err.message || 'Произошла ошибка при регистрации.';
	} finally {
		loading.value = false;
	}
}
</script>
