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
                        to="/education/article"
                        class="inline-flex items-center gap-1 self-start text-sm font-semibold text-primary hover:underline md:self-auto md:shrink-0"
                    >
                        <span>Lihat Semua</span>
                        <ChevronRight class="w-4 h-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-12 md:px-6">
                    <div v-for="article in articlesResponse?.data" :key="article.id" class="card h-full bg-white border border-base-300 rounded-xl overflow-hidden transition-all group">
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
                                    <span v-if="isNew(article.createdAt)" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full">
                                        Baru
                                    </span>
                                    <span v-if="article.isView" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full">
                                        {{ article.category?.name }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                                    <Clock class="w-3 h-3" /> {{ article.readingTime }}
                                </div>
                            </div>

                            <div class="space-y-2 flex-grow">
                                <h3 class="text-neutral-800 font-medium text-sm line-clamp-2 leading-snug">
                                    {{ article.title }}
                                </h3>
                                <p class="text-neutral-500 text-xs line-clamp-2">
                                    {{ stripHtml(article.content) }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2 border-y border-base-100">
                                <div class="flex items-center gap-1.5">
                                    <User class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ article.author }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ formatDateShort(article.createdAt) }}</span>
                                </div>
                            </div>

                            <NuxtLink :to="`/education/article/${article.id}`" class="btn btn-primary btn-sm w-full font-medium text-xs rounded-lg text-white">
                                Lihat Artikel
                            </NuxtLink>
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
                        to="/education/video"
                        class="inline-flex items-center gap-1 self-start text-sm font-semibold text-primary hover:underline md:self-auto md:shrink-0"
                    >
                        <span>Lihat Semua</span>
                        <ChevronRight class="w-4 h-4" />
                    </NuxtLink>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-12 md:px-6">
                    <div v-for="video in videosResponse?.data" :key="video.id" class="card h-full bg-white border border-base-300 rounded-2xl overflow-hidden transition-all group">
                        <div class="relative h-52 overflow-hidden p-3">
                            <img
                                :src="video.thumbnail"
                                :alt="video.title"
                                class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                            />
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-12 h-12 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                    <div class="w-8 h-8 rounded-full bg-transparent border border-primary border-2 flex items-center justify-center">
                                        <Play class="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-5 flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span v-if="isNew(video.createdAt)" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full">
                                        Baru
                                    </span>
                                    <span v-if="video.isView" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full">
                                        {{ video.category?.name }}
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-2 flex-grow">
                                <h3 class="text-neutral-800 font-medium text-sm line-clamp-2 leading-snug">
                                    {{ video.title }}
                                </h3>
                                <p class="text-neutral-500 text-xs line-clamp-2">
                                    {{ stripHtml(video.description) }}
                                </p>
                            </div>

                            <div class="flex items-center justify-between py-2 border-y border-base-100">
                                <div class="flex items-center gap-1.5">
                                    <User class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ video.author }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-3 h-3 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ formatDateShort(video.createdAt) }}</span>
                                </div>
                            </div>

                            <NuxtLink :to="`/education/video/${video.id}`" class="btn btn-primary btn-sm w-full font-medium text-xs rounded-lg text-white">
                                Lihat Video
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Package, Coins, Lightbulb, BadgePercent, ArrowUpRight, BookOpenText, ChevronRight, Clock, User, Calendar, Video, Play } from 'lucide-vue-next'
import { educationService } from '~/services/education-service'
import { formatDateShort, isNew } from '~/utils/date'
import { stripHtml } from '~/utils/string'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pusat Edukasi Referral',
})

const { data: articlesResponse } = useAsyncData(
    'education-articles',
    () => educationService.getArticles({ limit: 3 })
)

const { data: videosResponse } = useAsyncData(
    'education-videos',
    () => educationService.getVideos({ limit: 3 })
)
</script>





