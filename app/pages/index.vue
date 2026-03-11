<script setup lang="ts">
import MainSlider from '@/components/MainSlider.vue';

useHead({ title: 'Корочки.есть | Главная' });
</script>

<template>
	<main class="container flex flex-col justify-center items-center min-h-screen">
		<h1 class="text-4xl md:text-6xl font-bold mb-6">
			Дополнительное
			<br />
			<span class="text-primary">ИТ-образование</span>
		</h1>
		<p class="max-w-[600px] text-base md:text-lg text-center mb-12">
			Платформа для быстрой регистрации и записи на курсы по программированию, базам данных и веб-дизайну.
		</p>
		<MainSlider />
	</main>
</template>
