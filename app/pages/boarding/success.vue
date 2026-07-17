<template>
  <!-- Success Card -->
  <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <div class="flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 min-h-[650px]">

      <!-- Not Verified: Cek Email -->
      <template v-if="!user?.isVerified">
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <MailCheck class="w-10 h-10 text-primary" />
        </div>
        <h2 class="text-lg font-semibold text-neutral-800 mb-3">Verifikasi Email Anda</h2>
        <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
          Kami telah mengirimkan email verifikasi ke <span class="font-semibold text-neutral-700">{{ user?.email }}</span>. 
          Silakan buka email Anda dan klik link verifikasi untuk melanjutkan.
        </p>
        <button
          @click="handleLogout"
          class="text-primary text-sm font-medium hover:underline flex items-center gap-2 mt-8"
        >
          <ArrowLeft class="w-4.5 h-4.5" />
          Kembali ke Login
        </button>
      </template>

      <!-- Pending: Menunggu Approval -->
      <template v-else-if="user?.status === 'pending'">
        <img src="/assets/success.svg" alt="Pendaftaran Sedang Ditinjau" class="w-52 h-52 mb-8" />
        <h2 class="text-lg font-semibold text-neutral-800 mb-3">Pendaftaran Sedang Ditinjau</h2>
        <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
          Terima kasih! Pendaftaran Anda telah kami terima dan saat ini sedang dalam proses peninjauan oleh tim kami. Mohon tunggu informasi selanjutnya yang akan kami kirimkan melalui email.
        </p>
        <button
          @click="handleLogout"
          class="text-primary text-sm font-medium hover:underline flex items-center gap-2 mt-8"
        >
          <ArrowLeft class="w-4.5 h-4.5" />
          Kembali ke Login
        </button>
      </template>

      <!-- Reject: Ditolak -->
      <template v-else-if="user?.status === 'reject'">
        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <XCircle class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-lg font-semibold text-red-600 mb-3">Pendaftaran Ditolak</h2>
        <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
          Maaf, pendaftaran Anda tidak dapat kami setujui saat ini.
        </p>
        <div v-if="user?.statusNote" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 max-w-md">
          <p class="text-sm text-red-700 font-medium">Alasan:</p>
          <p class="text-sm text-red-600 mt-1">{{ user.statusNote }}</p>
        </div>
        <div class="flex items-center gap-4 mt-8">
          <button
            @click="handleLogout"
            class="text-primary text-sm font-medium hover:underline flex items-center gap-2"
          >
            <ArrowLeft class="w-4.5 h-4.5" />
            Kembali ke Login
          </button>
          <NuxtLink
            to="#"
            class="text-sm text-neutral-500 hover:text-primary font-medium"
          >
            Hubungi Kami
          </NuxtLink>
        </div>
      </template>

      <!-- Inactive: Nonaktif -->
      <template v-else-if="user?.status === 'inactive'">
        <div class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <ShieldOff class="w-10 h-10 text-neutral-400" />
        </div>
        <h2 class="text-lg font-semibold text-neutral-700 mb-3">Akun Tidak Aktif</h2>
        <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
          Akun Anda saat ini tidak aktif. Silakan hubungi tim kami untuk informasi lebih lanjut.
        </p>
        <div v-if="user?.statusNote" class="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mt-4 max-w-md">
          <p class="text-sm text-neutral-700 font-medium">Keterangan:</p>
          <p class="text-sm text-neutral-600 mt-1">{{ user.statusNote }}</p>
        </div>
        <button
          @click="handleLogout"
          class="text-primary text-sm font-medium hover:underline flex items-center gap-2 mt-8"
        >
          <ArrowLeft class="w-4.5 h-4.5" />
          Kembali ke Login
        </button>
      </template>

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
import { ArrowLeft, MailCheck, XCircle, ShieldOff } from 'lucide-vue-next'

definePageMeta({
  layout: 'onboarding',
})

useSeoMeta({
  title: 'Kawan Nusa | Status Pendaftaran',
})

const { state, service } = useAuth()
const user = computed(() => state.user)

const handleLogout = async () => {
  await service.logout()
  navigateTo('/auth/sign-in')
}
</script>
