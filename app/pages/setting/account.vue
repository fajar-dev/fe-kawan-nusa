<template>
  <div class="space-y-6">
    <!-- Personal Info Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-semibold text-neutral-800">Informasi Pribadi</h3>
          <div v-if="isEditing" class="flex items-center justify-end gap-3 pt-4">
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
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Depan<span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.firstName"
              :disabled="!isEditing"
              type="text" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Belakang<span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.lastName"
              :disabled="!isEditing"
              type="text" 
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Alamat Email<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                v-model="form.email"
                :disabled="!isEditing"
                type="email" 
                class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.email }"
              />
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
            </div>
            <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nomor Handphone<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                v-model="form.phone"
                :disabled="!isEditing"
                type="text"
                inputmode="numeric"
                @input="form.phone = ($event.target as HTMLInputElement).value.replace(/\D/g, '')"
                class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.phone }"
              />
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
            </div>
            <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
          </div>
          <!-- Tempat dan Tanggal Lahir -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Tempat dan Tanggal Lahir<span class="text-red-500">*</span></span>
            </label>
            <div 
              class="flex items-center border border-base-200 rounded-lg h-10 overflow-hidden transition-all"
              :class="{ 'border-red-500': errors.birthPlace || errors.birthDate, 'bg-neutral-50': !isEditing }"
            >
              <input 
                v-model="form.birthPlace"
                :disabled="!isEditing"
                type="text" 
                placeholder="Tempat Lahir"
                class="flex-1 h-full px-3 text-sm border-none outline-none bg-transparent disabled:text-neutral-500"
              />
              <div class="w-px h-5 bg-base-200"></div>
              <input 
                v-model="form.birthDate"
                :disabled="!isEditing"
                type="date"
                class="flex-1 h-full px-3 text-sm border-none outline-none bg-transparent disabled:text-neutral-500"
              />
            </div>
            <p v-if="errors.birthPlace" class="text-xs text-red-500 mt-1">{{ errors.birthPlace }}</p>
            <p v-if="errors.birthDate" class="text-xs text-red-500 mt-1">{{ errors.birthDate }}</p>
          </div>
          <!-- NIK -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">NIK<span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.identityNumber"
              :disabled="!isEditing"
              type="text"
              inputmode="numeric"
              @input="form.identityNumber = Number(($event.target as HTMLInputElement).value.replace(/\D/g, '')) || null"
              placeholder="Masukkan 16 digit NIK"
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              :class="{ 'border-red-500': errors.identityNumber }"
            />
            <p v-if="errors.identityNumber" class="text-xs text-red-500 mt-1">{{ errors.identityNumber }}</p>
          </div>
          <!-- NPWP -->
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">NPWP<span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.taxNumber"
              :disabled="!isEditing"
              type="text" 
              placeholder="Masukkan nomor NPWP"
              class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
              :class="{ 'border-red-500': errors.taxNumber }"
            />
            <p v-if="errors.taxNumber" class="text-xs text-red-500 mt-1">{{ errors.taxNumber }}</p>
          </div>
          <!-- Alamat Rumah -->
          <div class="form-control w-full md:col-span-2">
            <div class="flex items-center justify-between mb-1.5">
              <label class="label p-0">
                <span class="text-xs text-neutral-800">Alamat Rumah<span class="text-red-500">*</span></span>
              </label>
              <span v-if="isEditing" class="text-xs text-neutral-400">{{ (form.address || '').length }}/110</span>
            </div>
            <textarea 
              v-model="form.address"
              :disabled="!isEditing"
              placeholder="Isi Alamat Rumah"
              maxlength="110"
              rows="3"
              class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none resize-none disabled:bg-neutral-50 disabled:text-neutral-500"
              :class="{ 'border-red-500': errors.address }"
            ></textarea>
            <p v-if="errors.address" class="text-xs text-red-500 mt-1">{{ errors.address }}</p>
          </div>
        </div>
        
        <!-- Company Info -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-5">Informasi Perusahaan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nama Perusahaan</span>
              </label>
              <input 
                v-model="form.company"
                :disabled="!isEditing"
                type="text" 
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.company }"
              />
              <p v-if="errors.company" class="text-xs text-red-500 mt-1">{{ errors.company }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Jabatan</span>
              </label>
              <input 
                v-model="form.jobPosition"
                :disabled="!isEditing"
                type="text" 
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.jobPosition }"
              />
              <p v-if="errors.jobPosition" class="text-xs text-red-500 mt-1">{{ errors.jobPosition }}</p>
            </div>
            <!-- Alamat Perusahaan -->
            <div class="form-control w-full md:col-span-2">
              <div class="flex items-center justify-between mb-1.5">
                <label class="label p-0">
                  <span class="text-xs text-neutral-800">Alamat Perusahaan</span>
                </label>
                <span v-if="isEditing" class="text-xs text-neutral-400">{{ (form.companyAddress || '').length }}/110</span>
              </div>
              <textarea 
                v-model="form.companyAddress"
                :disabled="!isEditing"
                placeholder="Isi Alamat Perusahaan"
                maxlength="110"
                rows="3"
                class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none resize-none disabled:bg-neutral-50 disabled:text-neutral-500"
                :class="{ 'border-red-500': errors.companyAddress }"
              ></textarea>
              <p v-if="errors.companyAddress" class="text-xs text-red-500 mt-1">{{ errors.companyAddress }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoreHorizontal, Mail, Phone, Pencil, Copy } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import type { UpdateAccountRequest } from '~/types/profile'
