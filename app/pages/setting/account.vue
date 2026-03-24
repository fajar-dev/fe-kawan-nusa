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
            <p v-if="errors.firstName" class="text-[10px] text-red-500 mt-1">{{ errors.firstName }}</p>
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
            <p v-if="errors.lastName" class="text-[10px] text-red-500 mt-1">{{ errors.lastName }}</p>
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
            <p v-if="errors.email" class="text-[10px] text-red-500 mt-1">{{ errors.email }}</p>
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
                class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.phone }"
              />
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
            </div>
            <p v-if="errors.phone" class="text-[10px] text-red-500 mt-1">{{ errors.phone }}</p>
          </div>
        </div>
        
        <!-- Company Info -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-5">Informasi Perusahaan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nama Perusahaan<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.company"
                :disabled="!isEditing"
                type="text" 
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.company }"
              />
              <p v-if="errors.company" class="text-[10px] text-red-500 mt-1">{{ errors.company }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Jabatan<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.jobPosition"
                :disabled="!isEditing"
                type="text" 
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-500" 
                :class="{ 'border-red-500': errors.jobPosition }"
              />
              <p v-if="errors.jobPosition" class="text-[10px] text-red-500 mt-1">{{ errors.jobPosition }}</p>
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
import type { User } from '~/types/auth'
import { z } from 'zod'

const toast = useToast()
const loading = ref(false)
const isEditing = ref(false)
const errors = ref<Record<string, string>>({})

const profile = inject<Ref<User | null>>('profile')
const fetchProfile = inject<() => Promise<void>>('fetchProfile')

const accountSchema = z.object({
  firstName: z.string().min(1, 'Nama depan tidak boleh kosong'),
  lastName: z.string().min(1, 'Nama belakang tidak boleh kosong'),
  email: z.string().min(1, 'Email tidak boleh kosong').email('Format email tidak valid'),
  phone: z.string().min(1, 'Nomor handphone tidak boleh kosong'),
  company: z.string().min(1, 'Nama perusahaan tidak boleh kosong'),
  jobPosition: z.string().min(1, 'Jabatan tidak boleh kosong')
})

const form = reactive<UpdateAccountRequest>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobPosition: ''
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
    }
  },
  { immediate: true }
)

const handleCopy = () => {
  const info = [
    `Nama: ${form.firstName} ${form.lastName}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Perusahaan: ${form.company}`,
    `Jabatan: ${form.jobPosition}`
  ].join('\n')
  
  navigator.clipboard.writeText(info).then(() => {
    toast.success({
      message: 'Informasi berhasil disalin ke clipboard'
    })
  }).catch(() => {
    toast.error({
      message: 'Gagal menyalin informasi'
    })
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
      toast.success({
        message: response.message || 'Profil berhasil diperbarui'
      })
      isEditing.value = false
      if (fetchProfile) await fetchProfile()
    }
  }  finally {
    loading.value = false
  }
}
</script>