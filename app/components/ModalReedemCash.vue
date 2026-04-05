<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop click to close -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <h3 class="text-xl font-semibold text-neutral-800">Penarikan Tunai</h3>
          <button @click="isOpen = false" class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          <div class="space-y-2">
            <div role="alert" class="alert alert-info alert-soft text-blue-500 bg-blue-300/10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-5 w-5 shrink-0 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-xs">Dana penarikan poin akan ditransfer ke rekening Bank {{ bankName }} – {{ accountNumber }} a.n. {{ accountHolderName }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-neutral-800">Jumlah Poin ditarik</label>
            </div>
            <input 
              v-model="withdrawAmount"
              type="number" 
              class="input input-bordered w-full rounded-xl h-10 text-lg focus:border-primary border-base-200 bg-white"
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
              <span class="font-semibold text-neutral-800">Total reedem</span>
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
      </div>
    </div>
  </Teleport>

  <ModalRedemptionSuccess 
    v-model="isSuccessOpen" 
    :redemption="redemptionData" 
    :reward-name="`Penarikan Tunai Rp ${ (withdrawAmount * 1000).toLocaleString('id-ID') }`"
    title="tarik Poin Berhasil!"
    message="Silahkan cek rekening anda secara berkala."
    hide-details
    button-label="OK"
  />
</template>

<script setup lang="ts">
import { X, Check } from 'lucide-vue-next'
import { pointService } from '~/services/point-service'
import { profileService } from '~/services/profile-service'
import { ref, computed, watch, onUnmounted } from 'vue'
import { redemptionService } from '~/services/redemption-service'

const isOpen = defineModel<boolean>({ default: false })
const withdrawAmount = ref(0)
const availablePoints = ref(0)
const accountHolderName = ref('')
const bankName = ref('')
const accountNumber = ref('')
const isLoadingPoints = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const isSuccessOpen = ref(false)
const redemptionData = ref<any>(null)

const emit = defineEmits(['withdraw', 'success'])

const fetchPoints = async () => {
  isLoadingPoints.value = true
  try {
    const response = await pointService.getPoint()
    const user = await profileService.getProfile()
    availablePoints.value = response.data.value
    accountHolderName.value = user.data.bankDetails?.holderName ?? ''
    bankName.value = user.data.bankDetails?.name ?? ''
    accountNumber.value = user.data.bankDetails?.number ?? ''
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
    const response = await redemptionService.redeemCash({ pointsUsed: withdrawAmount.value })
    redemptionData.value = response.data
    isOpen.value = false
    isSuccessOpen.value = true
    emit('success', withdrawAmount.value)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  isOpen.value = false
  setTimeout(() => {
    withdrawAmount.value = 0
    errorMessage.value = ''
    redemptionData.value = null
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