import type { Profile } from '~/types/profile'
import { z } from 'zod'

const toast = useToast()
const loading = ref(false)
const isEditing = ref(false)
const errors = ref<Record<string, string>>({})

const profile = inject<Ref<Profile | null>>('profile')
const fetchProfile = inject<() => Promise<void>>('fetchProfile')

const accountSchema = z.object({
  firstName: z.string().min(1, 'Nama depan tidak boleh kosong'),
  lastName: z.string().min(1, 'Nama belakang tidak boleh kosong'),
  email: z.string().min(1, 'Email tidak boleh kosong').email('Format email tidak valid'),
  phone: z.string().min(1, 'Nomor handphone tidak boleh kosong'),
  company: z.string().optional().or(z.literal('')),
  jobPosition: z.string().optional().or(z.literal('')),
  taxNumber: z.string().min(1, 'NPWP tidak boleh kosong'),
  identityNumber: z.coerce.number().min(1, 'NIK tidak boleh kosong'),
  birthDate: z.string().min(1, 'Tanggal lahir tidak boleh kosong'),
  birthPlace: z.string().min(1, 'Tempat lahir tidak boleh kosong'),
  address: z.string().min(1, 'Alamat tidak boleh kosong').max(110, 'Alamat maksimal 110 karakter'),
  companyAddress: z.string().max(110, 'Alamat perusahaan maksimal 110 karakter').optional().or(z.literal('')),
})

const form = reactive<UpdateAccountRequest>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobPosition: '',
  taxNumber: '',
  identityNumber: null,
  birthDate: '',
  birthPlace: '',
  address: '',
  companyAddress: '',
})

watch(
  () => profile?.value,
  (newProfile) => {
    if (newProfile) {
      form.firstName = newProfile.firstName || ''
      form.lastName = newProfile.lastName || ''
      form.email = newProfile.email || ''
      form.phone = newProfile.phone || ''
      form.company = newProfile.company || ''
      form.jobPosition = newProfile.jobPosition || ''
      form.taxNumber = newProfile.taxNumber || ''
      form.identityNumber = newProfile.identityNumber || null
      form.birthDate = newProfile.birthDate || ''
      form.birthPlace = newProfile.birthPlace || ''
      form.address = newProfile.address || ''
      form.companyAddress = newProfile.companyAddress || ''
    }
  },
  { immediate: true }
)

const handleCopy = () => {
  const info = [
    `Nama: ${form.firstName} ${form.lastName}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Tempat/Tgl Lahir: ${form.birthPlace}, ${form.birthDate}`,
    `NIK: ${form.identityNumber}`,
    `NPWP: ${form.taxNumber}`,
    `Alamat: ${form.address}`,
    `Perusahaan: ${form.company}`,
    `Jabatan: ${form.jobPosition}`,
    `Alamat Perusahaan: ${form.companyAddress}`
  ].join('\n')
  
  navigator.clipboard.writeText(info).then(() => {
    toast.success('Informasi berhasil disalin ke clipboard')
  }).catch(() => {
    toast.error('Gagal menyalin informasi')
  })
}

const handleCancel = () => {
  if (profile?.value) {
    form.firstName = profile.value.firstName || ''
    form.lastName = profile.value.lastName || ''
    form.email = profile.value.email || ''
    form.phone = profile.value.phone || ''
    form.company = profile.value.company || ''
    form.jobPosition = profile.value.jobPosition || ''
    form.taxNumber = profile.value.taxNumber || ''
    form.identityNumber = profile.value.identityNumber || null
    form.birthDate = profile.value.birthDate || ''
    form.birthPlace = profile.value.birthPlace || ''
    form.address = profile.value.address || ''
    form.companyAddress = profile.value.companyAddress || ''
  }
  isEditing.value = false
  errors.value = {}
}

const handleSave = async () => {
  errors.value = {}

  const result = accountSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const response = await profileService.updateAccount(result.data)
    if (response.success) {
      toast.success(response.message || 'Profil berhasil diperbarui')
      isEditing.value = false
      if (fetchProfile) await fetchProfile()
    }
  }  finally {
    loading.value = false
  }
}
</script>