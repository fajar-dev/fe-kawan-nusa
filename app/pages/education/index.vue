<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                <div>
                    <div class="flex items-center gap-2">
                    <h1 class="text-xl font-medium text-neutral-800">Pusat Edukasi Referral</h1>
                    </div>
                    <p class="text-xs text-neutral-400 font-medium mt-0.5">
                        Pelajari produk dan strategi referral untuk meningkatkan komisi Anda.
                    </p>
                </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-8 pb-10">
            <!-- Top Action Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-12 md:px-6">
                <!-- Katalog Produk -->
                <NuxtLink to="/education/service" class="card bg-white border border-base-300 transition-all cursor-pointer group hover:bg-neutral-50">
                    <div class="card-body p-6 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                            <Package class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 text-sm">Katalog Produk dan Layanan</h3>
                        <p class="text-xs text-neutral-400 mb-2">Kenali produk sebelum Anda menawarkan</p>
                        <div class="mt-auto w-full flex justify-end items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            Lihat <ArrowUpRight class="w-3.5 h-3.5" />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Skema Poin -->
                <NuxtLink to="/education/scheme" class="card bg-white border border-base-300 transition-all cursor-pointer group hover:bg-neutral-50">
                    <div class="card-body p-6 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                            <Coins class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 text-sm">Skema Poin</h3>
                        <p class="text-xs text-neutral-400 mb-2">Pahami cara kerja poin dan perhitungannya</p>
                        <div class="mt-auto w-full flex justify-end items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            Pelajari <ArrowUpRight class="w-3.5 h-3.5" />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Strategi Penawaran -->
                <NuxtLink to="/education/strategy" class="card bg-white border border-base-300 transition-all cursor-pointer group hover:bg-neutral-50">
                    <div class="card-body p-6 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                            <Lightbulb class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 text-sm">Strategi Penawaran</h3>
                        <p class="text-xs text-neutral-400 mb-2">Pelajari cara menawarkan secara efektif</p>
                        <div class="mt-auto w-full flex justify-end items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            Pelajari <ArrowUpRight class="w-3.5 h-3.5" />
                        </div>
                    </div>
                </NuxtLink>

                <!-- Update Promo -->
                <NuxtLink to="/education/promotion" class="card bg-white border border-base-300 transition-all cursor-pointer group hover:bg-neutral-50">
                    <div class="card-body p-6 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                            <BadgePercent class="w-6 h-6" />
                        </div>
                        <h3 class="font-medium text-neutral-800 text-sm">Update Promo</h3>
                        <p class="text-xs text-neutral-400 mb-2">Cek promo terbaru dan periode berlaku</p>
                        <div class="mt-auto w-full flex justify-end items-center gap-1.5 text-xs font-semibold text-neutral-800">
                            Lihat <ArrowUpRight class="w-3.5 h-3.5" />
                        </div>
                    </div>
                </NuxtLink>
            </div>
            <!-- Artikel Edukasi Section -->
            <section class="space-y-8">
                <div class="flex flex-col gap-3 md:flex-row justify-between items-center pt-10">
                    <div class="flex items-start gap-3 min-w-0">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <BookOpenText class="w-5 h-5 text-neutral-600" />
                        </div>

                        <div class="min-w-0">
                        <h2 class="text-lg font-semibold text-neutral-800">
                            Artikel Edukasi
                        </h2>
                        <p class="text-sm text-neutral-600">
                            Beragam pengetahuan, panduan, dan insight yang disajikan dalam artikel.
                        </p>
                        </div>
                    </div>

                    <NuxtLink
                        to="/education/articles"
                        class="inline-flex items-center gap-1 self-start text-sm font-semibold text-primary hover:underline md:self-auto md:shrink-0"
                    >
                        <span>Lihat Semua</span>
                        <ChevronRight class="w-4 h-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-12 md:px-6">
                    <div v-for="article in articles" :key="article.id" class="card h-full bg-white border border-base-300 rounded-xl overflow-hidden transition-all group">
                        <div class="relative h-52 overflow-hidden p-3">
                            <img
                                :src="article.image"
                                :alt="article.title"
                                class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                            />
                        </div>
                        <div class="card-body p-5 flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span v-if="article.isNew" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full">
                                        Baru
                                    </span>
                                    <span v-if="article.isViewed" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full">
                                        {{ article.category.name }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                                    <Clock class="w-3 h-3" /> {{ article.readTime }}
                                </div>
                            </div>

                            <div class="space-y-2 flex-grow">
                                <h3 class="text-neutral-800 font-medium text-sm line-clamp-2 leading-snug">
                                    {{ article.title }}
                                </h3>
                                <p class="text-neutral-500 text-xs line-clamp-2">
                                    {{ article.description }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2 border-y border-base-100">
                                <div class="flex items-center gap-1.5">
                                    <User class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ article.author }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ article.date }}</span>
                                </div>
                            </div>

                            <button class="btn btn-primary btn-sm w-full font-medium text-xs rounded-lg text-white">
                                Lihat Artikel
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Video Edukasi Section -->
            <section class="space-y-8">
                <div class="flex flex-col gap-3 md:flex-row justify-between items-center pt-10">
                    <div class="flex items-start gap-3 min-w-0">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <Video class="w-5 h-5 text-neutral-600" />
                        </div>

                        <div class="min-w-0">
                        <h2 class="text-lg font-semibold text-neutral-800">
                            Video Edukasi
                        </h2>
                        <p class="text-sm text-neutral-600">
                            Tutorial visual yang mudah dipahami
                        </p>
                        </div>
                    </div>

                    <NuxtLink
                        to="/education/videos"
                        class="inline-flex items-center gap-1 self-start text-sm font-semibold text-primary hover:underline md:self-auto md:shrink-0"
                    >
                        <span>Lihat Semua</span>
                        <ChevronRight class="w-4 h-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-12 md:px-6">
                    <div v-for="video in videos" :key="video.id" class="card h-full bg-white border border-base-300 rounded-2xl overflow-hidden transition-all group">
                        <div class="relative h-52 overflow-hidden p-3">
                            <img
                                :src="video.thumbnail"
                                :alt="video.title"
                                class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                            />
                            <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0  transition-opacity">
                                <div class="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50">
                                    <Play class="w-6 h-6 text-white fill-white" />
                                </div>
                            </div>
                            <!-- Static play icon in middle as per screenshot -->
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                                    <Play class="w-5 h-5 text-white fill-white" />
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-5 flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span v-if="video.isNew" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full">
                                        Baru
                                    </span>
                                    <span v-if="video.isViewed" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full">
                                        {{ video.category.name }}
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-2 flex-grow">
                                <h3 class="text-neutral-800 font-medium text-sm line-clamp-2 leading-snug">
                                    {{ video.title }}
                                </h3>
                                <p class="text-neutral-500 text-xs line-clamp-2">
                                    {{ video.description }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2 border-y border-base-100">
                                <div class="flex items-center gap-1.5">
                                    <User class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ video.author }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ video.date }}</span>
                                </div>
                            </div>

                            <button class="btn btn-primary btn-sm w-full font-medium text-xs rounded-lg text-white">
                                Lihat Video
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Package, Coins, Lightbulb, BadgePercent, ArrowUpRight, BookOpenText, ChevronRight, Clock, User, Calendar, Video, Play } from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pusat Edukasi Referral',
})

