<template>
  <!-- Success Card -->
  <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <div class="flex flex-col items-center justify-center text-center px-4 md:px-8 py-16 min-h-[650px]">
      <!-- Illustration -->
      <img src="/assets/sucess.svg" alt="Pendaftaran Berhasil" class="w-52 h-52 mb-8" />

      <!-- Title -->
      <h2 class="text-lg font-semibold text-neutral-800 mb-3">Pendaftaran Anda Telah Berhasil!</h2>

      <!-- Description -->
      <p class="text-sm text-neutral-500 max-w-md leading-relaxed">
        Email verifikasi akan dikirimkan ke alamat email Anda.
        <br />
        Silakan periksa Inbox atau folder Spam untuk melakukan verifikasi
        akun dan menyelesaikan proses pendaftaran.
      </p>

      <!-- Button -->
      <NuxtLink
        to="/auth/sign-in"
        class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold mt-8 px-8"
      >
        Kembali ke Login
      </NuxtLink>
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
definePageMeta({
  layout: 'onboarding',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Pendaftaran Berhasil',
})
</script>
