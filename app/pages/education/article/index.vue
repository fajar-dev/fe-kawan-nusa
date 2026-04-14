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
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Artikel Edukasi
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-8 pb-10">
            <!-- Filter & Search Bar -->
            <div class="flex flex-row gap-4 justify-between items-center relative">
                <div class="flex items-center gap-2">
                    <DataFilter 
                        :is-filter-active="hasActiveFilters"
                        @apply="applyFilters"
                        @reset="resetFilters"
                        @cancel="cancelFilters"
                    >
                        <!-- Kategori Artikel -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-neutral-400 text-xs font-medium">Kategori Artikel</span>
                                <span @click="selectedCategories = []" class="text-xs font-medium text-primary cursor-pointer hover:underline">Hapus Terpilih</span>
                            </div>
                            <MultiSelect 
                                v-model="selectedCategories" 
                                :options="categoryOptions" 
                                labelKey="name"
                                valueKey="id"
                                placeholder="Semua Kategori" 
                                searchable
                            />
                        </div>

                        <!-- Status Baca -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-neutral-400 text-xs font-medium">Status Baca</span>
                                <span @click="readingStatus = ''" class="text-xs font-medium text-primary cursor-pointer hover:underline">Hapus Terpilih</span>
                            </div>
                            <select v-model="readingStatus" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                                <option value="">Semua Status</option>
                                <option value="read">Sudah dibaca</option>
                                <option value="unread">Belum dibaca</option>
                            </select>
                        </div>
                    </DataFilter>
                </div>
                <div class="relative w-full md:w-80">
                    <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        placeholder="Search" 
                        class="input input-bordered w-full pl-10 bg-white border-base-300 rounded-lg focus:outline-none focus:border-primary text-sm h-10"
                    />
                </div>
            </div>

            <!-- Article Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="article in articles" :key="article.id" class="card h-full bg-white border border-base-300 rounded-xl overflow-hidden transition-all group">
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
                                <User class="w-4 h-4 text-neutral-400" />
                                <span class="text-xs text-neutral-400 font-medium">{{ article.author }}</span>
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

            <!-- Sentinel for Infinite Scroll -->
            <div ref="sentinel" class="flex justify-center p-8 w-full col-span-full">
                <Loader2 v-if="isLoading" class="w-8 h-8 animate-spin text-primary" />
                <div v-else-if="page > lastPage && articles.length > 0"></div>
            </div>

            <!-- Empty State -->
            <div v-if="articles.length === 0 && !isLoading" class="flex flex-col items-center justify-center">
                <img src="/assets/no-data.png" alt="No Data" class="w-52 h-auto mb-6" />
                <h3 class="text-xl font-bold text-neutral-800 mb-2">Data Kosong</h3>
                <p class="text-neutral-500">Saat ini belum ada data yang bisa ditampilkan.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Newspaper, Search, Clock, User, Calendar, Loader2 } from 'lucide-vue-next';
import { educationService } from '~/services/education-service';
import { formatDateShort, isNew } from '~/utils/date';
import { stripHtml } from '~/utils/string';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Artikel Edukasi',
})

const searchQuery = ref('')
const selectedCategories = ref<number[]>([])
const readingStatus = ref('')
const page = ref(1)
const lastPage = ref(1)
const isLoading = ref(false)
const sentinel = ref<HTMLElement | null>(null)
const articles = ref<any[]>([])

const appliedFilters = ref({
    categories: [] as number[],
    readingStatus: ''
})

const { data: categoryResponse } = useAsyncData(
    'education-categories',
    () => educationService.getCategories()
)

const categoryOptions = computed(() => categoryResponse.value?.data || [])

const fetchArticles = async (isReset = false) => {
    if (isLoading.value) return
    if (!isReset && page.value > lastPage.value) return

    isLoading.value = true
    try {
        const response = await educationService.getArticles({
            limit: 10,
            page: page.value,
            q: searchQuery.value || undefined,
            categoryId: appliedFilters.value.categories.length === 1 ? appliedFilters.value.categories[0] : undefined,
            isView: appliedFilters.value.readingStatus === 'read' ? 'true' : appliedFilters.value.readingStatus === 'unread' ? 'false' : undefined
        })
        
        if (response.success && response.data) {
            if (isReset) {
                articles.value = response.data
            } else {
                const newItems = response.data.filter(newItem => 
                    !articles.value.some(existingItem => existingItem.id === newItem.id)
                )
                articles.value = [...articles.value, ...newItems]
            }
            lastPage.value = response.meta.lastPage
            page.value++
        }
    } finally {
        isLoading.value = false
    }
}

const hasActiveFilters = computed(() => {
    return appliedFilters.value.categories.length > 0 || appliedFilters.value.readingStatus !== ''
})

const applyFilters = () => {
    appliedFilters.value = {
        categories: [...selectedCategories.value],
        readingStatus: readingStatus.value
    }
    page.value = 1
    lastPage.value = 1
    fetchArticles(true)
}

const resetFilters = () => {
    selectedCategories.value = []
    readingStatus.value = ''
    applyFilters()
}

const cancelFilters = () => {
    selectedCategories.value = [...appliedFilters.value.categories]
    readingStatus.value = appliedFilters.value.readingStatus
}

watch(searchQuery, () => {
    applyFilters()
})

let observer: IntersectionObserver | null = null

const initObserver = () => {
    if (observer) observer.disconnect()
    
    observer = new IntersectionObserver((entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoading.value && page.value <= lastPage.value) {
            fetchArticles()
        }
    }, { 
        rootMargin: '200px',
        threshold: 0.1 
    })

    if (sentinel.value) observer.observe(sentinel.value)
}

onMounted(() => {
    fetchArticles(true)
    initObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})
</script>



