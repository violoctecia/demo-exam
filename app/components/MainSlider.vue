<template>
	<div class="relative w-full max-w-4xl mx-auto rounded-(--radius) overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] border border-white/10 group">
		<!-- Images -->
		<div class="relative h-[250px] sm:h-[400px] md:h-[500px] w-full">
			<TransitionGroup
				enter-active-class="transition-opacity duration-1000 ease-in-out absolute inset-0"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition-opacity duration-1000 ease-in-out absolute inset-0"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<img
					v-for="(slide, index) in slides"
					:key="slide"
					v-show="currentSlide === index"
					:src="slide"
					loading="lazy"
					alt="Platform slide"
					class="absolute inset-0 w-full h-full object-cover rounded-(--radius)"
				/>
			</TransitionGroup>

			<!-- Dark Overlay for better control visibility -->
			<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
		</div>

		<!-- Controls (Prev/Next) -->
		<button
			@click="prevSlide"
			class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				/>
			</svg>
		</button>

		<button
			@click="nextSlide"
			class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				/>
			</svg>
		</button>

		<!-- Indicators -->
		<div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
			<button
				v-for="(_, index) in slides"
				:key="index"
				@click="setSlide(index)"
				class="h-2 rounded-full transition-all duration-500"
				:class="currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/70'"
			></button>
		</div>
	</div>
</template>

<script setup lang="ts">
// УКАЗЫВАЕМ ПУТЬ ДО СВОИХ КАРТИНОК В ПАПКЕ /public/slider
const slides = ['/slider/image.png', '/slider/image2.jpeg', '/slider/image3.jpeg', '/slider/image4.jpeg'];

const currentSlide = ref(0);
let slideInterval: any = null;

const nextSlide = () => {
	currentSlide.value = (currentSlide.value + 1) % slides.length;
	resetInterval();
};

const prevSlide = () => {
	currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
	resetInterval();
};

const setSlide = (index: number) => {
	currentSlide.value = index;
	resetInterval();
};

const resetInterval = () => {
	clearInterval(slideInterval);
	slideInterval = setInterval(() => {
		currentSlide.value = (currentSlide.value + 1) % slides.length;
	}, 3000);
};

onMounted(() => {
	resetInterval();
});

onUnmounted(() => {
	clearInterval(slideInterval);
});
</script>
