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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <!-- Dapatkan Customer Baru Section -->
            <div class="card bg-white border border-primary/25 rounded-lg p-6 md:p-8">
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Link2 class="w-5 h-5" />
                    </div>
                    <div>
                        <h2 class="text-base sm:text-lg font-semibold text-neutral-800">Dapatkan customer baru</h2>
                        <p class="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                            Bagikan link pendaftaran Anda. Customer yang mendaftar lewat link ini akan divalidasi dan diverifikasi tim Sales Nusanet terlebih dahulu, baru kemudian tercatat sebagai referensi atas nama Anda — tanpa perlu menitip nama ke Sales.
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    <!-- Left: Step-by-step list -->
                    <div class="lg:col-span-8 space-y-4">
                        <!-- Step 1 -->
                        <div class="flex items-start gap-3.5 pb-4 border-b border-base-200">
                            <div class="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                1
                            </div>
                            <div class="space-y-0.5">
                                <h4 class="text-sm font-semibold text-neutral-800">Salin link Anda</h4>
                                <p class="text-xs text-neutral-500 leading-relaxed">
                                    Link ini permanen dan hanya milik Anda. Tidak perlu dibuat ulang setiap kali menawarkan.
                                </p>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="flex items-start gap-3.5 pb-4 border-b border-base-200">
                            <div class="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                2
                            </div>
                            <div class="space-y-0.5">
                                <h4 class="text-sm font-semibold text-neutral-800">Kirim ke calon customer</h4>
                                <p class="text-xs text-neutral-500 leading-relaxed">
                                    Lewat WhatsApp, Instagram, atau QR. Customer memilih sendiri layanan yang ia mau di dalam form.
                                </p>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="flex items-start gap-3.5 pb-4 border-b border-base-200">
                            <div class="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                3
                            </div>
                            <div class="space-y-0.5">
                                <h4 class="text-sm font-semibold text-neutral-800">Divalidasi tim Sales</h4>
                                <p class="text-xs text-neutral-500 leading-relaxed">
                                    Setelah customer submit form, tim Sales Nusanet akan memvalidasi dan memverifikasi datanya terlebih dahulu.
                                </p>
                            </div>
                        </div>

                        <!-- Step 4 -->
                        <div class="flex items-start gap-3.5">
                            <div class="w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                4
                            </div>
                            <div class="space-y-0.5">
                                <h4 class="text-sm font-semibold text-neutral-800">Poin masuk otomatis</h4>
                                <p class="text-xs text-neutral-500 leading-relaxed">
                                    Setelah lolos verifikasi dan layanannya aktif, customer resmi tercatat sebagai referensi Anda dan poin terbit otomatis — Anda tinggal memantau.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Referral Card -->
                    <div class="lg:col-span-4 bg-accent/60 border border-primary/20 rounded-lg p-5 space-y-4">
                        <span class="text-[10px] font-semibold text-neutral-800 tracking-wider uppercase">LINK PENDAFTARAN ANDA</span>

                        <!-- Input + Copy Button -->
                        <div class="flex items-center gap-2">
                            <input
                                :value="referralLink"
                                type="text"
                                readonly
                                class="input input-bordered h-10 w-full text-xs font-mono font-medium text-neutral-800 bg-white rounded-lg border-neutral-300 focus:outline-none select-all"
                            />
                            <button
                                type="button"
                                @click="copyReferralLink"
                                class="btn btn-primary btn-sm h-10 px-4 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shrink-0"
                            >
                                <Check v-if="isCopied" class="w-4 h-4" />
                                <Copy v-else class="w-4 h-4" />
                                <span>{{ isCopied ? 'Tersalin' : 'Salin' }}</span>
                            </button>
                        </div>

                        <!-- Share WhatsApp Button -->
                        <button
                            type="button"
                            @click="shareToWhatsApp"
                            class="btn btn-outline border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100/60 w-full h-10 rounded-lg text-xs font-medium text-neutral-800 flex items-center justify-center gap-2 bg-white shadow-2xs"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                            </svg>
                            <span>Bagikan lewat WhatsApp</span>
                        </button>

                        <!-- Preview Toggle -->
                        <div>
                            <button
                                type="button"
                                @click="showWaPreview = !showWaPreview"
                                class="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                            >
                                <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': showWaPreview }" />
                                <span>Lihat pesan yang akan dikirim</span>
                            </button>
                            <div v-if="showWaPreview" class="mt-2.5 p-3 rounded-lg bg-white border border-base-200 text-xs text-neutral-600 leading-relaxed font-sans shadow-2xs">
                                {{ waMessageText }}
                            </div>
                        </div>

                        <!-- Attribution Note -->
                        <p class="text-xs text-neutral-800 leading-relaxed">
                            Atribusi berlaku 30 hari sejak customer membuka link Anda.
                        </p>

                        <!-- Bottom Actions -->
                        <div class="flex items-center justify-between pt-3 border-t border-primary/15 text-xs">
                            <NuxtLink
                                to="/prospect"
                                class="font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <span>Lihat prospek saya</span>
                                <ArrowRight class="w-3.5 h-3.5" />
                            </NuxtLink>
                            <button
                                type="button"
                                @click="downloadQrCode"
                                class="font-medium text-neutral-600 hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <QrCode class="w-3.5 h-3.5" />
                                <span>Unduh QR</span>
                            </button>
                        </div>
                    </div>
                </div>
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
                        <ChevronRight class="w-4.5 h-4.5" />
                    </NuxtLink>
                </div>

                <EmptyState v-if="articlesResponse?.data.length === 0" />

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    <div v-for="article in articlesResponse?.data" :key="article.id" class="card h-full bg-white border border-base-300 rounded-xl overflow-hidden transition-all group">
                        <div class="relative h-52 overflow-hidden p-3">
                            <img
                                :src="article.image"
                                :alt="article.title"
                                class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                            />
                        </div>
                        <div class="card-body p-5 flex flex-col gap-4">
                            <div class="flex items-center justify-between gap-3 min-w-0">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span v-if="isNew(article.createdAt)" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full shrink-0">
                                        Baru
                                    </span>
                                    <span v-if="article.isView" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full shrink-0">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full truncate">
                                        {{ article.category?.name }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1 text-xs text-neutral-400 font-medium shrink-0">
                                    <Clock class="w-4.5 h-4.5" /> {{ article.readingTime }}
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
                                    <User class="w-4 h-4 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ article.author?.name }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-4 h-4 text-neutral-400" />
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
                        <ChevronRight class="w-4.5 h-4.5" />
                    </NuxtLink>
                </div>

                <EmptyState v-if="videosResponse?.data.length === 0" />

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <div class="flex items-center justify-between gap-2 min-w-0">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span v-if="isNew(video.createdAt)" class="px-2 py-0.5 bg-success/10 text-success font-medium text-xs rounded-full shrink-0">
                                        Baru
                                    </span>
                                    <span v-if="video.isView" class="px-2 py-0.5 bg-purple-100 text-purple-600 font-medium text-xs rounded-full shrink-0">
                                        Sudah Dilihat
                                    </span>
                                    <span class="px-2 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full truncate">
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
                                    <User class="w-4 h-4 text-neutral-400" />
                                    <span class="text-xs text-neutral-400 font-medium">{{ video.author?.name }}</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="w-4 h-4 text-neutral-400" />
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
import {
  Package,
  Coins,
  Lightbulb,
  BadgePercent,
  ArrowUpRight,
  BookOpenText,
  ChevronRight,
  Clock,
  User,
  Calendar,
  Video,
  Play,
  Link2,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  QrCode
} from 'lucide-vue-next'
import { educationService } from '~/services/education-service'
import { formatDateShort, isNew } from '~/utils/date'
import { stripHtml } from '~/utils/string'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pusat Edukasi Referral',
})

const referralCode = ref('UTK7K2')
const referralLink = computed(() => `daftar.kawannusa.id/r/${referralCode.value}`)
const fullReferralUrl = computed(() => `https://${referralLink.value}`)

const isCopied = ref(false)
const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(fullReferralUrl.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

const showWaPreview = ref(false)
const waMessageText = computed(() => 
  `Halo! Mau pasang internet cepat dan stabil untuk kebutuhan rumah atau kantor? Yuk daftar langsung melalui link rekomendasi saya di sini: ${fullReferralUrl.value}`
)

const shareToWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(waMessageText.value)}`
  window.open(url, '_blank')
}

const downloadQrCode = async () => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullReferralUrl.value)}`
    const response = await fetch(qrUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-referral-${referralCode.value}.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullReferralUrl.value)}`, '_blank')
  }
}

const { data: articlesResponse } = useAsyncData(
    'education-articles',
    () => educationService.getArticles({ limit: 3 })
)

const { data: videosResponse } = useAsyncData(
    'education-videos',
    () => educationService.getVideos({ limit: 3 })
)
</script>





