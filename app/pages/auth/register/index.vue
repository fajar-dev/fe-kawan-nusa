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
            Portal Referral PT Media Antar Nusa
          </p>
        </div>
      </div>

      <!-- Title / Header -->
      <div class="mb-6">
        <h1 class="text-xl font-semibold text-gray-800">Daftar Akun Kawan Nusa</h1>
        <p class="text-gray-500 text-sm mt-1">Isi data di bawah untuk mendaftar akun baru</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nama Depan & Nama Belakang -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Depan</span>
            </label>
            <input
              v-model="form.firstName"
              type="text"
              placeholder="Nama depan"
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
          </div>
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Belakang</span>
            </label>
            <input
              v-model="form.lastName"
              type="text"
              placeholder="Nama belakang"
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- Alamat Email -->
        <div>
          <label class="label pb-1">
            <span class="label-text text-sm font-medium text-gray-700">Alamat Email</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="Masukkan alamat email kamu"
            class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Kata Sandi -->
        <div>
          <label class="label pb-1">
            <span class="label-text text-sm font-medium text-gray-700">Kata Sandi</span>
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan kata sandi"
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

        <!-- Ulangi Kata Sandi -->
        <div>
          <label class="label pb-1">
            <span class="label-text text-sm font-medium text-gray-700">Ulangi Kata Sandi</span>
          </label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Ulangi kata sandi kamu"
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
          <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-full h-10 rounded-lg text-white text-sm font-semibold border-none
                   hover:opacity-90 active:scale-[.98] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs"></span>
            {{ loading ? 'Memproses...' : 'Daftar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-gray-600 mt-auto pt-6">
      Sudah punya akun kawan nusa?
      <NuxtLink to="/auth/sign-in" class="text-primary font-semibold hover:underline">Masuk</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { z } from 'zod'
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Daftar',
})

const toast = useToast()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref<Record<string, string>>({})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Schema validasi
const registerSchema = z.object({
  firstName: z.string().min(1, 'Nama depan tidak boleh kosong'),
  lastName: z.string().optional(),
  email: z.string().min(1, 'Alamat email tidak boleh kosong').email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Kata sandi tidak cocok',
  path: ['confirmPassword'],
})

const handleSubmit = async () => {
  if (loading.value) return
  errors.value = {}

  const result = registerSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true
  try {
    const response = await authService.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    })

    if (response.success) {
      toast.success(response.message || 'Pendaftaran berhasil dikirim! Silakan cek email kamu.')
      navigateTo(`/auth/register/success?email=${encodeURIComponent(form.email)}`)
    }
  } finally {
    loading.value = false
  }
}
</script>
