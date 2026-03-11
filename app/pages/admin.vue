<script setup lang="ts">
import { computed, ref, watch } from 'vue';

definePageMeta({ middleware: 'admin' });
useHead({ title: 'Администратор | Корочки.есть' });

interface Order {
	id_order: number;
	date: string;
	start_date: string | null;
	payment_method: string | null;
	feedback: string | null;
	id_status: number;
	status_name: string;
	id_user: number;
	login: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string | null;
	course_name: string;
	id_cours: number;
}

const { data: orders, refresh, pending } = useFetch<Order[]>('/api/admin/orders');

const STATUS_MAP: Record<number, { label: string; badge: string }> = {
	1: { label: 'Новая', badge: 'bg-gray-100 text-gray-600 border-gray-200' },
	2: { label: 'Идет обучение', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
	3: { label: 'Завершено', badge: 'bg-green-50 text-green-600 border-green-200' },
};

const updatingId = ref<number | null>(null);
const toastMsg = ref('');
const toastVisible = ref(false);
const toastError = ref(false);

function showToast(msg: string, isError = false) {
	toastMsg.value = msg;
	toastError.value = isError;
	toastVisible.value = true;
	setTimeout(() => (toastVisible.value = false), 3000);
}

const search = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const PER_PAGE = 8;

const filtered = computed(() => {
	if (!orders.value) return [];
	return orders.value.filter((o) => {
		const q = search.value.toLowerCase();
		const matchSearch =
			!q ||
			[o.login, o.first_name, o.last_name, o.email, o.course_name].some((f) =>
				f?.toLowerCase().includes(q),
			);
		const matchStatus = !filterStatus.value || o.id_status === Number(filterStatus.value);
		return matchSearch && matchStatus;
	});
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)));
const paginated = computed(() => filtered.value.slice((currentPage.value - 1) * PER_PAGE, currentPage.value * PER_PAGE));

watch([search, filterStatus], () => (currentPage.value = 1));

async function changeStatus(order: Order, val: string) {
	if (!val) return;
	updatingId.value = order.id_order;
	try {
		await $fetch('/api/admin/update-status', {
			method: 'POST',
			body: { id_order: order.id_order, id_status: Number(val) },
		});
		order.id_status = Number(val);
		order.status_name = STATUS_MAP[Number(val)]?.label ?? '';
		showToast(`Статус заявки #${order.id_order} обновлён`);
	} catch (e: any) {
		showToast('Ошибка: ' + (e.data?.statusMessage || e.message), true);
	} finally {
		updatingId.value = null;
	}
}

async function logout() {
	await $fetch('/api/auth/logout', { method: 'POST' });
	navigateTo('/login');
}

