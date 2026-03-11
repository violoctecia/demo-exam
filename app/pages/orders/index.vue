<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useHead({ title: 'Мои заявки | Корочки.есть' });

interface Order {
	id_order: number;
	date: string;
	start_date: string | null;
	payment_method: string | null;
	feedback: string | null;
	course_name: string;
	status_name: string;
	id_status: number;
}

const { data, pending, refresh } = useFetch<{ success: boolean; orders: Order[] }>('/api/orders/my');

const reviewTarget = ref<Order | null>(null);
const reviewText = ref('');
const submittingReview = ref(false);

const STATUS_COLOR: Record<number, string> = {
	1: 'bg-gray-100 text-gray-600 border-gray-200',
	2: 'bg-blue-50 text-blue-600 border-blue-200',
	3: 'bg-green-50 text-green-600 border-green-200',
};

async function submitReview() {
	if (!reviewTarget.value || !reviewText.value.trim()) return;
	submittingReview.value = true;
	try {
		await $fetch('/api/orders/review', {
			method: 'POST',
			body: { id_order: reviewTarget.value.id_order, feedback: reviewText.value },
		});
		reviewTarget.value.feedback = reviewText.value;
		reviewTarget.value = null;
		reviewText.value = '';
		refresh();
	} catch {
		alert('Ошибка при отправке отзыва');
	} finally {
		submittingReview.value = false;
	}
}

async function logout() {
	await $fetch('/api/auth/logout', { method: 'POST' });
	navigateTo('/login');
}
</script>

<template>
	<main class="container min-h-screen py-12!">
		<div
			v-if="pending"
			class="text-center py-20 text-text/40 text-lg animate-pulse"
		>
			Загрузка заявок...
		</div>

		<!-- Empty -->
		<div
			v-else-if="!data?.orders?.length"
			class="backdrop-blur-xl bg-white/10 rounded-(--radius) border border-border p-16 text-center shadow-xl"
		>
			<div class="text-5xl mb-4">📋</div>
			<h3 class="text-xl font-semibold mb-2">Заявок пока нет</h3>
			<p class="text-text/50 mb-8">Выберите курс и оформите первую заявку на обучение</p>
			<NuxtLink
				to="/orders/create"
				class="button inline-flex"
			>
				Выбрать курс
			</NuxtLink>
		</div>

		<!-- Orders Grid -->
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 gap-6"
		>
			<div
				v-for="order in data.orders"
				:key="order.id_order"
				class="backdrop-blur-xl bg-white/10 rounded-(--radius) border border-border p-6 shadow-xl hover:shadow-2xl transition-shadow"
			>
				<!-- Course + Status -->
				<div class="flex justify-between items-start gap-3 mb-5">
					<h3 class="font-semibold text-base leading-snug">{{ order.course_name }}</h3>
					<span
						class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border"
						:class="STATUS_COLOR[order.id_status]"
					>
						{{ order.status_name }}
					</span>
				</div>

				<!-- Details -->
				<div class="space-y-1.5 text-sm text-text/70 mb-5">
					<p>
						<span class="font-medium text-text">Дата начала:</span>
						{{ order.start_date || 'Не указана' }}
					</p>
					<p>
						<span class="font-medium text-text">Оплата:</span>
						{{ order.payment_method || 'Не указан' }}
					</p>
					<p class="text-xs text-text/40 pt-1">Создано: {{ new Date(order.date).toLocaleDateString('ru-RU') }}</p>
				</div>

				<!-- Feedback -->
				<div class="pt-4 border-t border-border">
					<template v-if="order.id_status === 3">
						<div
							v-if="order.feedback"
							class="bg-white/5 rounded-(--radius) p-3 text-sm text-text/70 italic border border-border"
						>
							"{{ order.feedback }}"
						</div>
						<template v-else>
							<button
								v-if="reviewTarget?.id_order !== order.id_order"
								@click="reviewTarget = order"
								class="text-sm font-medium text-primary hover:text-secondary transition-colors"
							>
								Оставить отзыв →
							</button>
							<div
								v-else
								class="space-y-3"
							>
								<textarea
									v-model="reviewText"
									rows="3"
									placeholder="Поделитесь впечатлениями о курсе..."
									class="w-full px-4 py-3 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/50 transition-all text-sm resize-none"
								/>
								<div class="flex gap-2">
									<button
										@click="submitReview"
										:disabled="submittingReview"
										class="button py-2 px-4 text-sm disabled:opacity-50"
									>
										{{ submittingReview ? 'Отправка...' : 'Отправить' }}
									</button>
									<button
										@click="reviewTarget = null"
										class="px-4 py-2 text-sm text-text/60 hover:text-text transition-colors"
									>
										Отмена
									</button>
								</div>
							</div>
						</template>
					</template>
					<p
						v-else
						class="text-xs text-text/40"
					>
						Отзыв доступен после завершения обучения
					</p>
				</div>
			</div>
		</div>
	</main>
</template>
