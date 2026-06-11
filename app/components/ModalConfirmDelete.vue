<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">{{ title }}</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <p class="text-sm text-neutral-600">
            {{ message }}
          </p>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6">
            <button 
              type="button"
              @click="isOpen = false"
              :disabled="loading"
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
            >
              Batal
            </button>
            <button 
              type="button"
              @click="$emit('confirm')"
              :disabled="loading"
              class="btn btn-error rounded-lg px-6 min-w-[120px] text-white"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

withDefaults(defineProps<{
  title?: string
  message?: string
  loading?: boolean
}>(), {
  title: 'Konfirmasi Hapus',
  message: 'Apakah Anda yakin ingin menghapus data ini?',
  loading: false
})

const isOpen = defineModel<boolean>({ default: false })

defineEmits(['confirm'])

watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
