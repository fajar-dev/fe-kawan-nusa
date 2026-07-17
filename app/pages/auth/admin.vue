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
      <!-- Submit -->
      <div>
        <h1 class="text-center text-lg font-semibold">masuk sebagai admin</h1>
        <button
          type="button"
          @click="handleGoogleLogin"
          :disabled="googleLoading"
          class="mt-4 btn w-full"
        >
          
          <span v-if="googleLoading" class="loading loading-spinner loading-xs"></span>
          <svg v-else viewBox="0 0 21 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-34b838a6="">
            <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"></path><path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"></path><path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"></path><path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"></path>
          </svg>
          {{ googleLoading ? 'Memproses...' : 'Login dengan Google' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Masuk',
})

const loading = ref(false)
const googleLoading = ref(false)
const toast = useToast()

const handleOnSuccess = async (response: { code: string }) => {
  googleLoading.value = true
  try {
    await authService.adminGoogle(response.code);
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
</script>