function fmtDate(d: string) {
	return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<template>
	<div class="min-h-screen bg-background">
		<!-- Toast -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="-translate-y-2 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="-translate-y-2 opacity-0"
		>
			<div
				v-if="toastVisible"
				class="fixed top-4 right-4 z-50 px-5 py-3 rounded-(--radius) border shadow-xl text-sm font-medium flex items-center gap-2"
				:class="toastError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'"
			>
				<span>{{ toastError ? '✗' : '✓' }}</span>
				{{ toastMsg }}
			</div>
		</Transition>

		<!-- Sticky Header -->
		<header class="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
			<div class="container flex items-center justify-between h-16">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-(--radius) bg-primary flex items-center justify-center">
						<span class="text-white font-bold text-xs">АДМ</span>
					</div>
					<h1 class="font-bold text-base">Панель администратора</h1>
				</div>
				<button
					@click="logout"
					class="px-4 py-1.5 text-sm font-medium rounded-(--radius) border border-border text-text/60 hover:text-red-500 hover:border-red-300 transition-colors"
				>
					Выход
				</button>
			</div>
		</header>

		<main class="container py-8">
			<!-- Stats -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
				<div
					v-for="(s, i) in [
						{ label: 'Всего', value: orders?.length ?? 0 },
						{ label: 'Новые', value: orders?.filter((o) => o.id_status === 1).length ?? 0 },
						{ label: 'В процессе', value: orders?.filter((o) => o.id_status === 2).length ?? 0 },
						{ label: 'Завершены', value: orders?.filter((o) => o.id_status === 3).length ?? 0 },
					]"
					:key="i"
					class="backdrop-blur-xl bg-white/10 border border-border rounded-(--radius) p-4 shadow"
				>
					<p class="text-xs text-text/50 mb-1">{{ s.label }}</p>
					<p class="text-2xl font-bold text-primary">{{ s.value }}</p>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex flex-col sm:flex-row gap-3 mb-6">
				<input
					v-model="search"
					type="text"
					placeholder="Поиск по имени, логину, курсу..."
					class="flex-1 max-w-md px-4 py-2.5 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text/40 transition-all text-sm"
				/>
				<select
					v-model="filterStatus"
					class="px-4 py-2.5 border border-border rounded-(--radius) focus:ring-2 focus:ring-primary text-sm bg-background transition-all"
				>
					<option value="">Все статусы</option>
					<option value="1">Новая</option>
					<option value="2">Идет обучение</option>
					<option value="3">Завершено</option>
				</select>
				<button
					@click="refresh()"
					class="px-4 py-2.5 rounded-(--radius) border border-border text-sm text-text/60 hover:text-primary hover:border-primary transition-colors flex items-center gap-2"
				>
					<svg class="w-4 h-4" :class="{ 'animate-spin': pending }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Обновить
				</button>
			</div>

			<!-- Loading / Empty -->
			<div v-if="pending" class="text-center py-20 text-text/40 animate-pulse">Загрузка...</div>
			<div v-else-if="!filtered.length" class="text-center py-20 text-text/40">Заявок не найдено.</div>

			<!-- Table -->
			<div v-else class="backdrop-blur-xl bg-white/10 border border-border rounded-(--radius) shadow-xl overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead class="border-b border-border bg-white/5">
							<tr class="text-xs text-text/50 uppercase tracking-wider">
								<th class="px-5 py-3 text-left font-semibold">Студент</th>
								<th class="px-5 py-3 text-left font-semibold">Курс</th>
								<th class="px-5 py-3 text-left font-semibold">Статус</th>
								<th class="px-5 py-3 text-left font-semibold">Управление</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							<tr v-for="order in paginated" :key="order.id_order" class="hover:bg-white/5 transition-colors">
								<td class="px-5 py-4 align-top">
									<p class="font-semibold">{{ order.last_name }} {{ order.first_name }}</p>
									<p class="text-xs text-text/50 font-mono mt-0.5">@{{ order.login }}</p>
									<p class="text-xs text-text/40 mt-1">{{ order.email }}</p>
									<p class="text-xs text-text/40">{{ order.phone || '—' }}</p>
								</td>
								<td class="px-5 py-4 align-top max-w-[200px]">
									<p class="font-medium text-primary leading-snug">{{ order.course_name }}</p>
									<p class="text-xs text-text/50 mt-1.5">Старт: {{ order.start_date || '—' }}</p>
									<p class="text-xs text-text/50">Оплата: {{ order.payment_method || '—' }}</p>
									<p class="text-xs text-text/40">{{ fmtDate(order.date) }}</p>
									<p v-if="order.feedback" class="text-xs text-text/60 italic mt-2 border-l-2 border-primary/40 pl-2">
										"{{ order.feedback }}"
									</p>
								</td>
								<td class="px-5 py-4 align-top">
									<span
										class="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border"
										:class="STATUS_MAP[order.id_status]?.badge"
									>
										{{ STATUS_MAP[order.id_status]?.label ?? '—' }}
									</span>
								</td>
								<td class="px-5 py-4 align-top">
									<div class="flex items-center gap-2">
										<select
											:disabled="updatingId === order.id_order"
											:value="order.id_status"
											@change="changeStatus(order, ($event.target as HTMLSelectElement).value)"
											class="px-3 py-2 rounded-(--radius) border border-border text-xs focus:ring-2 focus:ring-primary bg-background transition-all disabled:opacity-50"
										>
											<option value="1">Новая</option>
											<option value="2">Идет обучение</option>
											<option value="3">Завершено</option>
										</select>
										<svg v-if="updatingId === order.id_order" class="animate-spin w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
										</svg>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Pagination -->
			<div v-if="totalPages > 1" class="flex items-center justify-between mt-5">
				<span class="text-sm text-text/50">
					Страница <strong class="text-text">{{ currentPage }}</strong> из <strong class="text-text">{{ totalPages }}</strong>
				</span>
				<div class="flex gap-2">
					<button
						@click="currentPage--"
						:disabled="currentPage === 1"
						class="px-4 py-2 rounded-(--radius) border border-border text-sm hover:border-primary transition-colors disabled:opacity-30"
					>
						←
					</button>
					<button
						@click="currentPage++"
						:disabled="currentPage === totalPages"
						class="px-4 py-2 rounded-(--radius) border border-border text-sm hover:border-primary transition-colors disabled:opacity-30"
					>
						→
					</button>
				</div>
			</div>
		</main>
	</div>
</template>
