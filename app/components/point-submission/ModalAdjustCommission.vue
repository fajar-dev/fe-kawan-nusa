<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <div class="absolute inset-0" @click="isOpen = false"></div>

      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Adjust Komisi Bulanan</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Berlaku untuk poin bulan berikutnya</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Referral & account (readonly) -->
          <div class="bg-neutral-50 border border-base-200 rounded-lg p-3 space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">Referral</span>
              <span class="font-medium text-neutral-700">{{ schedule?.user?.name || '-' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">Akun Layanan</span>
              <span class="font-medium text-neutral-700 truncate max-w-[220px]" :title="schedule?.nisData?.accountName">{{ schedule?.nisData?.accountName || '-' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">Komisi Saat Ini</span>
              <span class="font-medium text-neutral-700">Rp {{ (schedule?.price || 0).toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <!-- New commission -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Komisi Baru <span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">Rp.</span>
                <input
                  v-model.number="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white pl-10"
                  :class="{ 'border-red-500': error }"
                  :disabled="loading"
                />
              </div>
              <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
            </div>
            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Poin per Bulan</span>
              </label>
              <input
                :value="calculatedPoint.toLocaleString('id-ID')"
                type="text"
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-gray-50 text-neutral-500"
                readonly
                disabled
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6">
            <button type="button" @click="isOpen = false" :disabled="loading" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Batal</button>
            <button type="submit" :disabled="loading" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { PointSubmissionSchedule } from '~/types/point-submission'

const props = defineProps<{
  schedule?: PointSubmissionSchedule | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const price = ref<number>(0)
const error = ref('')

// Rp 1.000 = 1 Poin (sama dengan rate pencairan tunai)
const calculatedPoint = computed(() => Math.floor((price.value || 0) / 1000))

watch(isOpen, (val) => {
  error.value = ''
  if (val) {
    price.value = Number(props.schedule?.price ?? 0)
    if (import.meta.client) document.body.style.overflow = 'hidden'
  } else {
    if (import.meta.client) document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const handleSubmit = () => {
  error.value = ''
  if (price.value === null || price.value === undefined || price.value < 0 || isNaN(Number(price.value))) {
    error.value = 'Komisi harus berupa angka ≥ 0'
    return
  }
  emit('submit', Number(price.value))
}
</script>
