<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute right-4 top-4 sm:right-6 sm:top-6 z-[1000] btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/70"
      >
        ✕
      </button>

      <!-- Image Display -->
      <div class="relative flex items-center justify-center p-4 w-full h-full pointer-events-none">
        <img 
          v-if="imageUrl" 
          :src="imageUrl" 
          class="max-w-full max-h-full object-contain rounded-md shadow-2xl pointer-events-auto" 
          alt="Preview Image" 
        />
      </div>

      <!-- Backdrop Area that captures clicks -->
      <div class="absolute inset-0 z-[-1] cursor-pointer" @click="$emit('close')"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  imageUrl: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
