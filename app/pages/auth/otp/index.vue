<template>
  <div class="flex-1 flex flex-col">
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

      <!-- Step 1: Enter Identifier -->
      <form v-if="step === 'identifier'" @submit.prevent="handleSendOtp" class="space-y-5">
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

        <div>
          <button
            type="submit"
            :disabled="sendLoading"
            class="btn btn-primary w-full h-10 rounded-lg text-white text-sm font-semibold border-none
                   hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span v-if="sendLoading" class="loading loading-spinner loading-xs"></span>
            {{ sendLoading ? 'Mengirim...' : 'Kirim OTP' }}
          </button>
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="googleLoading"
            class="mt-4 btn w-full text-primary"
          >
            <span v-if="googleLoading" class="loading loading-spinner loading-xs"></span>
            <svg v-else viewBox="0 0 21 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"></path><path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"></path><path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"></path><path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"></path>
            </svg>
            {{ googleLoading ? 'Memproses...' : 'Login dengan Google' }}
          </button>
          <NuxtLink to="/auth/sign-in" class="btn btn-link w-full mt-4 text-primary no-underline">Login dengan Password</NuxtLink>
        </div>
      </form>

      <!-- Step 2: Enter OTP Code -->
      <form v-else @submit.prevent="handleVerifyOtp" class="space-y-5">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-800">Verifikasi Kode OTP</h2>
          <p class="text-sm text-gray-600 mt-2">
            Masukkan 6 digit kode OTP yang telah dikirim ke email atau nomor ponsel Anda.
          </p>
        </div>

        <!-- OTP Input -->
        <div class="flex justify-center gap-2">
          <input
            v-for="(_, i) in 6"
            :key="i"
            ref="otpInputs"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="input input-bordered w-11 h-12 text-center text-lg font-bold rounded-lg border-gray-200 focus:border-primary bg-white"
            :class="{ 'border-red-500': errors.code }"
            @input="handleOtpInput(i, $event)"
            @keydown="handleOtpKeydown(i, $event)"
            @paste="handleOtpPaste($event)"
          />
        </div>
        <p v-if="errors.code" class="text-xs text-red-500 text-center">{{ errors.code }}</p>

        <button
          type="submit"
          :disabled="verifyLoading"
          class="btn btn-primary w-full h-10 rounded-lg text-white text-sm font-semibold border-none
                 hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span v-if="verifyLoading" class="loading loading-spinner loading-xs"></span>
          {{ verifyLoading ? 'Memverifikasi...' : 'Verifikasi' }}
        </button>

        <!-- Resend -->
        <div class="text-center text-sm">
          <span class="text-gray-600">Belum menerima kode OTP? </span>
          <button
            type="button"
            @click="handleResendOtp"
            :disabled="sendLoading || resendCooldown > 0"
            class="text-primary font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            Kirim Ulang
          </button>
          <p v-if="resendCooldown > 0" class="text-primary font-medium mt-2">
            {{ String(Math.floor(resendCooldown / 60)).padStart(2, '0') }}:{{ String(resendCooldown % 60).padStart(2, '0') }}
          </p>
        </div>

        <!-- Back -->
        <div class="text-center">
          <button type="button" @click="step = 'identifier'" class="text-sm text-gray-500 hover:text-gray-700">
            ← Ubah email/nomor ponsel
          </button>
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
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Login OTP',
})

const toast = useToast()
const step = ref<'identifier' | 'otp'>('identifier')
const identifier = ref('')
const sendLoading = ref(false)
const verifyLoading = ref(false)
const googleLoading = ref(false)
const errors = ref<Record<string, string>>({})
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null
const otpInputs = ref<HTMLInputElement[]>([])

const handleOnSuccess = async (response: { code: string }) => {
  googleLoading.value = true
  try {
    await authService.google(response.code)
    toast.success('Login berhasil! Selamat datang.')
    navigateTo('/')
  } finally {
    googleLoading.value = false
  }
}

const handleOnError = () => {
  googleLoading.value = false
  toast.error('Login dengan Google gagal. Silakan coba lagi.')
}

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
})

const handleGoogleLogin = () => {
  if (!isReady.value) return
  login()
}

const maskedIdentifier = computed(() => {
  const val = identifier.value
  if (val.includes('@')) {
    const [local = '', domain = ''] = val.split('@')
    return local.slice(0, 2) + '***@' + domain
  }
  if (val.length > 4) {
    return val.slice(0, 4) + '****' + val.slice(-2)
  }
  return val
})

const getOtpCode = (): string => {
  return otpInputs.value.map(input => input?.value || '').join('')
}

const startCooldown = () => {
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

const handleSendOtp = async () => {
  errors.value = {}
  if (!identifier.value.trim()) {
    errors.value.identifier = 'Email atau nomor ponsel tidak boleh kosong'
    return
  }

  sendLoading.value = true
  try {
    const res = await authService.sendOtp(identifier.value)
    if (res.success) {
      const target = res.data.type === 'email' ? 'email' : 'nomor ponsel'
      toast.success(`Kode OTP telah dikirim ke ${target} kamu.`)
      step.value = 'otp'
      startCooldown()
      nextTick(() => otpInputs.value[0]?.focus())
    }
  } finally {
    sendLoading.value = false
  }
}

const handleResendOtp = async () => {
  if (sendLoading.value || resendCooldown.value > 0) return
  sendLoading.value = true
  try {
    const res = await authService.sendOtp(identifier.value)
    if (res.success) {
      toast.success('Kode OTP berhasil dikirim ulang.')
      startCooldown()
      // Clear OTP inputs
      otpInputs.value.forEach(input => { if (input) input.value = '' })
      otpInputs.value[0]?.focus()
    }
  } finally {
    sendLoading.value = false
  }
}

const handleVerifyOtp = async () => {
  errors.value = {}
  const code = getOtpCode()
  if (code.length !== 6) {
    errors.value.code = 'Masukkan 6 digit kode OTP'
    return
  }

  verifyLoading.value = true
  try {
    const res = await authService.verifyOtp(identifier.value, code)
    if (res.success) {
      toast.success('Login berhasil! Selamat datang.')
      navigateTo('/')
    }
  } finally {
    verifyLoading.value = false
  }
}

// OTP input handlers
const handleOtpInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  input.value = value.slice(0, 1)
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    const input = otpInputs.value[index]
    if (!input?.value && index > 0) {
      otpInputs.value[index - 1]?.focus()
    }
  }
}

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || ''
  pasted.split('').forEach((char, i) => {
    if (otpInputs.value[i]) {
      otpInputs.value[i].value = char
    }
  })
  const nextIndex = Math.min(pasted.length, 5)
  otpInputs.value[nextIndex]?.focus()
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>
