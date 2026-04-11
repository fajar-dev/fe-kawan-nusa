<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Newspaper class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Artikel Edukasi</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / 
                            <NuxtLink to="/education/article" class="text-primary hover:underline">Artikel Edukasi</NuxtLink> / 
                            Cara Menjawab Keberatan Harga dari Calon Pelanggan
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-8 pb-10 p-7">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Main Content -->
                <article class="lg:col-span-8 space-y-6">
                    <header class="space-y-4">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 bg-success/10 text-success text-xs rounded-md uppercase tracking-wider">
                                Baru
                            </span>
                            <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md uppercase tracking-wider">
                                Tips & Trick
                            </span>
                        </div>

                        <h1 class="text-2xl md:text-3xl font-semibold text-neutral-800 leading-tight">
                            Cara Menjawab Keberatan Harga dari Calon Pelanggan
                        </h1>

                        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
                            <div class="flex items-center gap-1.5">
                                <User class="w-3.5 h-3.5" />
                                <span>Ahmad Syaputra</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Calendar class="w-3.5 h-3.5" />
                                <span>02/10/2026</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Clock class="w-3.5 h-3.5" />
                                <span>3 Menit Baca</span>
                            </div>
                        </div>
                    </header>

                    <div class="aspect-video w-full overflow-hidden rounded-2xl border border-base-200">
                        <img 
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" 
                            alt="Article Main Image"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <div class="article-content space-y-6 text-neutral-800 text-sm">
                        <p>
                            Keberatan harga adalah hal yang sangat umum terjadi dalam proses penjualan. Tidak jarang calon pelanggan merasa ragu atau menilai harga yang ditawarkan terlalu tinggi sebelum benar-benar memahami nilai dari produk atau layanan tersebut. Jika tidak ditangani dengan tepat, momen ini bisa membuat peluang closing hilang begitu saja. Namun, dengan pendekatan yang tepat, keberatan harga justru bisa menjadi kesempatan untuk membangun kepercayaan dan meyakinkan pelanggan.
                        </p>
                        
                        <h2>1. Memahami Alasan di Balik Keberatan</h2>
                        <p>
                            Keberatan harga sering kali bukan semata-mata karena nominal yang terlalu tinggi, tetapi karena pelanggan belum sepenuhnya melihat nilai dari produk atau layanan yang ditawarkan. Dalam situasi ini, penting untuk tidak langsung defensif. Dengarkan dengan baik, pahami konteksnya, and cari tahu apakah keberatan tersebut muncul karena keterbatasan budget, perbandingan dengan kompetitor, atau kurangnya informasi yang mereka miliki.
                        </p>
                        
                        <h2>2. Fokus pada Nilai, Bukan Sekadar Harga</h2>
                        <p>
                            Alihkan pembicaraan dari "biaya" menuju "manfaat" atau "solusi". Tunjukkan bagaimana produk Anda dapat membantu mereka menghemat waktu, meningkatkan efisiensi, atau memecahkan masalah yang sedang mereka hadapi. Ketika nilai yang dirasakan lebih besar daripada harga yang dibayarkan, pelanggan akan lebih cenderung untuk melanjutkan pembelian.
                        </p>
                    </div>
                </article>

                <!-- Sidebar -->
                <aside class="lg:col-span-4 space-y-6">
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-neutral-800">Artikel Menarik Lainnya</h3>
                        
                        <div class="space-y-4">
                            <NuxtLink 
                                v-for="item in relatedArticles" 
                                :key="item.id"
                                :to="`/education/article/${item.id}`"
                                class="flex gap-4 p-3 rounded-xl border border-base-200 hover:border-primary/30 hover:bg-neutral-50 transition-all group"
                            >
                                <div class="w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                                    <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div class="flex flex-col justify-center gap-1.5">
                                    <h4 class="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">
                                        {{ item.title }}
                                    </h4>
                                    <p class="text-xs text-neutral-400">{{ item.date }}</p>
                                </div>
                            </NuxtLink>
                        </div>

                        <NuxtLink to="/education/article" class="flex items-center justify-end gap-1 text-xs font-medium text-primary hover:underline">
                            Lainnya <ChevronRight class="w-4 h-4" />
                        </NuxtLink>
                    </div>
                </aside>
            </div>
        </div>
    </div> 
</template>

<script setup lang="ts">
import { Newspaper, User, Calendar, Clock, ChevronRight } from 'lucide-vue-next';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Artikel Edukasi',
})

const relatedArticles = [
    {
        id: 1,
        title: 'Bagaimana Referral A Mendapatkan 10 Pelanggan dalam 1 Bulan',
        date: '12/03/2026',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Perubahan Pola Interaksi Pelanggan yang Perlu Dipahami Referral',
        date: '24/02/2026',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Tips Menghadapi Calon Pelanggan yang Masih Ragu untuk Membeli',
        date: '11/02/2026',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'Panduan Menentukan Waktu yang Tepat untuk Menawarkan Produk ke Pelanggan',
        date: '03/02/2026',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'
    }
]
</script>