<template>
  <div class="w-full max-w-[500px]">
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
            required
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
      </div>

      <!-- Remember + Forgot -->
      <div class="flex items-center justify-between">
        <label class="label cursor-pointer gap-2 p-0">
          <input type="checkbox" v-model="rememberMe" class="checkbox checkbox-sm border-gray-300 rounded" />
          <span class="label-text text-sm text-gray-600">Ingat Saya</span>
        </label>
        <NuxtLink to="#" class="text-sm text-primary hover:underline">
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
          Login
        </button>
      </div>

      <!-- Footer -->
      <p class="absolute bottom-10 left-0 right-0 text-center text-sm text-gray-500">
        Belum jadi kawan nusa?
        <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

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
