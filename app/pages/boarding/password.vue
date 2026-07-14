<template>
  <!-- Stepper -->
  <div class="flex items-start justify-center px-4">
    <div class="flex items-start w-full max-w-xs mx-auto">
      <div class="flex flex-col items-center">
        <div class="w-3 h-3 rounded-full bg-primary"></div>
        <span class="text-xs font-medium text-primary mt-2">Lengkapi Data</span>
      </div>
      <div class="flex-1 h-0.5 bg-primary mt-1.5 mx-3"></div>
      <div class="flex flex-col items-center">
        <div class="w-3 h-3 rounded-full bg-primary"></div>
        <span class="text-xs font-medium text-primary mt-2">Buat Kata Sandi</span>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="pageLoading" class="flex justify-center py-12">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <!-- Form Card -->
  <div v-else class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <form @submit.prevent="handleSave">
      <div class="px-4 md:px-8 py-6">
        <!-- Info Alert -->
        <div role="alert" class="alert alert-info bg-white border border-info text-info shadow-none mb-6">
          <div class="flex items-center gap-2">
            <Info class="w-4 h-4 shrink-0" />
            <span v-if="hasExistingPassword" class="text-sm font-semibold">Kamu sudah memiliki kata sandi. Masukkan kata sandi lama untuk menggantinya, atau langsung klik Selesai.</span>
            <span v-else class="text-sm font-semibold">Silahkan buat kata sandi untuk mengakses portal referal kawannusa.</span>
          </div>
        </div>

        <h3 class="text-base font-semibold text-neutral-800 mb-5">{{ hasExistingPassword ? 'Ubah Kata Sandi' : 'Buat Kata Sandi Baru' }}</h3>

        <div class="space-y-4">
          <!-- Old Password - only if user has password -->
          <div v-if="hasExistingPassword" class="form-control w-full max-w-md">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800 font-medium">Kata Sandi Saat Ini<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                v-model="oldPassword"
                :type="showOldPassword ? 'text' : 'password'" 
                placeholder="Masukkan kata sandi lama"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                :class="{ 'border-red-500': errors.oldPassword }"
              />
              <button 
                type="button" 
                @click="showOldPassword = !showOldPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                tabindex="-1"
              >
                <Eye v-if="!showOldPassword" class="w-4.5 h-4.5" />
                <EyeOff v-else class="w-4.5 h-4.5" />
              </button>
            </div>
            <p v-if="errors.oldPassword" class="text-xs text-red-500 mt-1">{{ errors.oldPassword }}</p>
          </div>

          <!-- New Passwords -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'" 
                  placeholder="Masukkan kata sandi baru kamu"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                  :class="{ 'border-red-500': errors.newPassword }"
                />
                <button 
                  type="button" 
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showNewPassword" class="w-4.5 h-4.5" />
                  <EyeOff v-else class="w-4.5 h-4.5" />
                </button>
              </div>
              <p v-if="errors.newPassword" class="text-xs text-red-500 mt-1">{{ errors.newPassword }}</p>
            </div>

            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Konfirmasi Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  placeholder="Konfirmasi kata sandi baru kamu"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                  :class="{ 'border-red-500': errors.confirmPassword }"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4.5 h-4.5" />
                  <EyeOff v-else class="w-4.5 h-4.5" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1">{{ errors.confirmPassword }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 px-4 md:px-8 py-6 border-t border-base-200">
        <NuxtLink 
          to="/boarding"
          class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <ArrowLeft class="w-4.5 h-4.5" />
          Sebelumnya
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold flex items-center gap-2"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <span>Selesai</span>
          <Check class="w-4.5 h-4.5" />
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Info, Eye, EyeOff, ArrowLeft, Check } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import { authService } from '~/services/auth-service'
import type { Profile } from '~/types/profile'
import { z } from 'zod'

definePageMeta({
  layout: 'onboarding',
  layoutTitle: 'Persiapan Akun Referral',
})

useSeoMeta({
  title: 'Kawan Nusa | Buat Kata Sandi',
})

const toast = useToast()
const loading = ref(false)
const pageLoading = ref(true)
const hasExistingPassword = ref(false)
const errors = ref<Record<string, string>>({})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Check if user already has a password
onMounted(async () => {
  try {
    const response = await profileService.getProfile()
    if (response.success && response.data) {
      const p = response.data as Profile
      hasExistingPassword.value = !!p.passwordUpdatedAt
      if (hasExistingPassword.value) {
        await profileService.completeBoarding()
        await authService.refreshUser()
        navigateTo('/boarding/success')
        return
      }
    }
  } finally {
    pageLoading.value = false
  }
})

const newPasswordValidation = z.string()
  .min(8, 'Kata sandi minimal 8 karakter')
  .regex(/[A-Z]/, 'Harus mengandung setidaknya satu huruf besar')
  .regex(/[a-z]/, 'Harus mengandung setidaknya satu huruf kecil')
  .regex(/[0-9]/, 'Harus mengandung setidaknya satu angka')
  .regex(/[^A-Za-z0-9]/, 'Harus mengandung setidaknya satu karakter khusus')

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Kata sandi saat ini tidak boleh kosong'),
  newPassword: newPasswordValidation,
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
})

const setPasswordSchema = z.object({
  newPassword: newPasswordValidation,
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
})

const handleSave = async () => {
  errors.value = {}

  const parseData = hasExistingPassword.value
    ? { oldPassword: oldPassword.value, newPassword: newPassword.value, confirmPassword: confirmPassword.value }
    : { newPassword: newPassword.value, confirmPassword: confirmPassword.value }

  const schema = hasExistingPassword.value ? changePasswordSchema : setPasswordSchema
  const result = schema.safeParse(parseData)

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const payload = hasExistingPassword.value
      ? { oldPassword: oldPassword.value, newPassword: newPassword.value }
      : { newPassword: newPassword.value }

    const passRes = await profileService.updatePassword(payload)
    if (!passRes.success) return

    const boardingRes = await profileService.completeBoarding()
    if (!boardingRes.success) return

    await authService.refreshUser()
    toast.success('Persiapan akun selesai!')
    navigateTo('/boarding/success')
  } finally {
    loading.value = false
  }
}
</script>
