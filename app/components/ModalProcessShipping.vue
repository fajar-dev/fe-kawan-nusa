<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleClose">
    <div class="modal-box max-w-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-lg text-neutral-800">Proses Pengiriman</h3>
        <button @click="close" class="btn btn-ghost btn-sm btn-circle">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Item Info -->
      <div v-if="item" class="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg mb-6">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-base-200 shrink-0">
          <img v-if="item.productDetails?.catalog?.image" :src="item.productDetails.catalog.image" :alt="item.productDetails.catalog.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Package class="w-5 h-5 text-neutral-400" />
          </div>
        </div>
        <div class="min-w-0">
          <p class="font-medium text-sm text-neutral-800 truncate">{{ item.productDetails?.catalog?.name }}</p>
          <p class="text-xs text-neutral-400">{{ item.redempNo }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Shipper -->
        <div>
          <label class="text-sm font-medium text-neutral-600 mb-1.5 block">Kurir Pengiriman <span class="text-red-500">*</span></label>
          <select 
            v-model="form.shipper" 
            class="select select-bordered w-full rounded-lg text-sm h-10 font-medium"
            :class="{ 'select-error': errors.shipper }"
          >
            <option value="" disabled>Pilih kurir</option>
            <option v-for="s in shippers" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <p v-if="errors.shipper" class="text-xs text-red-500 mt-1">{{ errors.shipper }}</p>
        </div>

        <!-- Tracking Number -->
        <div>
          <label class="text-sm font-medium text-neutral-600 mb-1.5 block">Nomor Resi <span class="text-red-500">*</span></label>
          <input 
            v-model="form.trackingNumber" 
            type="text" 
            placeholder="Masukkan nomor resi"
            class="input input-bordered w-full rounded-lg text-sm h-10 font-medium"
            :class="{ 'input-error': errors.trackingNumber }"
          />
          <p v-if="errors.trackingNumber" class="text-xs text-red-500 mt-1">{{ errors.trackingNumber }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" @click="close" class="btn btn-ghost btn-md rounded-lg font-medium">Batal</button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="btn btn-primary btn-md rounded-lg font-medium text-white"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
            Proses Pengiriman
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { X, Package } from 'lucide-vue-next'
import { redemptionService } from '~/services/redemption-service'
import type { ProductRedemptionListItem } from '~/types/redemption'

const emit = defineEmits(['success'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const item = ref<ProductRedemptionListItem | null>(null)
const submitting = ref(false)

const shippers = [
  { value: 'jne', label: 'JNE' },
  { value: 'jnt', label: 'J&T Express' },
  { value: 'sicepat', label: 'SiCepat' },
  { value: 'ninja', label: 'Ninja Xpress' },
  { value: 'wahana', label: 'Wahana' },
  { value: 'pos', label: 'POS Indonesia' },
  { value: 'others', label: 'Lainnya' },
]

const form = ref({
  shipper: '',
  trackingNumber: ''
})

const errors = ref({
  shipper: '',
  trackingNumber: ''
})

const validate = () => {
  errors.value = { shipper: '', trackingNumber: '' }
  let valid = true

  if (!form.value.shipper) {
    errors.value.shipper = 'Pilih kurir pengiriman'
    valid = false
  }
  if (!form.value.trackingNumber.trim()) {
    errors.value.trackingNumber = 'Masukkan nomor resi'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate() || !item.value) return

  submitting.value = true
  const toast = useToast()

  try {
    await redemptionService.processProduct(item.value.id, {
      shipper: form.value.shipper,
      trackingNumber: form.value.trackingNumber.trim()
    })
    toast.success('Pengiriman berhasil diproses')
    emit('success')
    close()
  } catch (error: any) {
    toast.error('Gagal memproses pengiriman')
  } finally {
    submitting.value = false
  }
}

const open = (data: ProductRedemptionListItem) => {
  item.value = data
  form.value = { shipper: '', trackingNumber: '' }
  errors.value = { shipper: '', trackingNumber: '' }
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const handleClose = () => {
  item.value = null
  form.value = { shipper: '', trackingNumber: '' }
  errors.value = { shipper: '', trackingNumber: '' }
}

defineExpose({ open, close })
</script>
