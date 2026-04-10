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

            <!-- Product Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    v-for="product in filteredProducts" 
                    :key="product.name"
                    class="card bg-white border border-base-300 rounded-xl p-5 flex flex-col space-y-6 "
                >
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-neutral-800">{{ product.name }}</h3>
                        <p class="text-xs text-neutral-400 min-h-[60px] text-justify">
                            {{ product.description }}
                        </p>
                    </div>

                    <div class="space-y-1">
                        <p class="text-xs text-neutral-400">Mulai dari</p>
                        <div class="flex items-baseline gap-1">
                            <span class="text-2xl font-semibold text-neutral-800">Rp{{ formatNumber(product.price) }}</span>
                            <span class="text-xs text-neutral-400">/{{ product.unit }}</span>
                        </div>
                    </div>

                    <div class="bg-primary/10 p-4 rounded-xl flex-grow flex flex-col">
                        <div class="space-y-2 flex-grow">
                            <div 
                                v-for="feature in product.features" 
                                :key="feature" 
                                class="flex items-start gap-2"
                            >
                                <CheckCheck class="w-4 h-4 text-primary mt-0.5" />
                                <span class="text-xs text-neutral-800">{{ feature }}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary w-full font-medium rounded-lg mt-4">
                            Selengkapnya
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Package, Check, CheckCheck } from 'lucide-vue-next';

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Katalog Produk dan Layanan',
})

const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'business', label: 'Internet Bisnis' },
    { id: 'home', label: 'Internet Home' },
    { id: 'digital', label: 'Produk Digital' },
];

const activeTab = ref('all');

const products = [
    {
        name: 'Broadband Business',
        category: 'business',
        description: 'Internet cepat dan stabil untuk mendukung operasional bisnis dengan harga yang terjangkau dan garansi minimum kecepatan di jam sibuk',
        price: 800000,
        unit: 'Bulan',
        features: [
            'Gratis Domain + Akun Cloud Mail',
            'Jaminan SLA 98%',
            'Router WiFi 6 Managed',
            'IP Local Static + Support CCTV'
        ]
    },
    {
        name: 'Broadband Home',
        category: 'home',
        description: 'Internet rumah unlimited dengan koneksi stabil untuk streaming, bekerja, dan gaming tanpa lag, dilengkapi dukungan teknis 24/7.',
        price: 200000,
        unit: 'Bulan',
        features: [
            'Hingga 300 Mbps',
            'Gratis Biaya Instalasi',
            'Gratis Sewa Modem',
            'Internet UNLIMITED'
        ]
    },
    {
        name: 'NusaSelecta',
        category: 'home',
        description: 'Nikmati internet WiFi khusus di lokasi terseleksi dengan koneksi lebih cepat, tanpa biaya instalasi, tanpa ribet, dan tanpa iklan di rumah Anda.',
        price: 140000,
        unit: 'Bulan',
        features: [
            'Gratis Hingga 30 Mbps',
            'Tanpa Iklan',
            'Gratis Biaya Pemasangan',
            'Gratis Sewa Modem'
        ]
    },
    {
        name: 'Nusafiber',
        category: 'home',
        description: 'Nikmati internet tanpa batas dengan kecepatan tinggi dan koneksi stabil setiap hari untuk memenuhi kebutuhan internet rumah dan usaha kecil Anda.',
        price: 229000,
        unit: 'Bulan',
        features: [
            'Unlimited Internet',
            'Gratis Biaya Pasang',
            'Gratis Sewa Modem',
            'Support Akses CCTV'
        ]
    },
    {
        name: 'HRIS Nusawork',
        category: 'digital',
        description: 'Aplikasi HRIS yang menyediakan solusi lengkap untuk kebutuhan administrasi HR yang terdigitalisasi dan terautomasi.',
        price: 20000,
        unit: 'User /Bulan',
        features: [
            'Attendance & Employee Management',
            'Employee Self-Service',
            'Payroll Management',
            'Performance & Task Management'
        ]
    },
    {
        name: 'Zoho Workplace',
        category: 'digital',
        description: 'Solusi kolaborasi dalam satu aplikasi terpadu untuk meningkatkan produktivitas tim, fleksibel sesuai kebutuhan dan budget bisnis Anda.',
        price: 13000,
        unit: 'User /Bulan',
        features: [
            'Email Bisnis Profesional',
            'Penyimpanan Hingga 50 GB per User',
            'Keamanan Data Terjamin',
            'Aplikasi Kerja Terintegrasi'
        ]
    }
];

const filteredProducts = computed(() => {
    if (activeTab.value === 'all') return products;
    return products.filter(p => p.category === activeTab.value);
});

const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
}
</script>

