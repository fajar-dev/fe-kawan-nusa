<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop click to close -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Form Step -->
        <template v-if="step === 'form'">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-base-200">
            <h3 class="text-xl font-semibold text-neutral-800">Penarikan Poin</h3>
            <button @click="isOpen = false" class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-neutral-800">Jumlah Poin ditarik</label>
                <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer" />
              </div>
              <input 
                v-model="withdrawAmount"
                type="number" 
                class="input input-bordered w-full rounded-xl h-12 text-lg focus:border-primary border-base-200 bg-white"
                :class="{ 'border-error focus:border-error text-error': isOverPoints }"
                placeholder="0"
                :disabled="isLoading"
              />
              <p v-if="isOverPoints" class="text-error text-xs font-medium">
                Poin yang anda tarik melebihi jumlah poin tersedia.
              </p>
            </div>

            <div class="bg-neutral-50/50 border border-base-200 rounded-2xl p-5 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-600">Jumlah poin yang ditarik x Rp. 1.000</span>
                <span class="text-neutral-800 font-medium">Rp. {{ (withdrawAmount * 1000).toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-neutral-600">PPH 2,5% (dibulatkan)</span>
                <span class="text-neutral-800 font-medium">Rp. {{ Math.round(withdrawAmount * 1000 * 0.025).toLocaleString('id-ID') }}</span>
              </div>
              <div class="border-t border-base-200 pt-3 flex items-center justify-between">
                <span class="font-semibold text-neutral-800">Total withdraw</span>
                <span class="font-semibold text-neutral-900">Rp. {{ Math.round(withdrawAmount * 1000 * 0.975).toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <div v-if="errorMessage" class="text-error text-sm font-medium mt-2 p-3 bg-error/10 rounded-lg">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200">
            <button 
              @click="isOpen = false"
              :disabled="isLoading"
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
            >
              Batal
            </button>
            <button 
              @click="handleTarikPoin"
              :disabled="isLoading || withdrawAmount <= 0 || isOverPoints"
              class="btn btn-primary rounded-lg px-6 min-w-[120px]"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              <span v-else>Tarik Poin</span>
            </button>
          </div>
        </template>

        <!-- Success Step -->
        <template v-else>
          <div class="p-8 flex flex-col items-center text-center space-y-6">
            <div class="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center">
              <Check class="w-8 h-8 text-neutral-900" />
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xl font-bold text-neutral-800">Tarik Poin Berhasil!</h3>
              <p class="text-neutral-600">Silahkan cek rekening anda secara berkala.</p>
            </div>

            <button 
              @click="handleClose"
              class="btn w-full bg-[#6B9E49] hover:bg-[#5A853D] border-none text-white rounded-xl h-12 text-lg font-semibold"
            >
              OK
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CircleHelp, Check } from 'lucide-vue-next'
import { withdrawService } from '~/services/withdraw-service'
import { pointService } from '~/services/point-service'

const isOpen = defineModel<boolean>({ default: false })
const withdrawAmount = ref(0)
const availablePoints = ref(0)
const isLoadingPoints = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const step = ref<'form' | 'success'>('form')

const emit = defineEmits(['withdraw', 'success'])

const fetchPoints = async () => {
  isLoadingPoints.value = true
  try {
    const response = await pointService.getPoint()
    availablePoints.value = response.data.value
  } catch (error) {
    console.error('Failed to fetch points:', error)
  } finally {
    isLoadingPoints.value = false
  }
}

const isOverPoints = computed(() => withdrawAmount.value > availablePoints.value)

const handleTarikPoin = async () => {
  if (withdrawAmount.value <= 0 || isOverPoints.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await withdrawService.createWithdraw(withdrawAmount.value)
    step.value = 'success'
    emit('success', withdrawAmount.value)
  } catch (error: any) {
    errorMessage.value = error.message || 'Terjadi kesalahan saat melakukan penarikan'
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  isOpen.value = false
  setTimeout(() => {
    step.value = 'form'
    withdrawAmount.value = 0
    errorMessage.value = ''
  }, 300)
}

watch(isOpen, (val) => {
  if (!import.meta.client) return
  
  if (val) {
    document.body.style.overflow = 'hidden'
    fetchPoints()
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
