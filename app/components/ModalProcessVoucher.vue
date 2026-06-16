<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleClose">
    <div class="modal-box max-w-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-lg text-neutral-800">Proses Voucher</h3>
        <button @click="close" class="btn btn-ghost btn-sm btn-circle">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Item Info -->
      <div v-if="item" class="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg mb-6">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-base-200 shrink-0">
          <img v-if="item.voucherDetails?.catalog?.image" :src="item.voucherDetails.catalog.image" :alt="item.voucherDetails.catalog.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Ticket class="w-5 h-5 text-neutral-400" />
          </div>
        </div>
        <div class="min-w-0">
          <p class="font-medium text-sm text-neutral-800 truncate">{{ item.voucherDetails?.catalog?.name }}</p>
          <p class="text-xs text-neutral-400">{{ item.redempNo }}</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Voucher Code -->
        <div>
          <label class="text-sm font-medium text-neutral-600 mb-1.5 block">Kode Voucher <span class="text-red-500">*</span></label>
          <input 
            v-model="form.code" 
            type="text" 
            placeholder="Masukkan kode voucher"
            class="input input-bordered w-full rounded-lg text-sm h-10 font-medium"
            :class="{ 'input-error': errors.code }"
          />
          <p v-if="errors.code" class="text-xs text-red-500 mt-1">{{ errors.code }}</p>
        </div>

        <!-- Expired Date -->
        <div>
          <label class="text-sm font-medium text-neutral-600 mb-1.5 block">Tanggal Kadaluarsa <span class="text-neutral-400 font-normal">(opsional)</span></label>
          <input 
            v-model="form.expiredDate" 
            type="date" 
            class="input input-bordered w-full rounded-lg text-sm h-10 font-medium"
          />
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
            Proses Voucher
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
import { X, Ticket } from 'lucide-vue-next'
import { redemptionService } from '~/services/redemption-service'
import type { VoucherRedemptionListItem } from '~/types/redemption'

const emit = defineEmits(['success'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const item = ref<VoucherRedemptionListItem | null>(null)
const submitting = ref(false)

const form = ref({
  code: '',
  expiredDate: ''
})

const errors = ref({
  code: ''
})

const validate = () => {
  errors.value = { code: '' }
  let valid = true

  if (!form.value.code.trim()) {
    errors.value.code = 'Masukkan kode voucher'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate() || !item.value) return

  submitting.value = true
  const toast = useToast()

  try {
    const data: { code: string; expiredDate?: string } = {
      code: form.value.code.trim()
    }
    if (form.value.expiredDate) {
      data.expiredDate = form.value.expiredDate
    }

    await redemptionService.processVoucher(item.value.id, data)
    toast.success('Voucher berhasil diproses')
    emit('success')
    close()
  } catch (error: any) {
    toast.error('Gagal memproses voucher')
  } finally {
    submitting.value = false
  }
}

const open = (data: VoucherRedemptionListItem) => {
  item.value = data
  form.value = { code: '', expiredDate: '' }
  errors.value = { code: '' }
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const handleClose = () => {
  item.value = null
  form.value = { code: '', expiredDate: '' }
  errors.value = { code: '' }
}

defineExpose({ open, close })
</script>
