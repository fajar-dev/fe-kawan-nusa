<template>
  <div class="min-h-screen flex flex-col font-body selection:bg-primary/10 selection:text-primary">
    <div class="flex-1 flex flex-col w-full max-w-6xl mx-auto space-y-4 md:space-y-6 px-4 md:px-6 lg:px-0 py-4 md:py-8">
      <!-- Header Card -->
      <div class="card bg-white border border-base-200 rounded-xl md:rounded-2xl shadow-sm">
        <div class="flex items-center justify-between px-4 md:px-8 py-2">
          <!-- Logo -->
          <div class="inline-flex flex-col">
            <div class="font-display gap-0 flex flex-col leading-none">
              <span class="text-gray-800 font-semibold text-2xl md:text-3xl">kawan</span>
              <span class="text-primary font-semibold text-2xl md:text-3xl -mt-1 md:-mt-2">nusa</span>
            </div>
            <p class="text-[4px] text-gray-900 tracking-widest uppercase mt-1 font-body">
              Portal Referal PT Media Antar Nusa
            </p>
          </div>
          <h1 class="text-base md:text-xl font-semibold" :class="titleClass">{{ title }}</h1>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const title = computed(() => (route.meta.layoutTitle as string) || 'Pendaftaran Referal Baru')
const titleClass = computed(() => route.meta.layoutTitle ? 'text-primary' : 'text-neutral-800')
</script>
