<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Konfirmasi Penukaran</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Pastikan detail reward Anda sudah benar</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          <!-- Reward Image -->
          <div class="h-48 w-full rounded-xl overflow-hidden bg-neutral-100">
            <img :src="reward?.image" :alt="reward?.title" class="w-full h-full object-cover" />
          </div>

          <!-- Reward Info -->
          <div class="space-y-1">
            <h4 class="text-neutral-800 font-semibold">{{ reward?.title }}</h4>
            <p class="text-xs text-neutral-500 line-clamp-2">
              {{ reward?.description }}
            </p>
          </div>

          <!-- Points Breakdown -->
          <div class="border border-neutral-100 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">Poin Anda saat ini</span>
                <span class="text-neutral-800 font-medium">{{ userPoints.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-500">Poin yang ditukarkan</span>
                <div class="flex items-center gap-1.5 text-purple-600 font-medium font-semibold">
                    <Coins class="w-4 h-4" />
                    <span>{{ reward?.points.toLocaleString('id-ID') }}</span>
                </div>
            </div>
            <div class="border-t border-dashed border-neutral-200 pt-3 flex items-center justify-between">
                <span class="font-semibold text-neutral-800">Sisa Poin</span>
                <span class="font-semibold text-neutral-900 border-neutral-100">{{ (userPoints - (reward?.points || 0)).toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-neutral-100">
          <button 
            @click="isOpen = false"
            class="btn btn-outline border-primary rounded-lg font-medium"
          >
            Batal
          </button>
          <button 
            @click="$emit('confirm')"
            class="btn btn-primary rounded-lg font-medium"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Coins } from 'lucide-vue-next'

const props = defineProps<{
  reward: {
    title: string
    description: string
    points: number
    image: string
  } | null
  userPoints: number
}>()

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
