<template>
  <div class="w-full max-w-[450px]">
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
            required
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
            required
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
          Perbarui Kata Sandi
        </button>
        <div class="text-center">
          <NuxtLink to="/auth/sign-in" class="text-primary text-sm font-medium hover:underline flex items-center justify-center gap-2">
            <ArrowLeft class="w-5 h-5" />
            Kembali ke Login
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <p class="absolute bottom-10 left-0 right-0 text-center text-sm text-gray-500">
        Butuh bantuan?
        <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth'
})

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Kata sandi tidak cocok!')
    return
  }
  
  loading.value = true
  // Simulate password reset logic
  setTimeout(() => {
    loading.value = false
    navigateTo('/auth/sign-in')
  }, 1000)
}
</script>
