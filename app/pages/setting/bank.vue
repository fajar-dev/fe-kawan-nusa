<template>
  <div class="space-y-6">
    <!-- Bank Info Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-neutral-800">Informasi Bank</h3>
          <div v-if="isEditing" class="flex items-center justify-end gap-3">
            <button 
                @click="handleCancel"
                class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg"
              >
                Batalkan
              </button>
              <button 
                @click="handleSave"
                :disabled="loading"
                class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-6"
              >
                <span v-if="loading" class="loading loading-spinner loading-xs"></span>
                Simpan
              </button>
          </div>
          <div v-else class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
              <MoreHorizontal class="w-5 h-5" />
            </label>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm border border-base-200">
              <li @click="handleCopy">
                <a>
                  <Copy class="w-4 h-4" />
                  Salin Informasi
                </a>
              </li>
              <li @click="isEditing = true">
                <a>
                  <Pencil class="w-4 h-4" />
                  Ubah Data
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Info Alert -->
        <div role="alert" class="alert alert-info bg-info/10 border-info/10 text-info shadow-none">
          <Info class="w-4 h-4" />
          <span>Pastikan nama pemilik rekening sesuai dengan nama akun Anda.</span>
        </div>
        
        <div class="space-y-4">
          <div class="form-control w-full max-w-md">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Pemilik Rekening<span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.accountHolderName" 
              :disabled="!isEditing"
              type="text" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              :class="{ 'border-red-500': errors.accountHolderName }"
            />
            <p v-if="errors.accountHolderName" class="text-[10px] text-red-500 mt-1">{{ errors.accountHolderName }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nama Bank<span class="text-red-500">*</span></span>
              </label>
              <select 
                v-model="form.bankName" 
                :disabled="!isEditing"
                class="select select-bordered w-full h-10 min-h-0 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none font-normal disabled:bg-neutral-50 disabled:text-neutral-500"
                :class="{ 'border-red-500': errors.bankName }"
              >
                <option disabled value="">Pilih Bank</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
              </select>
              <p v-if="errors.bankName" class="text-[10px] text-red-500 mt-1">{{ errors.bankName }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nomor Rekening<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.accountNumber" 
                :disabled="!isEditing"
                type="text" 
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.accountNumber }"
              />
              <p v-if="errors.accountNumber" class="text-[10px] text-red-500 mt-1">{{ errors.accountNumber }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoreHorizontal, Info, Pencil, Copy } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import type { UpdateBankRequest } from '~/types/profile'
import type { User } from '~/types/auth'
import { z } from 'zod'

const toast = useToast()
const loading = ref(false)
const isEditing = ref(false)
const errors = ref<Record<string, string>>({})

const profile = inject<Ref<User | null>>('profile')
const fetchProfile = inject<() => Promise<void>>('fetchProfile')

const bankSchema = z.object({
  accountHolderName: z.string().min(1, 'Nama pemilik rekening tidak boleh kosong'),
  bankName: z.string().min(1, 'Pilih salah satu bank'),
  accountNumber: z.string().min(1, 'Nomor rekening tidak boleh kosong')
})

const form = reactive<UpdateBankRequest>({
  accountHolderName: '',
  bankName: '',
  accountNumber: ''
})

watch(
  () => profile?.value?.bankDetails,
  (newBankDetails) => {
    if (newBankDetails) {
      form.accountHolderName = newBankDetails.holderName || ''
      form.bankName = newBankDetails.name || ''
      form.accountNumber = newBankDetails.number || ''
    }
  },
  { immediate: true }
)

const handleCopy = () => {
  const info = [
    `Nama Pemilik: ${form.accountHolderName}`,
    `Bank: ${form.bankName}`,
    `Nomor Rekening: ${form.accountNumber}`
  ].join('\n')
  
  navigator.clipboard.writeText(info).then(() => {
    toast.success({
      message: 'Informasi bank berhasil disalin ke clipboard'
    })
  }).catch(() => {
    toast.error({
      message: 'Gagal menyalin informasi'
    })
  })
}

const handleCancel = () => {
  if (profile?.value?.bankDetails) {
    form.accountHolderName = profile.value.bankDetails.holderName || ''
    form.bankName = profile.value.bankDetails.name || ''
    form.accountNumber = profile.value.bankDetails.number || ''
  }
  isEditing.value = false
  errors.value = {}
}

const handleSave = async () => {
  errors.value = {}

  const result = bankSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const response = await profileService.updateBank(result.data)
    if (response.success) {
      toast.success({
        message: response.message || 'Informasi bank berhasil diperbarui'
      })
      isEditing.value = false
      if (fetchProfile) await fetchProfile()
    }
  } catch (error: any) {
    toast.error({
      message: error.message || 'Gagal memperbarui informasi bank'
    })
  } finally {
    loading.value = false
  }
}
</script>