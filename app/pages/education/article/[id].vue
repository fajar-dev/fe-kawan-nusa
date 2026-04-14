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
                            {{ article?.title }}
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div v-if="article" class="space-y-8 pb-10 md:p-7">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Main Content -->
                <article class="lg:col-span-8 space-y-6">
                    <header class="space-y-4">
                        <div class="flex items-center gap-2">
                            <span v-if="isNew(article.createdAt)" class="px-2 py-0.5 bg-success/10 text-success text-xs rounded-md tracking-wider">
                                Baru
                            </span>
                            <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md tracking-wider">
                                {{ article.category?.name }}
                            </span>
                        </div>

                        <h1 class="text-2xl md:text-3xl font-semibold text-neutral-800 leading-tight">
                            {{ article.title }}
                        </h1>

                        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
                            <div class="flex items-center gap-1.5">
                                <User class="w-3.5 h-3.5" />
                                <span>{{ article.author }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Calendar class="w-3.5 h-3.5" />
                                <span>{{ formatDateShort(article.createdAt) }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Clock class="w-3.5 h-3.5" />
                                <span>{{ article.readingTime }}</span>
                            </div>
                        </div>
                    </header>

                    <div class="aspect-video w-full overflow-hidden rounded-2xl border border-base-200">
                        <img 
                            :src="article.image" 
                            :alt="article.title"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <div class="article-content space-y-6 text-neutral-800 text-sm" v-html="article.content">
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
                                    <p class="text-xs text-neutral-400 font-medium">{{ formatDateShort(item.createdAt) }}</p>
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
import { educationService } from '~/services/education-service';
import { formatDateShort, isNew } from '~/utils/date';

definePageMeta({
  bgColor: 'bg-white'
})

const route = useRoute()
const articleId = Number(route.params.id)

// Fetch Article Detail
const { data: articleResponse } = await useAsyncData(
    `article-detail-${articleId}`,
    () => educationService.getArticleById(articleId)
)

const article = computed(() => articleResponse.value?.data)

// Fetch Related Articles
const { data: relatedResponse } = await useAsyncData(
    `related-articles-${articleId}`,
    () => educationService.getArticles({ limit: 5 })
)

const relatedArticles = computed(() => {
    return (relatedResponse.value?.data || []).filter(item => item.id !== articleId)
})

useSeoMeta({
  title: `Kawan Nusa | ${article.value?.title || 'Artikel Edukasi'}`,
})
</script>