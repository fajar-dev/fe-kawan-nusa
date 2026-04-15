<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Close Button -->
        <button @click="isOpen = false" class="absolute right-4 top-4 text-neutral-400 hover:text-neutral-800 transition-colors z-20">
          <X class="w-6 h-6" />
        </button>

        <div class="p-6 flex flex-col items-center text-center">
          <!-- Success Icon -->
          <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
              <Check class="w-7 h-7 stroke-[3px]" />
            </div>
          </div>

          <h3 class="text-xl font-semibold text-neutral-800 mb-2">{{ title || 'Penukaran Berhasil' }}</h3>
          <p class="text-xs text-neutral-400 mb-6">
            {{ message || 'Reward Anda sedang diproses dan akan segera dikirimkan' }}
          </p>

          <!-- Details Card -->
          <div v-if="!hideDetails" class="w-full bg-primary/10 rounded-xl p-6 space-y-4 mb-8">
            <div class="space-y-1">
              <span class="text-xs text-neutral-400">ID Transaksi</span>
              <p class="text-neutral-800 font-semibold text-sm tracking-tight">{{ redemption?.redempNo }}</p>
            </div>

            <div class="border-t border-neutral-200 pt-3 space-y-1">
              <span class="text-xs text-neutral-400">Reward</span>
              <p class="text-neutral-800 font-semibold text-sm leading-tight">{{ rewardName }}</p>
            </div>

            <div class="border-t border-neutral-200 pt-3 space-y-1">
              <span class="text-xs text-neutral-400">Estimasi Proses</span>
              <p class="text-neutral-800 font-semibold text-sm">1-7 Hari Kerja</p>
            </div>
          </div>

          <NuxtLink 
            v-if="!hideDetails"
            to="/point/reedem/history"
            class="btn w-full btn-primary rounded-lg"
          >
            {{ buttonLabel || 'Lihat Riwayat' }}
          </NuxtLink>
          <button 
            v-else
            @click="isOpen = false"
            class="btn w-full btn-primary rounded-lg"
          >
            {{ buttonLabel || 'OK' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Check } from 'lucide-vue-next'
import type { RedemptionData } from '~/types/redemption'

const props = defineProps<{
  redemption?: RedemptionData | null
  rewardName?: string
  title?: string
  message?: string
  hideDetails?: boolean
  buttonLabel?: string
}>()

const isOpen = defineModel<boolean>({ default: false })

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
