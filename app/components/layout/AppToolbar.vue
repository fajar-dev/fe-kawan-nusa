<template>
  <div class="bg-white -mx-4 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-8 lg:-mt-8 mb-6 px-4 py-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <slot name="left" />
      <slot />
    </div>
    <div v-if="$slots.right" class="flex items-center gap-2 w-full md:w-auto">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
