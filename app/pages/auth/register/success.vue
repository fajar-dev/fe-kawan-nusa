<template>
  <div class="flex-1 flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- Logo -->
      <div class="mb-8 flex flex-col items-center">
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

      <!-- Loading State -->
      <div v-if="checking" class="flex flex-col items-center justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-sm text-neutral-500 mt-4">Memverifikasi...</p>
      </div>

      <!-- Success View -->
      <div v-else class="flex flex-col items-center text-center">
        <!-- Icon Badge -->
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <MailCheck class="w-8 h-8 text-primary" />
        </div>

        <h1 class="text-xl font-semibold text-gray-800 mb-2">Pendaftaran Berhasil!</h1>
        <p class="text-sm text-gray-600 max-w-sm leading-relaxed">
          Silakan cek email kamu untuk memverifikasi akun.
        </p>

        <!-- Email Badge -->
        <!-- <div v-if="email" class="mt-4 inline-flex items-center gap-2 text-primary rounded-lg px-4 py-1">
          <span class="text-sm font-semibold">{{ email }}</span>
        </div> -->

        <p class="text-xs text-gray-400 mt-3 max-w-xs">
          Periksa folder Inbox atau Spam untuk menemukan email verifikasi.
        </p>

        <!-- Actions -->
        <div class="space-y-4 mt-8">
          <button
            @click="handleResend"
            :disabled="resendLoading || cooldown > 0"
            class="btn btn-primary h-10 rounded-lg text-white text-sm font-semibold border-none
                   hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span v-if="resendLoading" class="loading loading-spinner loading-xs"></span>
            <RefreshCw v-else-if="cooldown <= 0" class="w-4 h-4" />
            {{ resendLoading ? 'Mengirim...' : cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : 'Kirim Ulang Email Verifikasi' }}
          </button>

          <div class="text-center">
            <NuxtLink
              to="/auth/sign-in"
              class="text-primary text-sm font-medium hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft class="w-4 h-4" />
              Kembali ke Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-gray-600 mt-auto pt-8">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Mail, MailCheck, ArrowLeft, RefreshCw } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
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
