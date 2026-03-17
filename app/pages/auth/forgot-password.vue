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
    <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
            <h1 class="text-lg font-medium text-gray-800">Lupa Kata Sandi?</h1>
            <p class="text-gray-600 text-sm pt-2">Masukkan email kamu untuk reset kata sandi</p>
        </div>
      <!-- Email -->
      <div>
        <label class="label pb-1">
          <span class="label-text text-sm font-medium text-gray-700">Email</span>
        </label>
        <input
          v-model="email"
          type="email"
          placeholder="Masukkan email atau nomor ponsel kamu"
          class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
          required
        />
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
          Reset Password
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

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  // Simulate login logic
  setTimeout(() => {
    loading.value = false
    navigateTo('/')
  }, 1000)
}
</script>
