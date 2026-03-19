<template>
  <div class="flex-1 flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col justify-center">
    <!-- Logo -->
    <div class="mb-10 flex flex-col items-center">
      <div class="inline-flex flex-col">
        <div class="font-display gap-0 flex flex-col leading-none">
          <span class="text-gray-800 font-medium text-6xl">kawan</span>
          <span class="text-primary font-semibold text-5xl -mt-3">nusa</span>
        </div>
        <p class="text-[8px] text-gray-900 tracking-widest uppercase mt-2 font-body">
          Portal Referal PT Media Antar Nusa
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleResetPassword" class="space-y-5">
      <div>
        <h1 class="text-lg font-medium text-gray-800">Buat Kata Sandi Baru</h1>
        <p class="text-gray-600 text-sm">Pastikan kata sandi Anda cukup kuat untuk menjaga keamanan akun.</p>
      </div>

      <!-- New Password -->
      <div>
        <label class="label pb-1">
          <span class="label-text text-sm font-medium text-gray-700">Kata Sandi Baru</span>
        </label>
        <div class="relative">
          <input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Masukkan kata sandi baru"
            class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary pr-10 bg-white"
            :class="{ 'border-red-500': errors.newPassword }"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            tabindex="-1"
          >
            <Eye v-if="!showNewPassword" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
          </button>
        </div>
        <p v-if="errors.newPassword" class="text-[10px] text-red-500 mt-1">{{ errors.newPassword }}</p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="label pb-1">
          <span class="label-text text-sm font-medium text-gray-700">Ulangi Kata Sandi</span>
        </label>
        <div class="relative">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Ulangi kata sandi baru"
            class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary pr-10 bg-white"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            tabindex="-1"
          >
            <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 mt-1">{{ errors.confirmPassword }}</p>
      </div>

      <!-- Submit -->
      <div class="space-y-8">
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full h-10 rounded-lg text-white text-sm border-none
                 hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          {{ loading ? 'Memproses...' : 'Perbarui Kata Sandi' }}
        </button>
        <div class="text-center">
          <NuxtLink to="/auth/sign-in" class="text-primary text-sm font-medium hover:underline flex items-center justify-center gap-2">
            <ArrowLeft class="w-4 h-4" />
            Kembali ke Login
          </NuxtLink>
        </div>
      </div>
    </form>

    </div>
    
    <!-- Footer -->
    <p class="text-center text-sm text-gray-500 mt-auto pt-10">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Eye, EyeOff } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const route = useRoute()
const toast = useToast()

const email = route.query.email as string
const token = route.query.token as string

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Schema validasi
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus mengandung setidaknya satu huruf besar')
    .regex(/[a-z]/, 'Harus mengandung setidaknya satu huruf kecil')
    .regex(/[0-9]/, 'Harus mengandung setidaknya satu angka')
    .regex(/[^A-Za-z0-9]/, 'Harus mengandung setidaknya satu karakter khusus'),
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword']
})

// Validasi token saat load
onMounted(async () => {
    if (!email || !token) {
        toast.error({
            message: 'Tautan reset tidak valid. Silakan coba lagi.'
        })
        navigateTo('/auth/forgot-password')
        return
    }

    try {
        await authService.validateResetPassword(email, token)
    } catch (err: any) {
        toast.error({
            message: err.message || 'Tautan reset sudah kadaluwarsa atau tidak valid.'
        })
        navigateTo('/auth/forgot-password')
    }
})

const handleResetPassword = async () => {
  if (loading.value) return
  
  errors.value = {}

  // Validasi input
  const result = resetPasswordSchema.safeParse({
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
    const res = await authService.resetPassword(token, newPassword.value)
    toast.success({
      message: res.message || 'Kata sandi berhasil diperbarui.'
    })
    navigateTo('/auth/sign-in')
  } catch (err: any) {
    console.error('Reset password error:', err)
    toast.error({
      message: err.message || 'Gagal memperbarui kata sandi.'
    })
  } finally {
    loading.value = false
  }
}
</script>
