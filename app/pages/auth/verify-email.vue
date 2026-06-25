<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-sm text-neutral-500">Memverifikasi email...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authService } from '~/services/auth-service'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Kawan Nusa | Verifikasi Email',
})

const route = useRoute()
const toast = useToast()

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    toast.error('Tautan verifikasi tidak valid.')
    return navigateTo('/auth/sign-in')
  }

  try {
    const res = await authService.verifyEmail(token)
    if (res.success) {
      toast.success('Email berhasil diverifikasi!')
      return navigateTo('/')
    }
  } catch {}

  navigateTo('/auth/sign-in')
})
</script>
