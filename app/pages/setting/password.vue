<template>
  <div class="space-y-4">
    <!-- Password Change Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-neutral-800">Perubahan Kata Sandi</h3>
          <button class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>

        <!-- Info Alert -->
        <div role="alert" class="alert alert-info bg-info/10 border-info/10 text-info shadow-none flex flex-col items-start gap-1">
          <div class="flex items-center gap-2">
          <Info class="w-4 h-4" />
            <span class="font-bold">Terakhir diubah {{ timeAgo(profile?.passwordUpdatedAt) }}</span>
          </div>
          <span class="text-xs ml-7 text-neutral-500 font-normal">Demi keamanan akun Anda, kami menyarankan untuk mengganti kata sandi setiap 90 hari.</span>
        </div>
        
        <div class="space-y-4">
          <!-- Current Password - Top -->
          <div class="form-control w-full max-w-md">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Kata Sandi Saat Ini<span class="text-red-500">*</span></span>
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
                <Eye v-if="!showOldPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.oldPassword" class="text-[10px] text-red-500 mt-1">{{ errors.oldPassword }}</p>
          </div>

          <!-- New Passwords - Bottom Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'" 
                  placeholder="Minimal 6 karakter"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                  :class="{ 'border-red-500': errors.newPassword }"
                />
                <button 
                  type="button" 
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showNewPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.newPassword" class="text-[10px] text-red-500 mt-1">{{ errors.newPassword }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Ulangi Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  placeholder="Ulangi kata sandi baru"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                  :class="{ 'border-red-500': errors.confirmPassword }"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabindex="-1"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 mt-1">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Bottom Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4">
            <button 
              @click="resetForm"
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
            >
              Batalkan
            </button>
            <button 
              @click="handleSave"
              :disabled="loading"
              class="btn btn-primary rounded-lg px-6"
            >
              <span v-if="loading" class="loading loading-spinner loading-xs"></span>
              Ubah Kata Sandi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoreHorizontal, Info, Eye, EyeOff } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import type { User } from '~/types/auth'
import { z } from 'zod'

const toast = useToast()
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const profile = inject<Ref<User | null>>('profile')

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Kata sandi saat ini tidak boleh kosong'),
  newPassword: z.string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus mengandung setidaknya satu huruf besar')
    .regex(/[a-z]/, 'Harus mengandung setidaknya satu huruf kecil')
    .regex(/[0-9]/, 'Harus mengandung setidaknya satu angka')
    .regex(/[^A-Za-z0-9]/, 'Harus mengandung setidaknya satu karakter khusus'),
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
})

const resetForm = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errors.value = {}
}

const handleSave = async () => {
  errors.value = {}

  const result = passwordSchema.safeParse({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value
  })

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const response = await profileService.updatePassword({
      oldPassword: result.data.oldPassword,
      newPassword: result.data.newPassword
    })
    
    if (response.success) {
      toast.success({
        message: response.message || 'Kata sandi berhasil diperbarui'
      })
      resetForm()
    }
  } catch (error: any) {
    toast.error({
      message: error.message || 'Gagal mengubah kata sandi'
    })
  } finally {
    loading.value = false
  }
}
</script>