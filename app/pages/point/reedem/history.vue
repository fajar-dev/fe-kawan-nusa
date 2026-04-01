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
            <div v-for="(item, index) in filteredHistory" :key="index" class="bg-white border border-base-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
            <div class="p-5 flex flex-col md:flex-row gap-6">
                <!-- Image -->
                <div class="w-full aspect-video md:aspect-auto md:w-28 md:h-28 shrink-0 bg-neutral-100 rounded-xl overflow-hidden">
                <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                </div>

                <!-- Main Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div class="flex flex-col gap-1.5 min-w-0">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <h3 class="text-neutral-900 font-medium text-sm lg:text-base truncate">{{ item.title }}</h3>
                                <span class="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-[10px] lg:text-xs font-medium rounded-md">
                                    {{ item.category }}
                                </span>
                            </div>
                        </div>
                        <div class="px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 shrink-0" :class="statusStyles[item.status]">
                            <component :is="statusIcons[item.status]" class="w-3.5 h-3.5" />
                            {{ item.statusText }}
                        </div>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid grid-cols-1 gap-x-12 text-xs">
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Hash class="w-3.5 h-3.5" /> ID Transaksi :
                        </span>
                        <span class="text-neutral-900">{{ item.transactionId }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Coins class="w-3.5 h-3.5 text-purple-500" /> Poin ditukar :
                        </span>
                        <span class="text-primary font-medium text-purple-500">{{ item.points }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                        <span class="text-neutral-500 flex gap-2">
                            <Calendar class="w-3.5 h-3.5" /> Tanggal penukaran :
                        </span>
                        <span class="text-neutral-900">{{ item.date }}</span>
                        </div>
                        <div class="flex gap-2 py-1">
                        <span class="text-neutral-500 flex gap-2">
                            <CheckCircle2 class="w-3.5 h-3.5" /> Selesai pada :
                        </span>
                        <span class="text-neutral-900">{{ item.completedAt || '-' }}</span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="my-4 border-t border-dashed border-neutral-200"></div>

                    <!-- Shipping/Receiver Details -->
                    <div class="space-y-2">
                        <p class="text-xs font-medium text-neutral-500">Detail Pengiriman</p>
                        <div class="grid grid-cols-1 text-xs">
                        <div v-if="item.receiver.name" class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <User class="w-3.5 h-3.5" /> Nama :
                            </span>
                            <span class="text-neutral-900">{{ item.receiver.name }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <Mail class="w-3.5 h-3.5" /> Email :
                            </span>
                            <span class="text-neutral-900">{{ item.receiver.email }}</span>
                        </div>
                        <div class="flex gap-2 py-1 border-b border-neutral-50 lg:border-none">
                            <span class="text-neutral-500 flex gap-2">
                                <Phone class="w-3.5 h-3.5" /> No. Handphone :
                            </span>
                            <span class="text-neutral-900">{{ item.receiver.phone }}</span>
                        </div>
                        <div v-if="item.receiver.address" class="flex gap-2 py-1">
                            <span class="text-neutral-500 flex gap-2 shrink-0">
                                <MapPin class="w-3.5 h-3.5" /> Alamat :
                            </span>
                            <span class="text-neutral-900 leading-relaxed">{{ item.receiver.address }}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Action Section (Conditional based on status) -->
            <div v-if="item.shippingInfo" class="border border-neutral-200 p-4 mx-5 mb-5 rounded-xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Truck class="w-6 h-6" />
                    </div>
                    <div class="space-y-0">
                        <p class="text-xs font-medium text-neutral-700 mb-1">Paket Dalam Pengiriman</p>
                        <div class="grid grid-cols-1 text-xs">
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2">
                                    Kurir :
                                </span>
                                <span class="text-neutral-900">{{ item.shippingInfo.courier }}</span>
                            </div>
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2">
                                    No. Resi :
                                </span>
                                <span class="text-neutral-900 group relative">
                                    {{ item.shippingInfo.trackingNumber }}
                                </span>
                            </div>
                            <div class="flex gap-4 py-1 border-b border-neutral-50 lg:border-none">
                                <span class="text-neutral-500 flex gap-2"> Dikirim Pada : </span>
                                <span class="text-neutral-900">{{ item.shippingInfo.shippedAt }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm rounded-lg text-xs font-medium shrink-0">
                    <ExternalLink class="w-3.5 h-3.5" />
                    Lacak Paket
                </button>
            </div>

            <div v-if="item.voucherInfo" class="p-4 mx-5 mb-5 border border-neutral-200 rounded-xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <Ticket class="w-6 h-6" />
                    </div>
                    <div>
                        <p class="text-xs font-medium text-neutral-800">{{ item.voucherInfo.title }}</p>
                        <p class="text-xs text-neutral-500 mt-1">Klik tombol untuk melihat kode voucher</p>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm rounded-lg text-xs font-medium shrink-0">
                    Lihat Voucher
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { 
  Hash,
  Coins,
  Calendar,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  Truck,
  ExternalLink,
  Ticket
} from 'lucide-vue-next'
import { ref, computed } from 'vue'

const activeStatus = ref('Semua')
const statusTabs = ['Semua', 'Menunggu', 'Diproses', 'Selesai']

const stats = [
  { label: 'Total Penukaran', value: 6 },
  { label: 'Menunggu', value: 1 },
  { label: 'Diproses', value: 3 },
  { label: 'Selesai', value: 2 }
]

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


interface RedeemHistoryItem {
  title: string
  category: string
  status: RedeemStatus
  statusText: string
  transactionId: string
  points: number
  date: string
  completedAt: string | null
  image: string
  receiver: {
    name?: string
    email: string
    phone: string
    address?: string
  }
  shippingInfo?: {
    title: string
    courier: string
    trackingNumber: string
    shippedAt: string
  }
  voucherInfo?: {
    title: string
  }
}

const history = ref<RedeemHistoryItem[]>([
  {
    title: 'Voucher Cashback Blibli Rp50.000',
    category: 'Belanja',
    status: 'pending',
    statusText: 'Menunggu Verifikasi',
    transactionId: 'TRW24032026247005',
    points: 50,
    date: '24 Maret 2026, 11:30 WIB',
    completedAt: null,
    image: 'https://picsum.photos/id/10/200/200',
    receiver: {
      email: 'adipragiwaksono@gmail.com',
      phone: '+62 822-0870-3090'
    }
  },
  {
    title: 'Haylou Solar Plus Smartwatch',
    category: 'Elektronik',
    status: 'pending',
    statusText: 'Menunggu Verifikasi',
    transactionId: 'TRW24032026247004',
    points: 550,
    date: '24 Maret 2026, 08:30 WIB',
    completedAt: null,
    image: 'https://picsum.photos/id/1/200/200',
    receiver: {
      name: 'Rupert Alexander',
      email: 'adipragiwaksono@gmail.com',
      phone: '+62 822-0870-3090',
      address: 'Jl. Melati Indah No.25, Kel. Sukamaju, Kec. Medan Johor, Kota Medan, Sumatera Utara 20143, RT 003 RW 002'
    }
  },
  {
    title: 'JBL Go 3 Portable Bluetooth Speaker',
    category: 'Elektronik',
    status: 'processing',
    statusText: 'Sedang Diproses',
    transactionId: 'TRW12032026247003',
    points: 1000,
    date: '12 Maret 2026, 12:30 WIB',
    completedAt: null,
    image: 'https://picsum.photos/id/2/200/200',
    receiver: {
      name: 'Rupert Alexander',
      email: 'adipragiwaksono@gmail.com',
      phone: '+62 822-0870-3090',
      address: 'Jl. Melati Indah No.25, Kel. Sukamaju, Kec. Medan Johor, Kota Medan, Sumatera Utara 20143, RT 003 RW 002'
    },
    shippingInfo: {
      title: 'Paket Dalam Pengiriman',
      courier: 'Hanif Purba',
      trackingNumber: 'JT1234567890123',
      shippedAt: '15 Maret 2026, 13:00 WIB'
    }
  },
  {
    title: 'Voucher Rp100.000 Belanja di Indomaret',
    category: 'Belanja',
    status: 'completed',
    statusText: 'Selesai',
    transactionId: 'TRW09032026247002',
    points: 100,
    date: '09 Maret 2026, 12:30 WIB',
    completedAt: '11 Maret 2026, 10:00 WIB',
    image: 'https://picsum.photos/id/11/200/200',
    receiver: {
      email: 'adipragiwaksono@gmail.com',
      phone: '+62 822-0870-3090'
    },
    voucherInfo: {
      title: 'Voucher Tersedia'
    }
  }
])

const filteredHistory = computed(() => {
  if (activeStatus.value === 'Semua') return history.value
  const statusMap: Record<string, RedeemStatus> = {
    'Menunggu': 'pending',
    'Diproses': 'processing',
    'Selesai': 'completed'
  }
  const status = statusMap[activeStatus.value]
  return history.value.filter(item => item.status === status)
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