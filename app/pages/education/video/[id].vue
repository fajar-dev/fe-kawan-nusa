<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Newspaper class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Video Edukasi</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / 
                            <NuxtLink to="/education/video" class="text-primary hover:underline">Video Edukasi</NuxtLink> / 
                            {{ video?.title }}
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div v-if="video" class="space-y-8 pb-10 md:p-7">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Main Content -->
                <article class="lg:col-span-8 space-y-6">
                    <header class="space-y-4">
                        <div class="flex items-center gap-2">
                            <span v-if="isNew(video.createdAt)" class="px-2 py-0.5 bg-success/10 text-success text-xs rounded-md tracking-wider">
                                Baru
                            </span>
                            <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md tracking-wider">
                                {{ video.category?.name }}
                            </span>
                        </div>

                        <h1 class="text-2xl md:text-3xl font-semibold text-neutral-800 leading-tight">
                            {{ video.title }}
                        </h1>

                        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
                            <div class="flex items-center gap-1.5">
                                <User class="w-3.5 h-3.5" />
                                <span>{{ video.author }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Calendar class="w-3.5 h-3.5" />
                                <span>{{ formatDateShort(video.createdAt) }}</span>
                            </div>
                        </div>
                    </header>

                    <div class="aspect-video w-full overflow-hidden rounded-2xl border border-base-200 bg-black">
                        <!-- Simple video player for now, could be improved if URL is YouTube -->
                        <video 
                            v-if="video.url && !video.url.includes('youtube')"
                            controls 
                            class="w-full h-full object-contain"
                            :poster="video.thumbnail"
                        >
                            <source :src="video.url" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <iframe 
                            v-else-if="video.url && video.url.includes('youtube')"
                            :src="video.url.replace('watch?v=', 'embed/')" 
                            class="w-full h-full"
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                        ></iframe>
                        <div v-else class="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                            Video tidak tersedia
                        </div>
                    </div>

                    <div class="article-content space-y-6 text-neutral-800 text-sm">
                        <section class="space-y-3">
                            <h2 class="text-lg font-semibold text-neutral-800">Deskripsi</h2>
                            <p class="text-neutral-500" v-html="video.description">
                            </p>
                        </section>

                        <section class="space-y-3">
                            <h2 class="text-lg font-semibold text-neutral-800">Catatan Penting</h2>
                            
                            <div class="bg-primary/10 border border-primary/20 rounded-xl p-4">
                                <p class="text-neutral-500">
                                    Pastikan Anda menonton video ini sampai selesai untuk mendapatkan pemahaman yang komprehensif. Jangan ragu untuk memutar ulang bagian yang kurang jelas dan praktikkan langsung apa yang Anda pelajari.
                                </p>
                            </div>
                        </section>
                    </div>
                </article>

                <!-- Sidebar -->
                <aside class="lg:col-span-4 space-y-6">
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-neutral-800">Video Menarik Lainnya</h3>
                        
                        <div class="space-y-4">
                            <NuxtLink 
                                v-for="item in relatedVideos" 
                                :key="item.id"
                                :to="`/education/video/${item.id}`"
                                class="flex gap-4 p-3 rounded-xl border border-base-200 hover:border-primary/30 hover:bg-neutral-50 transition-all group"
                            >
                                <div class="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        :src="item.thumbnail"
                                        :alt="item.title"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div class="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                            <div class="w-7 h-7 rounded-full bg-transparent border border-primary border-2 flex items-center justify-center">
                                                <Play class="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-center gap-1.5">
                                    <h4 class="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">
                                        {{ item.title }}
                                    </h4>
                                    <p class="text-xs text-neutral-400 font-medium">{{ formatDateShort(item.createdAt) }}</p>
                                </div>
                            </NuxtLink>
                        </div>

                        <NuxtLink to="/education/video" class="flex items-center justify-end gap-1 text-xs font-medium text-primary hover:underline">
                            Lainnya <ChevronRight class="w-4 h-4" />
                        </NuxtLink>
                    </div>
                </aside>
            </div>
        </div>
    </div> 
</template>
<script setup lang="ts">
import { Newspaper, User, Calendar, ChevronRight, Play } from 'lucide-vue-next';
import { educationService } from '~/services/education-service';
import { formatDateShort, isNew } from '~/utils/date';

definePageMeta({
  bgColor: 'bg-white'
})

const route = useRoute()
const videoId = Number(route.params.id)

// Fetch Video Detail
const { data: videoResponse } = await useAsyncData(
    `video-detail-${videoId}`,
    () => educationService.getVideoById(videoId)
)

const video = computed(() => videoResponse.value?.data)

// Fetch Related Videos
const { data: relatedResponse } = await useAsyncData(
    `related-videos-${videoId}`,
    () => educationService.getVideos({ limit: 5 })
)

const relatedVideos = computed(() => {
    return (relatedResponse.value?.data || []).filter(item => item.id !== videoId)
})

useSeoMeta({
  title: `Kawan Nusa | ${video.value?.title || 'Video Edukasi'}`,
})
</script>