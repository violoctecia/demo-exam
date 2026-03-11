<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useHead({ title: 'Новая заявка | Корочки.есть' });

const form = ref({
	id_cours: '',
	start_date: '',
	payment_method: 'Наличными',
});

function applyDateMask(e: Event) {
	const input = e.target as HTMLInputElement;
	let val = input.value.replace(/\D/g, '').slice(0, 8);
	let result = '';
	if (val.length > 0) result += val.slice(0, 2);
	if (val.length >= 2) result += '.' + val.slice(2, 4);
	if (val.length >= 4) result += '.' + val.slice(4, 8);
	form.value.start_date = result;
	input.value = result;
}

const { data: courses, pending: loadingCourses } = useFetch<{ id_cours: number; course_name: string }[]>('/api/courses');

const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

async function submitOrder() {
	errorMsg.value = '';
	successMsg.value = '';

	if (form.value.start_date.length !== 10) {
		errorMsg.value = 'Введите корректную дату в формате ДД.ММ.ГГГГ';
		return;
	}

	loading.value = true;
	try {
		const res: any = await $fetch('/api/orders/create', {
			method: 'POST',
			body: form.value,
		});
		if (res.success) {
			successMsg.value = 'Заявка успешно оформлена! Переадресация...';
			setTimeout(() => navigateTo('/orders'), 2000);
		}
	} catch (err: any) {
		errorMsg.value = err.data?.statusMessage || 'Ошибка при создании заявки';
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<main class="container min-h-screen flex items-center justify-center py-12!">
		<div class="max-w-xl w-full backdrop-blur-xl bg-white/10 rounded-(--radius) p-8 shadow-xl border border-border">
			<!-- Title -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-medium">Оформление заявки</h1>
				<p class="mt-2 text-text/60">Выберите курс и укажите удобную дату старта</p>
			</div>

			<form
				@submit.prevent="submitOrder"
				class="flex flex-col gap-6"
			>
				<!-- Course -->
				<div>
					<label class="block text-sm font-medium mb-2">Наименование курса</label>
					<div
						v-if="loadingCourses"
						class="text-text/40 text-sm animate-pulse py-3"
					>
						Загрузка списка курсов...
					</div>
					<select
						v-else
						v-model="form.id_cours"
						required
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background"
					>
						<option
							value=""
							disabled
						>
							Выберите курс из списка
						</option>
						<option
							v-for="course in courses"
							:key="course.id_cours"
							:value="course.id_cours"
						>
							{{ course.course_name }}
						</option>
					</select>
				</div>

				<!-- Date -->
				<div>
					<label class="block text-sm font-medium mb-2">Желаемая дата начала</label>
					<input
						type="text"
						:value="form.start_date"
						@input="applyDateMask"
						required
						placeholder="ДД.ММ.ГГГГ"
						class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all font-mono"
					/>
				</div>

				<!-- Payment -->
				<div>
					<label class="block text-sm font-medium mb-3">Способ оплаты</label>
					<div class="flex flex-col sm:flex-row gap-3">
						<label
							v-for="method in ['Наличными', 'Переводом по номеру телефона']"
							:key="method"
							class="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-(--radius) border transition-colors"
							:class="form.payment_method === method ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'"
						>
							<input
								type="radio"
								:value="method"
								v-model="form.payment_method"
								name="payment"
								class="text-primary"
							/>
							<span class="text-sm font-medium">{{ method }}</span>
						</label>
					</div>
				</div>

				<!-- Error / Success -->
				<div
					v-if="errorMsg"
					class="text-red-400 text-sm text-center py-2 font-medium"
				>
					{{ errorMsg }}
				</div>
				<div
					v-if="successMsg"
					class="text-green-500 text-sm text-center py-2 font-medium"
				>
					{{ successMsg }}
				</div>

				<!-- Actions -->
				<div class="flex flex-col gap-3 pt-2">
					<button
						type="submit"
						:disabled="loading"
						class="button w-full py-3 disabled:opacity-50"
					>
						{{ loading ? 'Отправка заявки...' : 'Отправить заявку' }}
					</button>
					<NuxtLink
						to="/orders"
						class="text-center text-sm text-text/60 hover:text-primary transition-colors"
					>
						← Назад к заявкам
					</NuxtLink>
				</div>
			</form>
		</div>
	</main>
</template>
