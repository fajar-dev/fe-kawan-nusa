<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Coins class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Skema Poin</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Skema Poin
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-5 pb-10">
            <!-- Point Value Banner -->
            <div class="w-full bg-success/5 border border-success/10 rounded-xl p-8 md:p-12 text-center">
                <div class="flex flex-col items-center gap-6">
                    <div class="flex items-center justify-center gap-6 md:gap-10">
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-14 h-14 flex items-center justify-center text-purple-500">
                                <Coins class="w-12 h-12" />
                            </div>
                            <span class="text-xl font-medium text-neutral-800">1 Poin</span>
                        </div>
                        
                        <div class="text-4xl">=</div>
                        
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-14 h-14 flex items-center justify-center text-primary">
                                <Banknote class="w-12 h-12" />
                            </div>
                            <span class="text-xl font-medium text-neutral-800">Rp 1.000</span>
                        </div>
                    </div>
                    
                    <p class="text-sm md:text-base text-neutral-800 max-w-4xl">
                        Setiap poin yang Anda kumpulkan dapat langsung ditukar menjadi uang tunai atau reward lainnya
                    </p>
                </div>
            </div>

            <!-- Cara Mendapatkan Poin Section -->
            <section class="space-y-5">
                <h2 class="text-lg font-semibold text-neutral-800">Cara Mendapatkan Poin</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="card bg-white border border-base-300 p-6 flex flex-col items-center text-center transition-all">
                        <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-5 text-success">
                            <UserPlus class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 mb-2">Mengajak Pelanggan Baru</h3>
                        <p class="text-xs text-neutral-600 px-2">
                            Dapatkan poin ketika pelanggan yang Anda ajak berhasil berlangganan layanan.
                        </p>
                    </div>

                    <div class="card bg-white border border-base-300 p-6 flex flex-col items-center text-center transition-all">
                        <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-5 text-success">
                            <CheckCircle class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 mb-2">Pengguna Tetap Aktif</h3>
                        <p class="text-xs text-neutral-600 px-2">
                            Poin dapat terus diperoleh selama pengguna masih aktif menggunakan layanan.
                        </p>
                    </div>

                    <div class="card bg-white border border-base-300 p-6 flex flex-col items-center text-center transition-all">
                        <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-5 text-success">
                            <CreditCard class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 mb-2">Pembayaran Layanan</h3>
                        <p class="text-xs text-neutral-600 px-2">
                            Poin diproses setelah pelanggan menyelesaikan pembayaran layanan.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Alur Perolehan Poin Section -->
            <section class="space-y-5">
                <h2 class="text-lg font-semibold text-neutral-800">Alur Perolehan Poin</h2>

                <div class="rounded-xl border border-base-300 bg-white p-6 md:p-10">
                    <div class="relative flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        
                        <!-- Connecting line desktop -->
                        <div class="absolute left-[12.5%] right-[12.5%] top-5 hidden h-0.5 bg-success/20 md:block"></div>

                        <!-- Step 1 -->
                        <div class="relative flex items-start gap-4 md:w-1/4 md:flex-col md:items-center md:text-center">
                            <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-sm font-semibold text-white shadow-sm shadow-success/20">
                                1
                            </div>
                            <div class="min-w-0 md:min-h-[48px] flex items-center">
                                <p class="text-xs font-medium leading-relaxed text-neutral-500 md:text-sm">
                                    Bagikan penawaran atau ajak calon pelanggan
                                </p>
                            </div>
                            <!-- Mobile vertical line -->
                            <div class="absolute left-5 top-10 block h-[calc(100%+12px)] w-0.5 -translate-x-1/2 bg-success/20 md:hidden"></div>
                        </div>

                        <!-- Step 2 -->
                        <div class="relative flex items-start gap-4 md:w-1/4 md:flex-col md:items-center md:text-center">
                            <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-sm font-semibold text-white shadow-sm shadow-success/20">
                                2
                            </div>
                            <div class="min-w-0 md:min-h-[48px] flex items-center">
                                <p class="text-xs font-medium leading-relaxed text-neutral-500 md:text-sm">
                                    Pelanggan melakukan registrasi dan pembayaran layanan
                                </p>
                            </div>
                            <!-- Mobile vertical line -->
                            <div class="absolute left-5 top-10 block h-[calc(100%+12px)] w-0.5 -translate-x-1/2 bg-success/20 md:hidden"></div>
                        </div>

                        <!-- Step 3 -->
                        <div class="relative flex items-start gap-4 md:w-1/4 md:flex-col md:items-center md:text-center">
                            <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-sm font-semibold text-white shadow-sm shadow-success/20">
                                3
                            </div>
                            <div class="min-w-0 md:min-h-[48px] flex items-center">
                                <p class="text-xs font-medium leading-relaxed text-neutral-500 md:text-sm">
                                    Layanan berhasil diaktifkan
                                </p>
                            </div>
                            <!-- Mobile vertical line -->
                            <div class="absolute left-5 top-10 block h-[calc(100%+12px)] w-0.5 -translate-x-1/2 bg-success/20 md:hidden"></div>
                        </div>

                        <!-- Step 4 -->
                        <div class="relative flex items-start gap-4 md:w-1/4 md:flex-col md:items-center md:text-center">
                            <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-sm font-semibold text-white shadow-sm shadow-success/20">
                                4
                            </div>
                            <div class="min-w-0 md:min-h-[48px] flex items-center">
                                <p class="text-xs font-medium leading-relaxed text-neutral-500 md:text-sm">
                                    Poin otomatis masuk ke akun Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Ketentuan Section -->
            <section class="space-y-5">
                <h2 class="text-lg font-semibold text-neutral-800">Ketentuan</h2>
                <div class="bg-success/5 border border-success/10 rounded-xl p-4 md:p-6">
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start gap-1">
                            <span class="text-neutral-500">1.</span>
                            <p class="text-neutral-500">Poin diberikan untuk transaksi yang memenuhi syarat</p>
                        </li>
                        <li class="flex items-start gap-1">
                            <span class="text-neutral-500">2.</span>
                            <p class="text-neutral-500">Nilai poin dapat berubah menyesuaikan dengan layanan yang digunakan pelanggan.</p>
                        </li>
                        <li class="flex items-start gap-1">
                            <span class="text-neutral-500">3.</span>
                            <p class="text-neutral-500">Proses penambahan poin dapat memerlukan waktu sesuai dengan proses verifikasi sistem.</p>
                        </li>
                        <li class="flex items-start gap-1">
                            <span class="text-neutral-500">4.</span>
                            <p class="text-neutral-500">Poin yang telah terkumpul dapat ditukarkan dengan uang tunai atau reward yang tersedia.</p>
                        </li>
                        <li class="flex items-start gap-1">
                            <span class="text-neutral-500">5.</span>
                            <p class="text-neutral-500">Poin tidak dapat dipindahtangankan.</p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Coins, Banknote, UserPlus, CheckCircle, CreditCard } from 'lucide-vue-next';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Skema Poin',
})
</script>

