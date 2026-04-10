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
            <!-- Promo Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                    v-for="promo in promos" 
                    :key="promo.title"
                    class="card bg-white border border-base-300 rounded-xl overflow-hidden"
                >
                    <div class="relative h-52 overflow-hidden p-3">
                        <img
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" 
                            :alt="promo.title"
                            class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                        />
                    </div>
                    <div class="p-3 space-y-4">
                        <div class="space-y-2">
                            <h3 class="font-medium text-neutral-800">{{ promo.title }}</h3>
                            <p class="text-xs text-neutral-500">{{ promo.description }}</p>
                        </div>

                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-xs text-neutral-400">
                                <Calendar class="w-3.5 h-3.5" />
                                {{ promo.period }}
                            </div>
                            <div class="flex items-center gap-2 text-xs text-neutral-400">
                                <Tag class="w-3.5 h-3.5" />
                                {{ promo.category }}
                            </div>
                        </div>

                        <button class="btn btn-primary w-full font-medium rounded-lg">
                            Lihat Detail <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- CTA Banner -->
            <div class="bg-primary/10 border border-primary/20 rounded-xl p-6 md:p-10 text-center  mx-auto space-y-6">
                <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto">
                    <Lightbulb class="w-7 h-7 text-primary" />
                </div>
                
                <div class="space-y-2">
                    <h2 class="text-xl font-medium text-neutral-800">Butuh Bantuan Promosi?</h2>
                    <p class="text-sm text-neutral-800 max-w-2xl mx-auto leading-relaxed">
                        Akses template promosi siap pakai dan strategi penawaran untuk membantu menjangkau lebih banyak calon pelanggan.
                    </p>
                </div>

                <NuxtLink to="/education/strategy" class="btn btn-primary font-medium rounded-lg">
                    Akses Template <ChevronRight class="w-4 h-4" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BadgePercent, Calendar, Tag, ChevronRight, Lightbulb } from 'lucide-vue-next';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Update Promo',
})

const promos = [
    {
        title: 'Promo Spesial KEJARRR',
        description: 'Nikmati pengalaman internet super cepat dengan paket Broadband Home kami khusus bulan ini.',
        period: '1 Apr - 30 Apr 2026',
        category: 'Paket Internet Broadband Home'
    }
];
</script>