const articles = [
    {
        id: 1,
        title: 'Cara Menjawab Keberatan Harga dari Calon Pelanggan',
        description: 'Harga jadi alasan ragu? Pelajari cara menjawabnya agar calon pelanggan justru semakin yakin.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 1, name: 'Tips & Trick' },
        isNew: true,
        isViewed: false,
        readTime: '5 menit baca',
        author: 'Ahmad Syaputra',
        date: '02/10/2026'
    },
    {
        id: 2,
        title: 'Bagaimana Referral A Mendapatkan 10 Pelanggan dalam 1 Bulan',
        description: 'Dari nol hingga 10 pelanggan dalam 1 bulan, ini strategi Referral A',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 1, name: 'Tips & Trick' },
        isNew: false,
        isViewed: false,
        readTime: '5 menit baca',
        author: 'Ahmad Syaputra',
        date: '12/03/2026'
    },
    {
        id: 3,
        title: 'Perubahan Pola Interaksi Pelanggan yang Perlu Dipahami Referral',
        description: 'Pola interaksi pelanggan berubah!, pahami untuk meningkatkan peluang closing',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 2, name: 'Berita' },
        isNew: false,
        isViewed: true,
        readTime: '4 menit baca',
        author: 'Bima Ramadhani',
        date: '24/02/2026'
    }
]

const videos = [
    {
        id: 1,
        title: 'Cara Meyakinkan Pelanggan yang Masih Ragu untuk Membeli',
        description: 'Pelanggan masih ragu? Ubah jadi yakin dengan cara yang tepat.',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 1, name: 'Tips & Trick' },
        isNew: true,
        isViewed: false,
        author: 'Dimas Syaputra',
        date: '20/01/2026'
    },
    {
        id: 2,
        title: 'Strategi Menentukan Waktu yang Tepat untuk Menawarkan Produk',
        description: 'Tawarkan di waktu yang tepat untuk hasil lebih maksimal.',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 1, name: 'Tips & Trick' },
        isNew: false,
        isViewed: false,
        author: 'Ahmad Syaputra',
        date: '15/01/2026'
    },
    {
        id: 3,
        title: 'Cara Menjawab Keberatan Harga dari Calon Pelanggan',
        description: 'Follow up tanpa mengganggu, tetap efektif dan bikin pelanggan nyaman.',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
        category: { id: 1, name: 'Tips & Trick' },
        isNew: false,
        isViewed: true,
        author: 'Bima Ramadhani',
        date: '08/01/2026'
    }
]
</script>

