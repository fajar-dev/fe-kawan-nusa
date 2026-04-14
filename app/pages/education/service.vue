<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Package class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Katalog Produk dan Layanan</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Katalog Produk dan Layanan
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-6 pb-10">
            <!-- Tabs Navigation -->
            <div class="my-6 flex md:justify-end justify-center">
                <div class="flex items-center gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden no-scrollbar border-b border-base-300 w-fit max-w-full px-4 lg:px-0">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0 font-medium"
                        :class="activeTab === tab.id ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800'"
                    >
                        {{ tab.label }}
                        <div v-if="activeTab === tab.id" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center py-20">
                <Loader2 class="w-10 h-10 animate-spin text-primary" />
            </div>

            <!-- Product Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    v-for="product in products" 
                    :key="product.id"
                    class="card bg-white border border-base-300 rounded-xl p-5 flex flex-col space-y-6"
                >
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-neutral-800">{{ product.name }}</h3>
                        <p class="text-xs text-neutral-500 min-h-[60px] leading-relaxed line-clamp-3">
                            {{ product.description }}
                        </p>
                    </div>

                    <div class="space-y-1">
                        <p class="text-xs text-neutral-400 font-medium">Mulai dari</p>
                        <div class="flex items-baseline gap-1">
                            <span class="text-2xl font-semibold text-neutral-800">Rp. {{ formatNumber(product.price) }}</span>
                            <span class="text-xs text-neutral-400 font-medium">/{{ formatUnit(product.unit) }}</span>
                        </div>
                    </div>

                    <div class="bg-primary/10 p-4 rounded-xl flex-grow flex flex-col">
                        <div class="space-y-2 flex-grow">
                            <div 
                                v-for="feature in product.features" 
                                :key="feature" 
                                class="flex items-start gap-2"
                            >
                                <CheckCheck class="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span class="text-xs text-neutral-800 leading-tight">{{ feature }}</span>
                            </div>
                        </div>
                        <a 
                            v-if="product.url" 
                            :href="product.url" 
                            target="_blank" 
                            class="btn btn-primary btn-sm w-full font-medium rounded-lg mt-4 text-white"
                        >
                            Selengkapnya
                        </a>
                        <button v-else class="btn btn-primary btn-sm w-full font-medium rounded-lg mt-4 text-white">
                            Selengkapnya
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="products.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-20">
                <img src="/assets/no-data.png" alt="No Data" class="w-52 h-auto mb-6" />
                <h3 class="text-xl font-bold text-neutral-800 mb-2">Produk Tidak Ditemukan</h3>
                <p class="text-neutral-500 text-sm">Maaf, saat ini belum ada produk dalam kategori ini.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Package, CheckCheck, Loader2 } from 'lucide-vue-next';
import { serviceService } from '~/services/service-service';
import { additionalService } from '~/services/additional-service';
import type { ServiceCategory } from '~/types/service';
import type { ApiResponse } from '~/types/auth';

import { formatNumber, formatUnit } from '~/utils/string';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Katalog Produk dan Layanan',
})

const activeTab = ref('all');
const isLoading = ref(false);
const products = ref<any[]>([]);

// Fetch Categories for Tabs
const { data: categoryResponse } = useAsyncData<ApiResponse<ServiceCategory[]>>(
    'service-categories',
    () => additionalService.getServiceCategories()
)

const tabs = computed(() => {
    const apiTabs = (categoryResponse.value?.data || []).map((cat: ServiceCategory) => ({
        id: cat.name, // Use name for filtering as per API spec
        label: cat.name
    }))
    return [
        { id: 'all', label: 'Semua' },
        ...apiTabs
    ]
})

const fetchProducts = async () => {
    isLoading.value = true
    try {
        const response = await serviceService.getServices({
            category: activeTab.value === 'all' ? undefined : activeTab.value,
            limit: 10,
            isActive: 1
        })
        if (response.success) {
            products.value = response.data
        }
    } finally {
        isLoading.value = false
    }
}

watch(activeTab, () => {
    fetchProducts()
}, { immediate: true })

</script>

