<template>
  <!-- Loading Check -->
  <div v-if="checking" class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <div class="flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 min-h-[650px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-sm text-neutral-500 mt-4">Memverifikasi...</p>
    </div>
  </div>

  <!-- Success Card -->
  <div v-else class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <div class="flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 min-h-[650px]">
      <!-- Illustration -->
      <img src="/assets/sucess.svg" alt="Pendaftaran Berhasil" class="w-52 h-52 mb-8" />

      <!-- Title -->
      <h2 class="text-lg font-semibold text-neutral-800 mb-3">Pendaftaran Berhasil!</h2>

      <!-- Description -->
      <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
        Silakan cek email kamu untuk verifikasi akun.
        <br />
        Email verifikasi telah dikirim ke:
      </p>

      <!-- Email Badge -->
      <div v-if="email" class="mt-3 inline-flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-2">
        <Mail class="w-4 h-4" />
        <span class="text-sm font-medium">{{ email }}</span>
      </div>

      <p class="text-xs text-neutral-400 mt-3 max-w-sm">
        Periksa folder Inbox atau Spam untuk menemukan email verifikasi.
      </p>

      <!-- Resend Button -->
      <button
        @click="handleResend"
        :disabled="resendLoading || cooldown > 0"
        class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold mt-8 px-8 flex items-center gap-2"
      >
        <span v-if="resendLoading" class="loading loading-spinner loading-xs"></span>
        <RefreshCw v-else-if="cooldown <= 0" class="w-4 h-4" />
        {{ resendLoading ? 'Mengirim...' : cooldown > 0 ? `Kirim Ulang Email (${cooldown}s)` : 'Kirim Ulang Email' }}
      </button>

      <!-- Back to Login -->
      <NuxtLink
        to="/auth/sign-in"
        class="text-primary text-sm font-medium hover:underline flex items-center gap-2 mt-5"
      >
        <ArrowLeft class="w-4 h-4" />
        Kembali ke Login
      </NuxtLink>
    </div>
  </div>

  <!-- Footer -->
  <div class="py-6">
    <p class="text-center text-sm text-gray-500">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Mail, ArrowLeft, RefreshCw } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'onboarding',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Pendaftaran Berhasil',
})

const route = useRoute()
const toast = useToast()

const email = computed(() => route.query.email as string || '')
const resendLoading = ref(false)
const cooldown = ref(0)
const checking = ref(true)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

// Check email validity on mount
onMounted(async () => {
  if (!email.value) {
    navigateTo('/auth/sign-in')
    return
  }

  try {
    await authService.checkEmailStatus(email.value)
    checking.value = false
  } catch {
    // Email already verified, not found, or invalid → redirect
    navigateTo('/auth/sign-in')
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

  resendLoading.value = true
  try {
    const res = await authService.resendVerification(email.value)
    toast.success(res.message || 'Email verifikasi berhasil dikirim ulang.')
    startCooldown()
  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('verified') || msg.includes('not found')) {
      toast.info('Email sudah diverifikasi atau tidak terdaftar.')
      navigateTo('/auth/sign-in')
    }
  } finally {
    resendLoading.value = false
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>
