<template>
  <div class="min-h-screen flex bg-white font-body selection:bg-primary/10 selection:text-primary">
    <!-- LEFT – hero panel (Carousel) -->
    <div 
      class="hero-panel hidden lg:flex lg:w-[58%] xl:w-[60%] relative flex-col justify-end p-10 xl:p-14 pb-20 xl:pb-24 transition-all duration-1000 ease-in-out"
      :style="{ backgroundImage: `url(${currentSlide.image})` }"
    >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80 z-0"></div>

      <!-- Content with Transition -->
      <div class="relative z-10">
        <transition 
          name="fade-slide" 
          mode="out-in"
        >
          <div :key="currentIndex">
            <h1 class="font-medium text-white text-4xl mb-4">
              {{ currentSlide.title }}
            </h1>
            <p class="text-white/90 text-md font-body font-medium max-w-xl">
              {{ currentSlide.description }}
            </p>
          </div>
        </transition>

        <!-- Carousel Indicators -->
        <div class="flex gap-2 mt-8">
          <button 
            v-for="(_, index) in slides" 
            :key="index"
            @click="currentIndex = index"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'w-8 bg-primary' : 'w-1.5 bg-white/40'"
          ></button>
        </div>
      </div>
    </div>

    <!-- RIGHT – content section (slot) -->
    <div class="flex-1 flex flex-col items-center bg-white px-10 py-12 sm:px-12 relative overflow-hidden">
      <div class="flex-1 flex flex-col w-full max-w-[450px]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Slide {
  image: string
  title: string
  description: string
}

const slides: Slide[] = [
  {
    image: '/assets/bg-1.png',
    title: 'Kelola Referral Lebih Mudah',
    description: 'Pantau performa mitra dan progress komisi dalam satu dashboard.'
  },
  {
    image: '/assets/bg-2.png',
    title: 'Akses Real-Time',
    description: 'Seluruh update status referral langsung tampil tanpa delay.'
  }
]

const currentIndex = ref(0)
const currentSlide = computed(() => slides[currentIndex.value] as Slide)
let timer: any = null

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.hero-panel {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
