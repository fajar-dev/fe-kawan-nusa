<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="handleClose"></div>
      
      <div class="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Detail Penukaran</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Masukkan detail pengiriman reward</p>
          </div>
          <button @click="handleClose" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Form Area -->
        <div class="px-6 py-4 space-y-2">
          <!-- Nama -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama<span class="text-red-500 ml-0.5">*</span></span>
            </label>
            <input 
              type="text" 
              :value="userName" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              readonly 
            />
          </div>

          <!-- Email -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Email<span class="text-red-500 ml-0.5">*</span></span>
            </label>
            <input 
              type="email" 
              :value="userEmail" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              readonly 
            />
          </div>

          <!-- Nomor Handphone -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nomor Handphone<span class="text-red-500 ml-0.5">*</span></span>
            </label>
            <input 
              type="text" 
              :value="userPhone" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              readonly 
            />
          </div>

          <!-- Alamat Lengkap -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Alamat Lengkap<span class="text-red-500 ml-0.5">*</span></span>
            </label>
            <textarea 
              v-model="address" 
              class="textarea textarea-bordered h-28 w-full placeholder:text-neutral-400" 
              placeholder="Masukkan alamat lengkap Anda"
              :class="{ 'textarea-error': error }"
            ></textarea>
            <p v-if="error" class="text-error text-xs mt-1">{{ error }}</p>
            <p class="text-[11px] text-neutral-400 mt-2 leading-relaxed italic">
              Cth: Jl. Melati Indah No.25, Kel. Sukamaju, Kec. Medan Johor, Kota Medan, Sumatera Utara 20143, RT 003 RW 005
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-neutral-100">
          <button 
            @click="handleClose"
            class="btn btn-outline border-primary rounded-lg font-medium"
            :disabled="isLoading"
          >
            Batal
          </button>
          <button 
            @click="handleSubmit"
            class="btn btn-primary rounded-lg font-medium"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            Konfirmasi Penukaran
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import { redemptionService } from '~/services/redemption-service'

const props = defineProps<{
  catalogId: number | null
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['success', 'cancel'])

const address = ref('')
const error = ref('')
const isLoading = ref(false)

const { data: profileResponse } = await useAsyncData('modal-redeem-profile', () => profileService.getProfile())

const userName = computed(() => {
  const user = profileResponse.value?.data
  if (!user) return '-'
  return `${user.firstName} ${user.lastName}`.trim()
})
const userEmail = computed(() => profileResponse.value?.data?.email ?? '-')
const userPhone = computed(() => profileResponse.value?.data?.phone ?? '-')

const handleClose = () => {
  if (isLoading.value) return
  isOpen.value = false
  emit('cancel')
}

const handleSubmit = async () => {
  if (!props.catalogId) return
  
  if (!address.value.trim()) {
    error.value = 'Shipping address is required'
    return
  }
  error.value = ''
  
  isLoading.value = true
  try {
    const response = await redemptionService.redeemProduct({
      catalogId: props.catalogId,
      address: address.value.trim()
    })
    
    if (response.success) {
      isOpen.value = false
      emit('success', response.data)
    }
  } catch (err) {
    // Error handled by service
  } finally {
    isLoading.value = false
  }
}

watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
    address.value = ''
    error.value = ''
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