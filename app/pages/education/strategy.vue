<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Lightbulb class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Strategi Penawaran</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Strategi Penawaran
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-10 pb-10">
            <!-- Tips Section -->
            <section class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-lg font-medium text-neutral-800">8 Tips Strategi Penawaran untuk Referral</h2>
                    <p class="text-sm text-neutral-500">Terapkan strategi berikut untuk membantu Anda menemukan dan meyakinkan calon pelanggan.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Tip 1 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">1</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Kenali Calon Pelanggan</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Cari tahu kebutuhan dan kebiasaan calon pelanggan sebelum menawarkan layanan. Dengan memahami kebutuhan mereka, Anda dapat memberikan penawaran yang lebih tepat.
                        </p>
                    </div>

                    <!-- Tip 2 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">2</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Bangun Kepercayaan</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Sampaikan informasi dengan jujur dan jelas. Kepercayaan akan membuat calon pelanggan merasa lebih yakin untuk menggunakan layanan yang Anda tawarkan.
                        </p>
                    </div>

                    <!-- Tip 3 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">3</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Fokus pada Manfaat</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Jelaskan manfaat utama yang akan didapat pelanggan. Tunjukkan bagaimana layanan tersebut dapat membantu atau mempermudah aktivitas mereka.
                        </p>
                    </div>

                    <!-- Tip 4 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">4</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Gunakan Penawaran Menarik</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Sampaikan promo, diskon, atau keuntungan yang tersedia agar calon pelanggan lebih tertarik untuk mencoba layanan tersebut.
                        </p>
                    </div>

                    <!-- Tip 5 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">5</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Lakukan Follow Up</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Jika calon pelanggan belum memberikan keputusan, lakukan follow up secara sopan untuk menanyakan kembali minat mereka.
                        </p>
                    </div>

                    <!-- Tip 6 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">6</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Gunakan Pendekatan Personal</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Sesuaikan cara komunikasi dengan karakter calon pelanggan agar mereka merasa lebih nyaman saat berdiskusi.
                        </p>
                    </div>

                    <!-- Tip 7 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">7</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Manfaatkan Media Sosial</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Gunakan media sosial untuk membagikan informasi layanan kepada lebih banyak orang dan memperluas jangkauan calon pelanggan.
                        </p>
                    </div>

                    <!-- Tip 8 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-6 flex flex-col items-center space-y-4">
                        <div class="w-10 h-10 rounded-lg bg-success flex items-center justify-center text-white font-medium">8</div>
                        <h3 class="font-medium text-neutral-800 text-sm">Bagikan Pengalaman Positif</h3>
                        <p class="text-xs text-neutral-800 text-justify">
                            Ceritaka pengalaman baik Anda atau pelanggan lain saat menggunakan layanan. Hal ini dapat meningkatkan kepercayaan calon pelanggan.
                        </p>
                    </div>
                </div>
            </section>

            <!-- Template Section -->
            <section class="space-y-6">
                <div class="space-y-1">
                    <h2 class="text-lg font-medium text-neutral-800">Template Promosi</h2>
                    <p class="text-sm text-neutral-500">Download dan edit template siap pakai untuk mempromosikan layanan dan produk di berbagai platform</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div 
                        v-for="template in templates" 
                        :key="template.id"
                        class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center group transition-all"
                    >
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img :src="template.thumbnail" class="w-full h-full object-cover" :alt="template.name" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">{{ template.name }}</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> {{ getAvailableFormats(template).join(', ') }}
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sentinel for Infinite Scroll -->
                <div ref="sentinel" class="flex justify-center p-8 w-full col-span-full">
                    <Loader2 v-if="isLoading" class="w-8 h-8 animate-spin text-primary" />
                    <div v-else-if="page > lastPage && templates.length > 0"></div>
                </div>

                <!-- Empty State -->
                <div v-if="templates.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-10">
                    <img src="/assets/no-data.png" alt="No Data" class="w-40 h-auto mb-4 opacity-70" />
                    <h3 class="text-lg font-bold text-neutral-800 mb-1">Template Belum Tersedia</h3>
                    <p class="text-neutral-500 text-xs">Mohon tunggu pembaruan template promosi terbaru kami.</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Lightbulb, Loader2, Image, Download } from 'lucide-vue-next';
import { templateService } from '~/services/template-service';
import { TEMPLATE_FORMATS } from '~/utils/string';
import type { MarketingTemplate } from '~/types/template';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Strategi Penawaran',
})

const isLoading = ref(false);
const templates = ref<any[]>([]);
const page = ref(1);
const lastPage = ref(1);
const sentinel = ref<HTMLElement | null>(null);

const getAvailableFormats = (tpl: MarketingTemplate) => {
    return TEMPLATE_FORMATS.filter(f => tpl[f.key as keyof MarketingTemplate]).map(f => f.label);
}

const fetchTemplates = async (isReset = false) => {
    if (isLoading.value) return
    if (!isReset && page.value > lastPage.value) return

    isLoading.value = true
    try {
        const response = await templateService.getTemplates({
            limit: 8,
            page: page.value
        })
        if (response.success && response.data) {
            if (isReset) {
                templates.value = response.data
            } else {
                const newItems = response.data.filter(newItem => 
                    !templates.value.some(existingItem => existingItem.id === newItem.id)
                )
                templates.value = [...templates.value, ...newItems]
            }
            lastPage.value = response.meta.lastPage
            page.value++
        }
    } finally {
        isLoading.value = false
    }
}

let observer: IntersectionObserver | null = null

const initObserver = () => {
    if (observer) observer.disconnect()
    
    observer = new IntersectionObserver((entries) => {
        const [entry] = entries
        if (entry?.isIntersecting && !isLoading.value && page.value <= lastPage.value) {
            fetchTemplates()
        }
    }, { 
        rootMargin: '200px',
        threshold: 0.1 
    })

    if (sentinel.value) observer.observe(sentinel.value)
}

onMounted(() => {
    fetchTemplates(true)
    initObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
})
</script>
