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

    <!-- Form -->
    <form @submit.prevent="handleForgotPassword" class="space-y-5">
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
          placeholder="Masukkan email terdaftar kamu"
          class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-[10px] text-red-500 mt-1">{{ errors.email }}</p>
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
          {{ loading ? 'Memproses...' : 'Ubah Sandi' }}
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
    
    <!-- Footer -->
    <p class="text-center text-sm text-gray-500 mt-auto pt-10">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { authService } from '~/services/auth-service'
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

// Schema validasi
const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid')
})

const email = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const toast = useToast()

const handleForgotPassword = async () => {
  if (loading.value) return
  
  errors.value = {}

  // Validasi input
  const result = forgotPasswordSchema.safeParse({
    email: email.value
  })

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  loading.value = true

  try {
    const res = await authService.forgotPassword(email.value)
    toast.success({
      message: res.message || 'Instruksi reset password telah dikirim ke email kamu.',
    })
    email.value = ''
  } catch (err: any) {
    toast.error({
      message: err.message || 'Gagal mengirim instruksi reset password.',
    })
  } finally {
    loading.value = false
  }
}
</script>
