<template>
  <div class="min-h-screen flex bg-white font-body selection:bg-primary/10 selection:text-primary">
    <!-- LEFT – hero panel -->
    <div class="hero-panel hidden lg:flex lg:w-[58%] xl:w-[60%] relative flex-col justify-end p-10 xl:p-14 pb-20 xl:pb-24">

      <!-- bottom caption -->
      <div class="relative z-10">
        <h1 class="font-medium text-white text-4xl mb-4">
          Kelola Referral Lebih Mudah
        </h1>
        <p class="text-white/90 text-md font-body font-medium">
          Pantau performa mitra dan progress komisi dalam satu dashboard.
        </p>
      </div>
    </div>

    <!-- RIGHT – content section (slot) -->
    <div class="flex-1 flex flex-col items-center justify-center bg-white px-10 py-12 sm:px-12 relative overflow-hidden">
      <slot />
    </div>
  </div>
</template>


<style scoped>
.hero-panel {
  background: url('/assets/bg-1.png') center/cover no-repeat;
  position: relative;
}

.hero-panel::before {
  content: '';
  position: absolute; 
  inset: 0;
  background: linear-gradient(180deg, rgba(48, 51, 57, 0.15) 0%, rgba(5, 5, 6, 0.8) 100%);
}
</style>
