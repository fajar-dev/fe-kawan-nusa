<template>
    <div class="flex flex-col w-full pb-10">
        <AppToolbar>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
            <div>
                <div class="flex items-center gap-2">
                <h1 class="text-xl font-medium text-neutral-800">Riwayat Penukaran</h1>
                </div>
                <p class="text-xs text-neutral-400 font-medium mt-0.5">
                        Lihat status dan detail reward yang telah Anda tukarkan
                </p>
            </div>
            </div>
        </div>
        </AppToolbar>

        <div class="space-y-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="bg-white border border-base-200 rounded-xl p-4 text-center shadow-xs">
            <p class="text-xs text-neutral-500 mb-1">{{ stat.label }}</p>
            <p class="text-2xl font-medium text-neutral-800">{{ stat.value }}</p>
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex lg:justify-end justify-center">
            <div class="flex items-center gap-6 lg:gap-8 overflow-x-auto no-scrollbar border-b border-base-300 w-fit max-w-full px-4 lg:px-0">
            <button 
                v-for="tab in statusTabs" 
                :key="tab"
                @click="activeStatus = tab"
                class="pb-3 text-xs lg:text-sm transition-all relative shrink-0 font-medium"
                :class="[ activeStatus === tab ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
            >
                {{ tab }}
                <div v-if="activeStatus === tab" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
            </button>
            </div>
        </div>

        <!-- History List -->
        <div class="space-y-6">
            <div v-if="redemptions.length === 0 && !isLoading" class="bg-white border border-base-200 rounded-2xl p-12 text-center">
                <Package class="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <p class="text-neutral-500">Belum ada riwayat penukaran</p>
            </div>
            <div v-else v-for="(item, index) in redemptions" :key="index" class="bg-white border border-base-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
            <div class="p-5 flex flex-col md:flex-row gap-6">
                <!-- Image -->
                <div class="w-full aspect-video md:aspect-auto md:w-28 md:h-28 shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
                <img 
                    :src="(item.voucherDetails || item.productDetails)?.catalog.image || 'https://picsum.photos/200/200'" 
                    :alt="(item.voucherDetails || item.productDetails)?.catalog.name" 
                    class="w-full h-full object-cover" 
                />
                </div>

                <!-- Main Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div class="flex flex-col gap-1.5 min-w-0">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <h3 class="text-neutral-900 font-medium text-sm lg:text-base truncate">
                                    {{ (item.voucherDetails || item.productDetails)?.catalog.name || 'Reward' }}
                                </h3>
                                <span class="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-[10px] lg:text-xs font-medium rounded-md capitalize">
                                    {{ (item.voucherDetails || item.productDetails)?.catalog.category.name }}
                                </span>
                            </div>
                        </div>
                        <div class="px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 shrink-0" :class="statusStyles[item.status]">
                            <component :is="statusIcons[item.status]" class="w-3.5 h-3.5" />
                            {{ formatStatusDisplay(item.status) }}
                        </div>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 gap-x-12 text-xs">
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Hash class="w-3.5 h-3.5" /> ID Transaksi :
                        </span>
                        <span class="text-neutral-900">{{ item.redempNo }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Coins class="w-3.5 h-3.5 text-purple-500" /> Poin ditukar :
                        </span>
                        <span class="text-primary font-medium text-purple-500">{{ item.pointsUsed.toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Calendar class="w-3.5 h-3.5" /> Tanggal penukaran :
                        </span>
                        <span class="text-neutral-900">{{ formatDateTime(item.createdAt) }}</span>
                        </div>
                        <div class="flex gap-2 py-1">
                        <span class="text-neutral-500 flex gap-2">
                            <CheckCircle2 class="w-3.5 h-3.5" /> Selesai pada :
                        </span>
                        <span class="text-neutral-900">{{ item.status === 'completed' ? formatDateTime(item.createdAt) : '-' }}</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="my-4 border-t border-dashed border-neutral-200"></div>

                    <!-- Shipping/Receiver Details -->
                    <div class="space-y-2">
                        <p class="text-xs font-medium text-neutral-500">Detail Pengiriman</p>
                        <div class="grid grid-cols-1 text-xs">
                        <div v-if="(item.voucherDetails || item.productDetails)?.name" class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <User class="w-3.5 h-3.5" /> Nama :
                            </span>
                            <span class="text-neutral-900">{{ (item.voucherDetails || item.productDetails)?.name }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <Mail class="w-3.5 h-3.5" /> Email :
                            </span>
                            <span class="text-neutral-900">{{ (item.voucherDetails || item.productDetails)?.email }}</span>
                        </div>
                        <div v-if="item.productDetails?.phone" class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <Phone class="w-3.5 h-3.5" /> No. Handphone :
                            </span>
                            <span class="text-neutral-900">{{ item.productDetails.phone }}</span>
                        </div>
                        <div v-if="item.productDetails?.address" class="flex gap-2 py-1">
                            <span class="text-neutral-500 flex gap-2 shrink-0">
                                <MapPin class="w-3.5 h-3.5" /> Alamat :
                            </span>
                            <span class="text-neutral-900 leading-relaxed">{{ item.productDetails.address }}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Specific Voucher Section -->
            <div v-if="item.type === 'voucher' && item.voucherDetails?.detail" class="p-4 mx-5 mb-5 border border-neutral-200 rounded-xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Ticket class="w-6 h-6" />
                    </div>
                    <div>
                        <p class="text-xs font-medium text-neutral-800">Voucher Tersedia</p>
                        <p class="text-xs text-neutral-500 mt-1">Klik tombol untuk melihat kode voucher</p>
                    </div>
                </div>
                <button 
                  @click="showVoucherDetail(item)"
                  class="btn btn-primary btn-sm rounded-lg text-xs font-medium shrink-0"
                >
                  Lihat Voucher
                </button>
              </div>

              <!-- Specific Shipping Section -->
            <div v-if="item.type === 'product' && item.productDetails?.shipping" class="p-4 mx-5 mb-5 border border-neutral-200 rounded-xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Truck class="w-6 h-6" />
                    </div>
                    <div class="space-y-0">
                        <p class="text-xs font-medium text-neutral-700 mb-1">Paket Dalam Pengiriman</p>
                        <div class="grid grid-cols-1 text-xs">
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2">
                                    Ekspedisi :
                                </span>
                                <span class="text-neutral-900">{{ item.productDetails?.shipping.shipper }}</span>
                            </div>
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2">
                                    No. Resi :
                                </span>
                                <span class="text-neutral-900 group relative">
                                    {{ item.productDetails?.shipping.trackingNumber }}
                                </span>
                            </div>
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2"> Dikirim Pada : </span>
                                <span class="text-neutral-900">{{ formatDateTime(item.productDetails?.shipping.shippedAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm rounded-lg text-xs font-medium shrink-0">
                    <ExternalLink class="w-3.5 h-3.5" />
                    Lacak Paket
                </button>
            </div>
            </div>

            <!-- Sentinel for Infinite Scroll -->
            <div ref="sentinel" class="flex justify-center p-8 w-full">
                <Loader2 v-if="isLoading" class="w-8 h-8 animate-spin text-primary" />
                <div v-else-if="page > lastPage && redemptions.length > 0" class="text-neutral-400 text-sm italic">
                    Telah mencapai akhir
                </div>
            </div>
        </div>
      </div>

      <!-- Voucher Detail Modal -->
      <ModalVoucherDetail 
        v-model="showVoucherModal" 
        :redemption="selectedRedemption" 
      />
    </div>
</template>

<script setup lang="ts">
import { Hash, Coins, Calendar, CheckCircle2, User, Mail, Phone, MapPin, Clock, Package, CheckCircle, Ticket, Loader2, Truck, ExternalLink } from 'lucide-vue-next'
import { statisticService } from '~/services/statistic-service'
import { redemptionService } from '~/services/redemption-service'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { formatDateTime } from '~/utils/date'
import type { RedemptionData } from '~/types/redemption'

// Filter and Tabs
const activeStatus = ref('Semua')
const statusTabs = ['Semua', 'Menunggu', 'Diproses', 'Selesai']

// Stats fetching
const { data: statsResponse } = await useAsyncData(
    'redemption-reward-statistic',
    () => statisticService.getRedemptionRewardStatistic()
)

const stats = computed(() => {
    const rawData = statsResponse.value?.data || []
    const getCount = (status: string) => rawData.find(d => d.status === status)?.count || 0

    return [
        { label: 'Total Penukaran', value: rawData.reduce((acc, curr) => acc + curr.count, 0) },
        { label: 'Menunggu', value: getCount('pending') },
        { label: 'Diproses', value: getCount('processing') },
        { label: 'Selesai', value: getCount('completed') }
    ]
})

// Pagination and Data
const redemptions = ref<RedemptionData[]>([])
const page = ref(1)
const lastPage = ref(1)
const isLoading = ref(false)
const sentinel = ref<HTMLElement | null>(null)

// Modal states
const showVoucherModal = ref(false)
const selectedRedemption = ref<RedemptionData | null>(null)

const showVoucherDetail = (item: RedemptionData) => {
    selectedRedemption.value = item
    showVoucherModal.value = true
}

const queryStatus = computed(() => {
    const statusMap: Record<string, string> = {
        'Menunggu': 'pending',
        'Diproses': 'processing',
        'Selesai': 'completed'
    }
    return statusMap[activeStatus.value]
})

const fetchRedemptions = async (isReset = false) => {
    if (isLoading.value) return
    if (!isReset && page.value > lastPage.value) return

    isLoading.value = true
    try {
        const response = await redemptionService.getRedemptions({
            page: page.value,
            limit: 5,
            status: queryStatus.value ? [queryStatus.value] : undefined,
            type: ['product', 'voucher']
        })
        
        if (response.success && response.data) {
            if (isReset) {
                redemptions.value = response.data
            } else {
                const newItems = response.data.filter(newItem => 
                    !redemptions.value.some(existingItem => existingItem.id === newItem.id)
                )
                redemptions.value = [...redemptions.value, ...newItems]
            }
            lastPage.value = response.meta.lastPage
            page.value++
        }
    } finally {
        isLoading.value = false
    }
}

// Reset when tab changes
watch(activeStatus, () => {
    page.value = 1
    lastPage.value = 1
    fetchRedemptions(true)
})

// Observer implementation
let observer: IntersectionObserver | null = null

const initObserver = () => {
    if (observer) observer.disconnect()
    
    observer = new IntersectionObserver((entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoading.value && page.value <= lastPage.value) {
            fetchRedemptions()
        }
    }, { 
        rootMargin: '200px',
        threshold: 0.1 
    })

    if (sentinel.value) observer.observe(sentinel.value)
}

onMounted(() => {
    fetchRedemptions(true)
    initObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})

const formatStatusDisplay = (statusValue: string) => {
    switch (statusValue) {
        case 'pending': return 'Menunggu Verifikasi'
        case 'processing': return 'Sedang Diproses'
        case 'completed': return 'Selesai'
        default: return statusValue
    }
}

type RedeemStatus = 'pending' | 'processing' | 'completed'

const statusStyles: Record<RedeemStatus, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  processing: 'bg-blue-50 text-blue-600 border-blue-100',
  completed: 'bg-green-50 text-green-600 border-green-100'
}

const statusIcons: Record<RedeemStatus, any> = {
  pending: Clock,
  processing: Package,
  completed: CheckCircle
}
</script>