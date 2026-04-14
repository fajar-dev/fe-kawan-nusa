<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <BadgePercent class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Update Promo</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Update Promo
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-12 pb-10">
            <div v-if="isLoading" class="flex justify-center py-20">
                <Loader2 class="w-10 h-10 animate-spin text-primary" />
            </div>

            <!-- Promo Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                    v-for="promo in promos" 
                    :key="promo.id"
                    class="card bg-white border border-base-300 rounded-xl overflow-hidden flex flex-col"
                >
                    <div class="relative h-52 overflow-hidden p-3">
                        <img
                            :src="promo.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop'" 
                            :alt="promo.title"
                            class="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <div class="p-4 space-y-4 flex-grow flex flex-col">
                        <div class="space-y-2 flex-grow">
                            <h3 class="font-semibold text-neutral-800 line-clamp-2 leading-snug">{{ promo.title }}</h3>
                            <p class="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{{ promo.description }}</p>
                        </div>

                        <div class="space-y-2.5">
                            <div class="flex items-center gap-2 text-xs text-neutral-500">
                                <Calendar class="w-4 h-4 text-neutral-400" />
                                {{ formatPeriod(promo.startPeriod, promo.endPeriod) }}
                            </div>
                            <div class="flex items-center gap-2 text-xs text-neutral-500">
                                <Tag class="w-4 h-4 text-neutral-400" />
                                {{ promo.service?.name }}
                            </div>
                        </div>

                        <a 
                            v-if="promo.url" 
                            :href="promo.url" 
                            target="_blank"
                            class="btn btn-primary btn-sm w-full font-medium rounded-lg text-white"
                        >
                            Lihat Detail <ChevronRight class="w-4 h-4" />
                        </a>
                        <button v-else class="btn btn-primary btn-sm w-full font-medium rounded-lg text-white">
                            Lihat Detail <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="promos.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-20">
                <img src="/assets/no-data.png" alt="No Data" class="w-52 h-auto mb-6" />
                <h3 class="text-xl font-bold text-neutral-800 mb-2">Belum Ada Promo</h3>
                <p class="text-neutral-500 text-sm">Nantikan promo menarik dari Nusanet segera!</p>
            </div>

            <!-- CTA Banner -->
            <div class="bg-primary/10 border border-primary/20 rounded-xl p-6 md:p-10 text-center mx-auto space-y-6">
                <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
                    <Lightbulb class="w-7 h-7 text-primary" />
                </div>
                
                <div class="space-y-2">
                    <h2 class="text-xl font-medium text-neutral-800">Butuh Bantuan Promosi?</h2>
                    <p class="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Akses template promosi siap pakai dan strategi penawaran untuk membantu menjangkau lebih banyak calon pelanggan.
                    </p>
                </div>

                <NuxtLink to="/education/strategy" class="btn btn-primary font-medium rounded-lg text-white px-8">
                    Akses Template <ChevronRight class="w-4 h-4" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BadgePercent, Calendar, Tag, ChevronRight, Lightbulb, Loader2 } from 'lucide-vue-next';
import { serviceService } from '~/services/service-service';
import { formatPeriod } from '~/utils/date';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Update Promo',
})

const isLoading = ref(false);
const promos = ref<any[]>([]);

const fetchPromos = async () => {
    isLoading.value = true
    try {
        const response = await serviceService.getPromotions({
            limit: 10
        })
        if (response.success) {
            promos.value = response.data
        }
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchPromos()
})
</script>

