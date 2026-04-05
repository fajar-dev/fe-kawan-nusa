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
        <div class="card bg-base-100 shadow-xs border border-base-200 w-full rounded-lg">
            <div class="card-body flex flex-col md:flex-row justify-between md:items-center">
                <div>
                    <h1 class="text-neutral-500 font-medium flex gap-2">
                        <Coins class="w-4 h-4 text-neutral-500" />
                        Total Point Aktif
                    </h1>
                    <div class="flex items-center gap-2">
                        <span class="text-neutral-800 font-semibold text-4xl">{{ userPoints.toLocaleString('id-ID') }}</span>
                    </div>
                </div>
                <NuxtLink to="/point/reedem/history" class="btn btn-primary font-medium rounded-lg">
                    <History class="w-5 h-5" />
                    Riwayat Penukaran
                </NuxtLink>
            </div>
        </div>

        <!-- Categories Tabs -->
        <div class="my-6 flex md:justify-end justify-center">
            <div class="flex items-center gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden no-scrollbar border-b border-base-300 w-fit max-w-full px-4 lg:px-0">
                <button 
                v-for="cat in categories" 
                :key="cat.id"
                @click="activeCategory = cat"
                class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0 font-medium"
                :class="[ activeCategory.id === cat.id ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800' ]"
                >
                {{ cat.name }}
                <div v-if="activeCategory.id === cat.id" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
                </button>
            </div>
        </div>

        <!-- Reward Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="(reward, index) in rewards"
                :key="reward.id"
                class="card bg-white border border-base-200 rounded-2xl overflow-hidden transition-all group"
            >
                <!-- Image Section -->
                <div class="relative h-52 overflow-hidden p-3">
                <img
                    :src="reward.image"
                    :alt="reward.name"
                    class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                />
                </div>

                <div class="card-body p-4 flex flex-col gap-3">
                <!-- Badges -->
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/0">
                    Berakhir {{ reward.expiredDate }}
                    </span>
                    <span class="px-3 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/0">
                    {{ reward.category.name }}
                    </span>
                </div>

                <!-- Content -->
                <div class="flex-1 space-y-1">
                    <h3 class="text-neutral-800 font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                    {{ reward.name }}
                    </h3>
                    <p class="text-neutral-400 text-xs line-clamp-2 min-h-[2rem]">
                    {{ reward.description }}
                    </p>
                </div>

                <!-- Points and S&K -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <Coins class="w-4 h-4 text-purple-500" />
                    <span class="font-medium text-purple-500 text-sm">{{ (reward.point || 0).toLocaleString('id-ID') }} Poin</span>
                    </div>
                    <button 
                        @click="showTermsModal = true"
                        class="text-blue-500 text-xs font-medium flex items-center gap-0.5 hover:underline"
                    >
                    S&K <CircleHelp class="w-3.5 h-3.5 ml-0.5" />
                    </button>
                </div>

                <!-- CTA Button -->
                <button
                    :disabled="reward.point > userPoints"
                    @click="handleSelectReward(reward)"
                    class="btn w-full font-medium rounded-lg"
                    :class="[
                    reward.point <= userPoints
                        ? 'btn-primary text-white hover:opacity-90'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    ]"
                >
                    {{ reward.point <= userPoints ? 'Tukar Sekarang' : 'Poin Tidak Cukup' }}
                </button>
                </div>
            </div>
        </div>

          <!-- Sentinel for Infinite Scroll -->
          <div ref="sentinel" class="flex justify-center p-8 w-full col-span-full">
              <Loader2 v-if="isLoading" class="w-8 h-8 animate-spin text-primary" />
              <div v-else-if="page > lastPage && rewards.length > 0" class="text-neutral-400 text-sm italic">
                  Telah mencapai akhir
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
import { CircleHelp, Coins, History, Loader2 } from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { catalogService } from '~/services/catalog-service'
import { pointService } from '~/services/point-service'
import type { CatalogItem, CatalogCategory } from '~/types/catalog'
import type { RedemptionData } from '~/types/redemptions'

// Initial data fetching
const { data: pointResponse, refresh: refreshPoint } = await useAsyncData('user-points', () => pointService.getPoint())
const { data: categoryResponse } = await useAsyncData('catalog-categories', () => catalogService.getCategories())

const activeCategory = ref<CatalogCategory>({ id: 0, name: 'Semua' })
const rewards = ref<CatalogItem[]>([])
const page = ref(1)
const lastPage = ref(1)
const isLoading = ref(false)
const sentinel = ref<HTMLElement | null>(null)

// Derived states
const userPoints = computed(() => pointResponse.value?.data?.value ?? 0)
const categories = computed(() => {
    const allCategory = { id: 0, name: 'Semua' }
    return [allCategory, ...(categoryResponse.value?.data ?? [])]
})

const fetchCatalogs = async (isReset = false) => {
    if (isLoading.value) return
    if (!isReset && page.value > lastPage.value) return

    isLoading.value = true
    try {
        const response = await catalogService.getCatalogs({
            page: page.value,
            limit: 8,
            categoryId: activeCategory.value.id !== 0 ? activeCategory.value.id : undefined
        })
        
        if (response.success && response.data) {
            if (isReset) {
                rewards.value = response.data
            } else {
                const newItems = response.data.filter(newItem => 
                    !rewards.value.some(existingItem => existingItem.id === newItem.id)
                )
                rewards.value = [...rewards.value, ...newItems]
            }
            lastPage.value = response.meta.lastPage
            page.value++
        }
    } finally {
        isLoading.value = false
    }
}

// Watchers
watch(activeCategory, () => {
    page.value = 1
    lastPage.value = 1
    fetchCatalogs(true)
}, { deep: true })

// Infinite Scroll logic
let observer: IntersectionObserver | null = null

const initObserver = () => {
    if (observer) observer.disconnect()
    
    observer = new IntersectionObserver((entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoading.value && page.value <= lastPage.value) {
            fetchCatalogs()
        }
    }, { 
        rootMargin: '200px',
        threshold: 0.1 
    })

    if (sentinel.value) observer.observe(sentinel.value)
}

onMounted(() => {
    fetchCatalogs(true)
    initObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})

// Modal states
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
}
</script>