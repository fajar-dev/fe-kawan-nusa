<template>
  <div
    v-if="isDebug"
    class="fixed top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none select-none z-[99999]"
    aria-hidden="true"
  >
    <div
      class="absolute top-[36px] -right-[28px] w-[150px] rotate-45 bg-red-600/95 text-white font-bold text-[9px] tracking-wider uppercase text-center py-0.5 shadow-md border-y border-white/25 backdrop-blur-[1px]"
    >
      development only
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const isDebug = computed(() => {
  return Boolean(config.public.debug)
})
</script>
