<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-xl font-medium text-neutral-800">Tukar Poin</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            Tukarkan poin yang Anda miliki dengan berbagai reward menarik
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <!-- Points Summary Banner -->
        <div class="card bg-base-100 shadow-xs border border-base-200 w-full rounded-lg">
            <div class="card-body flex flex-col md:flex-row justify-between md:items-center p-6">
                <div>
                    <h1 class="text-neutral-500 font-medium flex gap-2 items-center">
                        <Coins class="w-4 h-4 text-neutral-500" />
                        Total Poin Aktif
                    </h1>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-neutral-800 font-semibold text-4xl">{{ userPoints.toLocaleString('id-ID') }}</span>
                    </div>
                </div>
                <NuxtLink to="/point/reedem/history" class="btn btn-primary font-medium rounded-lg mt-4 md:mt-0">
                    <History class="w-5 h-5" />
                    Riwayat Penukaran
                </NuxtLink>
            </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="flex flex-col md:flex-row items-center gap-4 mt-6 mb-6 w-full">
            <!-- Search Input -->
            <div class="relative w-full md:w-80 md:mr-auto">
                <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="Cari reward..." 
                    class="input input-bordered w-full pl-10 bg-white border-base-300 rounded-lg focus:outline-none focus:border-primary text-sm h-10"
                />
            </div>

            <!-- Category MultiSelect -->
            <div class="w-full md:w-64">
                <MultiSelect 
                    v-model="selectedCategoryIds" 
                    :options="categories" 
                    labelKey="name"
                    valueKey="id"
                    placeholder="Pilih Kategori" 
                    searchable
                />
            </div>

            <!-- Type Filter Dropdown -->
            <div class="w-full md:w-48">
                <select 
                    v-model="selectedType"
                    class="select select-bordered w-full text-sm h-10 rounded-lg border-base-300 focus:border-primary bg-white font-medium"
                >
                    <option value="">Semua Tipe</option>
                    <option value="product">Product</option>
                    <option value="voucher">Voucher</option>
                </select>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20 w-full">
            <Loader2 class="w-10 h-10 animate-spin text-primary" />
        </div>

        <!-- Empty State -->
        <div v-else-if="rewards.length === 0" class="flex flex-col justify-center items-center py-20 w-full bg-white border border-base-200 rounded-2xl">
            <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                <Search class="w-8 h-8" />
            </div>
            <h3 class="text-neutral-800 font-semibold text-base">Katalog Kosong</h3>
            <p class="text-neutral-400 text-xs mt-1">Tidak ditemukan catalog item yang cocok dengan pencarian Anda.</p>
        </div>

        <!-- Reward Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="reward in rewards"
                :key="reward.id"
                class="card bg-white border border-base-200 rounded-2xl overflow-hidden transition-all group shadow-sm hover:shadow-md"
            >
                <!-- Image Section -->
                <div class="relative h-52 overflow-hidden p-3 bg-neutral-50/50">
                    <img
                        v-if="reward.image"
                        :src="reward.image"
                        :alt="reward.name"
                        class="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <!-- fallback generator placeholder -->
                    <div v-else class="w-full h-full bg-gradient-to-br from-primary/10 to-purple-100/50 rounded-xl flex flex-col justify-center items-center p-4 text-center border border-primary/5">
                        <Coins class="w-12 h-12 text-primary/30 mb-2" />
                        <span class="text-xs uppercase font-bold tracking-widest text-primary/40">{{ reward.type }}</span>
                    </div>
                </div>

                <div class="card-body p-4 flex flex-col gap-3">
                    <!-- Badges -->
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="px-2.5 py-0.5 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/0">
                            {{ reward.category?.name || 'Kategori' }}
                        </span>
                        <span 
                            class="px-2.5 py-0.5 font-medium text-xs rounded-full border uppercase tracking-wider"
                            :class="reward.type === 'voucher' ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-blue-50 text-blue-600 border-blue-200/50'"
                        >
                            {{ reward.type }}
                        </span>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 space-y-1">
                        <h3 class="text-neutral-800 font-semibold text-sm line-clamp-2 min-h-[2.5rem]" :title="reward.name">
                            {{ reward.name }}
                        </h3>
                        <p class="text-neutral-400 text-xs line-clamp-2 min-h-[2rem]" :title="reward.description">
                            {{ reward.description || 'Tidak ada deskripsi' }}
                        </p>
                    </div>

                    <!-- Points, Expired, and S&K -->
                    <div class="flex flex-col gap-2 border-t border-neutral-100 pt-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <Coins class="w-4 h-4 text-purple-500 animate-pulse" />
                                <span class="font-bold text-purple-500 text-sm">{{ (reward.point || 0).toLocaleString('id-ID') }} Poin</span>
                            </div>
                            <button 
                                @click="showTermsModal = true"
                                class="text-blue-500 text-xs font-medium flex items-center gap-0.5 hover:underline"
                            >
                                S&K <CircleHelp class="w-3.5 h-3.5 ml-0.5" />
                            </button>
                        </div>
                        <div v-if="reward.expiredDate" class="text-xs text-red-500 font-medium">
                            Berakhir: {{ reward.expiredDate }}
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <button
                        :disabled="reward.point > userPoints"
                        @click="handleSelectReward(reward)"
                        class="btn w-full font-medium rounded-lg btn-sm h-10 mt-1"
                        :class="[
                            reward.point <= userPoints
                                ? 'btn-primary text-white hover:opacity-90'
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200/60 cursor-not-allowed shadow-none'
                        ]"
                    >
                        {{ reward.point <= userPoints ? 'Tukar Sekarang' : 'Poin Tidak Cukup' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination Footer -->
        <div v-if="!isLoading && rewards.length > 0" class="flex flex-col lg:flex-row items-center lg:justify-between lg:gap-0 gap-4 justify-center mt-8 text-sm border-t border-base-200 pt-6">
            <div class="text-neutral-500 font-medium">
                Menampilkan {{ totalFrom }} sampai {{ totalTo }} dari {{ totalEntries }} item
            </div>
            <div class="join overflow-x-auto max-w-full">
                <button 
                    class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 transition-colors"
                    :disabled="page === 1 || isLoading"
                    @click="handlePageChange(1)"
                >
                    <ChevronFirst class="w-4 h-4" />
                </button>
                
                <button 
                    class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 transition-colors"
                    :disabled="page === 1 || isLoading"
                    @click="handlePageChange(page - 1)"
                >
                    <ChevronLeft class="w-4 h-4" />
                </button>

                <template v-for="p in visiblePages" :key="p">
                    <button 
                        v-if="p === '...'"
                        class="btn btn-disabled border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400"
                    >
                        ...
                    </button>
                    <button 
                        v-else
                        :class="[
                            'btn border-none shadow-none btn-sm rounded-sm transition-all text-xs h-8 min-h-0 px-3',
                            page === p 
                                ? 'bg-primary border-0 text-primary-content hover:bg-primary/90' 
                                : 'bg-white text-neutral-600 hover:bg-base-200 border border-base-200'
                        ]"
                        @click="handlePageChange(p as number)"
                    >
                        {{ p }}
                    </button>
                </template>

                <button 
                    class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 transition-colors"
                    :disabled="page === lastPage || isLoading"
                    @click="handlePageChange(page + 1)"
                >
                    <ChevronRight class="w-4 h-4" />
                </button>

                <button 
                    class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 transition-colors"
                    :disabled="page === lastPage || isLoading"
                    @click="handlePageChange(lastPage)"
                >
                    <ChevronLast class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Terms Modal -->
        <ModalTerms v-model="showTermsModal" />

        <!-- Confirm Redeem Modal -->
        <ModalConfirmRedeem 
            v-model="showConfirmRedeemModal" 
            :rewardId="selectedReward?.id || null" 
            @confirm="onConfirmRedeem"
        />

        <!-- Product Redeem Modal -->
        <ModalRedeemProduct
            v-model="showRedeemProductModal"
            :catalogId="selectedReward?.id || null"
            @success="onSuccessRedeem"
        />

        <!-- Voucher Redeem Modal -->
        <ModalReedemVoucher
            v-model="showRedeemVoucherModal"
            :catalogId="selectedReward?.id || null"
            @success="onSuccessRedeem"
        />

        <!-- Success Redeem Modal -->
        <ModalRedemptionSuccess
            v-model="showSuccessModal"
            :redemption="redemptionData"
            :rewardName="selectedReward?.name || ''"
        />
    </div>
</template>

<script setup lang="ts">
import { CircleHelp, Coins, History, Loader2, Search, ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-vue-next'
import { catalogService } from '~/services/catalog-service'
import { pointService } from '~/services/point-service'
import type { CatalogItem, CatalogCategory, CatalogMeta } from '~/types/catalog'
import type { RedemptionData } from '~/types/redemption'

// Page Title for SEO
useSeoMeta({
    title: 'Kawan Nusa | Penukaran Poin',
})

// Initial point fetching
const { data: pointResponse, refresh: refreshPoint } = await useAsyncData('user-points', () => pointService.getPoint())
const { data: categoryResponse } = await useAsyncData('catalog-categories', () => catalogService.getCategories())

// Filters, Page and Search states
const searchQuery = ref('')
const selectedCategoryIds = ref<number[]>([])
const selectedType = ref('')
const rewards = ref<CatalogItem[]>([])
const page = ref(1)
const lastPage = ref(1)
const isLoading = ref(false)
const meta = ref<CatalogMeta | null>(null)

// Derived states
const userPoints = computed(() => pointResponse.value?.data?.value ?? 0)
const categories = computed(() => categoryResponse.value?.data ?? [])

// Pagination numbers helper
const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

const fetchCatalogs = async () => {
    isLoading.value = true
    try {
        const response = await catalogService.getCatalogs({
            page: page.value,
            limit: 8,
            categoryId: selectedCategoryIds.value.length > 0 ? selectedCategoryIds.value : undefined,
            type: selectedType.value || undefined,
            q: searchQuery.value || undefined
        })
        
        if (response.success && response.data) {
            rewards.value = response.data
            meta.value = response.meta
            lastPage.value = response.meta.lastPage
        } else {
            rewards.value = []
            meta.value = null
            lastPage.value = 1
        }
    } catch (error) {
        rewards.value = []
        meta.value = null
        lastPage.value = 1
    } finally {
        isLoading.value = false
    }
}

// Watchers
let searchTimeout: any = null
watch(searchQuery, () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        page.value = 1
        fetchCatalogs()
    }, 500)
})

