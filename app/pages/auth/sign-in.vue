<template>
  <div class="flex-1 flex flex-col">
    <!-- Main Scrollable Content -->
    <div class="flex-1 flex flex-col justify-center">
    <!-- Logo -->
    <div class="mb-10 flex flex-col items-center">
      <div class="inline-flex flex-col">
        <div class="font-display gap-0 flex flex-col leading-none">
          <span class="text-gray-800 font-medium text-6xl">kawan</span>
          <span class="text-primary font-semibold text-5xl -mt-3">nusa</span>
        </div>
        <p class="text-[8px] text-gray-900 tracking-widest uppercase mt-2 font-body">
          Portal Referral PT Media Antar Nusa
        </p>
      </div>
    </div>

    <!-- Unverified Email Alert -->
    <div v-if="showVerificationAlert" class="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div class="flex items-start gap-3">
        <MailX class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="text-sm font-medium text-amber-800">Email belum diverifikasi</p>
          <p class="text-xs text-amber-600 mt-1">Silakan cek email kamu untuk verifikasi akun terlebih dahulu.</p>
          <button
            type="button"
            @click="handleResendVerification"
            :disabled="resendLoading || resendCooldown > 0"
            class="mt-3 btn btn-sm bg-amber-600 hover:bg-amber-700 border-none text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <span v-if="resendLoading" class="loading loading-spinner loading-xs"></span>
            <RefreshCw v-else-if="resendCooldown <= 0" class="w-3.5 h-3.5" />
            {{ resendLoading ? 'Mengirim...' : resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : 'Kirim Ulang Email Verifikasi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="label pb-1">
          <span class="label-text text-sm font-medium text-gray-700">Email atau No. Ponsel</span>
        </label>
        <input
          v-model="identifier"
          type="text"
          placeholder="Masukkan email atau nomor ponsel kamu"
          class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
          :class="{ 'border-red-500': errors.identifier }"
        />
        <p v-if="errors.identifier" class="text-xs text-red-500 mt-1">{{ errors.identifier }}</p>
      </div>

      <!-- Password -->
      <div>
        <label class="label pb-1">
          <span class="label-text text-sm font-medium text-gray-700">Kata Sandi</span>
        </label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan kata sandi kamu"
            class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary pr-10 bg-white"
            :class="{ 'border-red-500': errors.password }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            tabindex="-1"
          >
            <Eye v-if="!showPassword" class="h-4 w-4" />
            <EyeOff v-else class="h-4 w-4" />
          </button>
        </div>
        <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
      </div>

      <!-- Remember + Forgot -->
      <div class="flex items-center justify-between">
        <label class="label cursor-pointer gap-2 p-0">
          <input type="checkbox" v-model="rememberMe" class="checkbox checkbox-sm border-gray-300 rounded" />
          <span class="label-text text-sm text-gray-600">Ingat Saya</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="text-sm text-primary hover:underline">
          Lupa Kata Sandi?
        </NuxtLink>
      </div>

      <!-- Submit -->
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full h-10 rounded-lg text-white text-sm font-semibold border-none
                 hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="loading loading-spinner loading-xs"></span>
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="googleLoading"
          class="mt-4 btn w-full text-primary"
        >
          <span v-if="googleLoading" class="loading loading-spinner loading-xs"></span>
          <svg v-else viewBox="0 0 21 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-34b838a6="">
            <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"></path><path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"></path><path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"></path><path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"></path>
          </svg>
          {{ googleLoading ? 'Memproses...' : 'Login dengan Google' }}
        </button>
        <NuxtLink to="/auth/otp" class="btn btn-link w-full mt-4 text-primary no-underline">Login dengan OTP</NuxtLink>
      </div>

    </form>

    </div>
    
    <!-- Footer -->
    <p class="text-center text-sm text-gray-600 mt-auto pt-10">
      Belum jadi kawan nusa?
      <NuxtLink to="/auth/register" class="text-primary font-semibold hover:underline">Daftar Disini</NuxtLink>
      <br>
      Atau
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi Kami</NuxtLink>
      untuk bantuan lebih lanjut
    </p>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff, MailX, RefreshCw } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'
import { apiService } from '~/services/api-service'
import { z } from 'zod'
import type { AuthResponse } from '~/types/auth'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Masuk',
})

// Schema validasi
const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau Nomor ponsel tidak boleh kosong'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter')
})

const identifier = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const errors = ref<Record<string, string>>({})
const toast = useToast()

// Verification alert state
const showVerificationAlert = ref(false)
const resendLoading = ref(false)
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const handleOnSuccess = async (response: { code: string }) => {
  googleLoading.value = true
  try {
    await authService.google(response.code);
    toast.success('Login berhasil! Selamat datang.')
    navigateTo('/')
  } finally {
    googleLoading.value = false
  }
};

const handleOnError = () => {
  googleLoading.value = false
  toast.error('Login dengan Google gagal. Silakan coba lagi.')
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const handleGoogleLogin = () => {
  if (!isReady.value) return
  login()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

const handleResendVerification = async () => {
  if (resendLoading.value || resendCooldown.value > 0) return

  const email = identifier.value
  if (!email) {
    toast.error('Masukkan email terlebih dahulu.')
    return
  }

  resendLoading.value = true
  try {
    const res = await authService.resendVerification(email)
    toast.success(res.message || 'Email verifikasi berhasil dikirim ulang.')
    startResendCooldown()
  } finally {
    resendLoading.value = false
  }
}

const handleLogin = async () => {
  if (loading.value) return
  
  errors.value = {}
  showVerificationAlert.value = false

  // Validasi input
  const result = loginSchema.safeParse({
    identifier: identifier.value,
    password: password.value
  })

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true

  try {
    const response = await apiService.client.post<AuthResponse>('/auth/login', {
      identifier: identifier.value,
      password: password.value
    })
    // Set session manually (same as authService internals)
    const { user, accessToken, refreshToken } = response.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    authService.token.value = accessToken
    authService.user.value = user

    toast.success('Login berhasil! Selamat datang.')
    navigateTo('/')
  } catch (error: any) {
    const responseData = error?.response?.data
    const message = responseData?.message || ''

    if (message.toLowerCase().includes('verify') || message.toLowerCase().includes('verifikasi')) {
      showVerificationAlert.value = true
      toast.error(message)
    } else {
      // Show general error toast
      let errorMessage = ''
      if (error?.response?.status === 422 && responseData?.errors) {
        errorMessage = responseData.errors.map((err: any) => err.message).join(', ')
      } else {
        errorMessage = message || error?.message || 'Terjadi kesalahan'
      }
      toast.error(message || 'Gagal', errorMessage !== message ? errorMessage : '')
    }
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

