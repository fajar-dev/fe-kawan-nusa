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

    <!-- Loading State -->
    <div v-if="verifying" class="text-center space-y-4">
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
      <p class="text-sm text-gray-600">Memverifikasi email kamu...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="verified" class="space-y-5">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <MailCheck class="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 class="text-lg font-medium text-gray-800">Email Berhasil Diverifikasi!</h1>
        <p class="text-gray-600 text-sm pt-2">Akun kamu sudah aktif. Silakan login untuk melanjutkan.</p>
      </div>

      <div class="space-y-8">
        <NuxtLink
          to="/auth/sign-in"
          class="btn btn-primary w-full h-10 rounded-lg text-white text-sm border-none
                 hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <CheckCircle class="w-4 h-4" />
          Masuk ke Akun
        </NuxtLink>
      </div>
    </div>

    <!-- Error / Expired State -->
    <div v-else class="space-y-5">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <MailX class="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h1 class="text-lg font-medium text-gray-800">Verifikasi Gagal</h1>
        <p class="text-gray-600 text-sm pt-2">{{ errorMessage }}</p>
      </div>

      <!-- Resend Form -->
      <form @submit.prevent="handleResend" class="space-y-5">
        <div>
          <label class="label pb-1">
            <span class="label-text text-sm font-medium text-gray-700">Email</span>
          </label>
          <input
            v-model="resendEmail"
            type="email"
            placeholder="Masukkan email terdaftar kamu"
            class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div class="space-y-8">
          <button
            type="submit"
            :disabled="resendLoading || cooldown > 0"
            class="btn btn-primary w-full h-10 rounded-lg text-white text-sm border-none
                   hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span v-if="resendLoading" class="loading loading-spinner loading-xs"></span>
            <RefreshCw v-else-if="cooldown <= 0" class="w-4 h-4" />
            {{ resendLoading ? 'Mengirim...' : cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : 'Kirim Ulang Email Verifikasi' }}
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

    </div>
    
    <!-- Footer -->
    <p class="text-center text-sm text-gray-500 mt-auto pt-10">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { MailCheck, MailX, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Kawan Nusa | Verifikasi Email',
})

const route = useRoute()
const toast = useToast()

const verifying = ref(true)
const verified = ref(false)
const errorMessage = ref('Tautan verifikasi tidak valid atau sudah kedaluwarsa. Silakan kirim ulang email verifikasi.')
const resendEmail = ref('')
const resendLoading = ref(false)
const cooldown = ref(0)
const errors = ref<Record<string, string>>({})

let cooldownTimer: ReturnType<typeof setInterval> | null = null

const emailSchema = z.object({
  email: z.string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid')
})

// Verify token on mount
onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    verifying.value = false
    errorMessage.value = 'Tautan verifikasi tidak valid. Token tidak ditemukan.'
    return
  }

  try {
    await authService.verifyEmail(token)
    verified.value = true
  } catch {
    verified.value = false
  } finally {
    verifying.value = false
  }
})

const startCooldown = () => {
  cooldown.value = 60
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

const handleResend = async () => {
  if (resendLoading.value || cooldown.value > 0) return

  errors.value = {}

  const result = emailSchema.safeParse({ email: resendEmail.value })
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  resendLoading.value = true
  try {
    const res = await authService.resendVerification(resendEmail.value)
    toast.success(res.message || 'Email verifikasi berhasil dikirim ulang.')
    startCooldown()
  } finally {
    resendLoading.value = false
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>