watch(selectedCategoryIds, () => {
    page.value = 1
    fetchCatalogs()
}, { deep: true })

watch(selectedType, () => {
    page.value = 1
    fetchCatalogs()
})

const handlePageChange = (newPage: number) => {
    page.value = newPage
    fetchCatalogs()
}

// Pagination pages range helper
const visiblePages = computed(() => {
    const current = page.value
    const last = lastPage.value
    const pages: (number | string)[] = []

    if (last <= 5) {
        for (let i = 1; i <= last; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)
        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i)
        }
        if (current < last - 2) pages.push('...')
        if (!pages.includes(last)) pages.push(last)
    }
    return pages
})

onMounted(() => {
    fetchCatalogs()
})

// Modal states & redemption triggers
const showTermsModal = ref(false)
const showConfirmRedeemModal = ref(false)
const showRedeemProductModal = ref(false)
const showRedeemVoucherModal = ref(false)
const showSuccessModal = ref(false)
const selectedReward = ref<CatalogItem | null>(null)
const redemptionData = ref<RedemptionData | null>(null)

const handleSelectReward = (reward: CatalogItem) => {
  selectedReward.value = reward
  showConfirmRedeemModal.value = true
}

const onConfirmRedeem = () => {
    showConfirmRedeemModal.value = false
    
    if (selectedReward.value?.type === 'product') {
        showRedeemProductModal.value = true
    } else if (selectedReward.value?.type === 'voucher') {
        showRedeemVoucherModal.value = true
    } else {
        alert(`Penukaran ${selectedReward.value?.name || 'Reward'} Berhasil!`)
    }
}

const onSuccessRedeem = (data: RedemptionData) => {
    showRedeemProductModal.value = false
    showRedeemVoucherModal.value = false
    
    redemptionData.value = data
    showSuccessModal.value = true
    
    refreshPoint()
    fetchCatalogs() // refresh points list
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>