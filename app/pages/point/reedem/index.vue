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
                        <span class="text-neutral-800 font-semibold text-4xl">18.874</span>
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
                v-for="tab in categories" 
                :key="tab"
                @click="activeCategory = tab"
                class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0 font-medium"
                :class="[ activeCategory === tab ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800' ]"
                >
                {{ tab }}
                <div v-if="activeCategory === tab" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
                </button>
            </div>
        </div>

        <!-- Reward Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="(reward, index) in filteredRewards"
                :key="index"
                class="card bg-white border border-base-200 rounded-2xl overflow-hidden transition-all group"
            >
                <!-- Image Section -->
                <div class="relative h-52 overflow-hidden p-3">
                <img
                    :src="reward.image"
                    :alt="reward.title"
                    class="w-full h-full object-cover rounded-xl transition-transform duration-500"
                />
                </div>

                <div class="card-body p-4 flex flex-col gap-3">
                <!-- Badges -->
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/0">
                    Berakhir {{ reward.expiry }}
                    </span>
                    <span class="px-3 py-1 bg-primary/10 text-primary font-medium text-xs rounded-full border border-primary/0">
                    {{ reward.category }}
                    </span>
                </div>

                <!-- Content -->
                <div class="flex-1 space-y-1">
                    <h3 class="text-neutral-800 font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                    {{ reward.title }}
                    </h3>
                    <p class="text-neutral-400 text-xs line-clamp-2 min-h-[2rem]">
                    {{ reward.description }}
                    </p>
                </div>

                <!-- Points and S&K -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                    <Coins class="w-4 h-4 text-primary" />
                    <span class="font-medium text-primary text-sm">{{ reward.points.toLocaleString('id-ID') }} Poin</span>
                    </div>
                    <button class="text-primary text-xs font-medium flex items-center gap-0.5 hover:underline">
                    S&K <CircleHelp class="w-3.5 h-3.5 ml-0.5" />
                    </button>
                </div>

                <!-- CTA Button -->
                <button
                    :disabled="reward.points > userPoints"
                    class="btn w-full font-medium rounded-lg"
                    :class="[
                    reward.points <= userPoints
                        ? 'btn-primary text-white hover:opacity-90'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    ]"
                >
                    {{ reward.points <= userPoints ? 'Tukar Sekarang' : 'Poin Tidak Cukup' }}
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { 
  Coins,
  History,
  CircleHelp
} from 'lucide-vue-next'
import { ref, computed } from 'vue'

const userPoints = ref(18874)
const activeCategory = ref('Semua')
const categories = ['Semua', 'Belanja', 'Elektronik', 'Hiburan']

interface Reward {
  title: string
  description: string
  points: number
  category: string
  expiry: string
  image: string
}

const rewards = ref<Reward[]>([
  {
    title: 'Voucher Rp100.000 Belanja di Indomaret',
    description: 'Nikmati belanja lebih hemat di Indomaret dengan voucher digital senilai Rp100.000.',
    points: 100,
    category: 'Belanja',
    expiry: '22 Mei 2026',
    image: 'https://picsum.photos/id/10/400/300'
  },
  {
    title: 'Xiaomi Redmi Buds 4 Lite',
    description: 'Earbuds nirkabel ringan dengan suara jernih dan konektivitas stabil untuk aktivitas harian.',
    points: 20000,
    category: 'Elektronik',
    expiry: '22 Mei 2026',
    image: 'https://picsum.photos/id/1/400/300'
  },
  {
    title: 'JBL Go 3 Portable Bluetooth Speaker',
    description: 'Nikmati suara powerful dari speaker portabel yang tahan air dan debu, cocok untuk traveling.',
    points: 1000,
    category: 'Elektronik',
    expiry: '29 Mei 2026',
    image: 'https://picsum.photos/id/2/400/300'
  },
  {
    title: 'M-Tix Rp50.000',
    description: 'Nikmati saldo Rp50.000 untuk memesan tiket bioskop lewat aplikasi M-Tix di XXI.',
    points: 50,
    category: 'Hiburan',
    expiry: '14 Juni 2026',
    image: 'https://picsum.photos/id/3/400/300'
  },
  {
    title: 'Voucher GrabFood Rp50.000',
    description: 'Nikmati voucher GrabFood Rp50.000 di aplikasi Grab untuk semua restoran favorit.',
    points: 50,
    category: 'Belanja',
    expiry: '18 Juni 2026',
    image: 'https://picsum.photos/id/4/400/300'
  },
  {
    title: 'Voucher Tiket Pesawat Rp200.000 Traveloka',
    description: 'Nikmati potongan Rp200.000 untuk pemesanan tiket pesawat domestik dan internasional.',
    points: 200,
    category: 'Liburan',
    expiry: '24 Agustus 2026',
    image: 'https://picsum.photos/id/5/400/300'
  }
])

const filteredRewards = computed(() => {
  if (activeCategory.value === 'Semua') return rewards.value
  return rewards.value.filter(r => r.category === activeCategory.value)
})
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