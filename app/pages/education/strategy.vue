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
                            Ceritakan pengalaman baik Anda atau pelanggan lain saat menggunakan layanan. Hal ini dapat meningkatkan kepercayaan calon pelanggan.
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

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Template Card 1 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">Instagram Story - Flash Sale</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> JPG, PNG - 1080 x 1920 px
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>

                    <!-- Template Card 2 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">Instagram Story - Mega Sale</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> JPG, PNG - 1080 x 1920 px
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>

                    <!-- Template Card 3 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">Tiktok Cover - Video Promosi</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Play class="w-3 h-3" /> MP4 - 1080 x 1920 px (9:16)
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>

                    <!-- Template Card 4 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">WhatsApp Banner - Penawaran Spesial</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> JPG, PNG - 1080 x 1920 px
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>

                    <!-- Template Card 5 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">Instagram Post - Promo Jitu</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> JPG, PNG - 1080 x 1920 px
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>

                    <!-- Template Card 6 -->
                    <div class="card bg-white border border-base-300 rounded-xl p-4 flex flex-row gap-4 items-center">
                        <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 space-y-2">
                            <h3 class="font-medium text-neutral-800 text-sm leading-tight">WhatsApp Banner - Penawaran Spesial</h3>
                            <div class="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                <Image class="w-3 h-3" /> JPG, PNG - 1080 x 1920 px
                            </div>
                            <button class="btn btn-primary w-full btn-xs font-medium rounded-lg">
                                <Download class="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Lightbulb, Download, Image, Play } from 'lucide-vue-next';


definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Strategi Penawaran',
})
</script>

