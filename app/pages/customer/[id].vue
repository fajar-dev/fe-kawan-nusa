<template>
  <div class="space-y-6">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-[#629e43] text-white flex items-center justify-center rounded-lg text-xl font-semibold">
            AB
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-semibold text-neutral-800">Annette Black</h1>
              <CircleHelp class="w-5 h-5 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
              <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[10px] text-neutral-600">
                <History class="w-3.5 h-3.5" />
                Terakhir Direferensikan: <span class="font-semibold">27 Mei 2025</span>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] text-primary font-semibold">
                <Package class="w-3.5 h-3.5" />
                3 Layanan Aktif
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-medium tracking-wider mt-1.5">
              <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
              <NuxtLink to="/customer" class="text-primary hover:underline">Customer Saya</NuxtLink> / 
              <span class="text-neutral-500">Annette Black</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Detail Pelanggan -->
        <div class="lg:col-span-4 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <Users class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Pelanggan</h3>
              </div>
            </div>
            <div class="card-body p-6 pt-0 flex flex-col gap-5 ps-8">
              <div class="space-y-5">
                <!-- Row 1 -->
                <div class="flex items-start gap-4">
                  <Calendar class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Tanggal Bergabung</span>
                    <span class="text-[13px] text-neutral-800 font-medium">25 Juni 2025</span>
                  </div>
                </div>
                <!-- Row 2 -->
                <div class="flex items-start gap-4">
                  <Hash class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">ID Pelanggan</span>
                    <span class="text-[13px] text-neutral-800 font-medium">02001267400</span>
                  </div>
                </div>
                <!-- Row 3 -->
                <div class="flex items-start gap-4">
                  <Mail class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col flex-1">
                    <span class="text-xs text-neutral-900">Email</span>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-[13px] text-neutral-800 font-medium">ann@email.com</span>
                      <div class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1">
                        +2 <ChevronDown class="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 4 -->
                <div class="flex items-start gap-4">
                  <Phone class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col flex-1">
                    <span class="text-xs text-neutral-900">No Handphone</span>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-[13px] text-neutral-800 font-medium">+6288234567890</span>
                      <div class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1">
                        +2 <ChevronDown class="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 5 -->
                <div class="flex items-start gap-4">
                  <Briefcase class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Bidang Industri</span>
                    <span class="text-[13px] text-neutral-800 font-medium">Retail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Detail Alamat -->
        <div class="lg:col-span-8 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <MapPin class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Alamat</h3>
              </div>
            </div>
            <div class="card-body pt-0 flex flex-col gap-5 ps-8">
              <div class="flex-1 space-y-3">
                <!-- Address 1 -->
                <div class="flex gap-1 group">
                  <div class="w-8 h-8 flex items-start justify-center text-neutral-500">
                    <MapPin class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-neutral-900">Alamat Pemasangan 1</span>
                    <p class="text-sm text-neutral-600 font-medium leading-relaxed">
                      Jl. Brigjen Katamso No. 128, Kelurahan Sei Mati, Kecamatan Medan Maimun, Kota Medan, Provinsi Sumatera Utara, 20151, Indonesia
                    </p>
                  </div>
                </div>

                <!-- Address 2 -->
                <div class="flex gap-1 group">
                  <div class="w-8 h-8 flex items-start justify-center text-neutral-500">
                    <MapPin class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-neutral-900">Alamat Pemasangan 1</span>
                    <p class="text-sm text-neutral-600 font-medium leading-relaxed">
                      Jl. Brigjen Katamso No. 128, Kelurahan Sei Mati, Kecamatan Medan Maimun, Kota Medan, Provinsi Sumatera Utara, 20151, Indonesia
                    </p>
                  </div>
                </div>

                <!-- Address 3 -->
                <div class="flex gap-1 group">
                  <div class="w-8 h-8 flex items-start justify-center text-neutral-500">
                    <MapPin class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-neutral-900">Alamat Pemasangan 1</span>
                    <p class="text-sm text-neutral-600 font-medium leading-relaxed">
                      Jl. Brigjen Katamso No. 128, Kelurahan Sei Mati, Kecamatan Medan Maimun, Kota Medan, Provinsi Sumatera Utara, 20151, Indonesia
                    </p>
                  </div>
                </div>
              </div>

            <div class="card-footer">
              <!-- Pagination footer -->
              <div class="flex flex-col lg:flex-row items-center lg:justify-between lg:gap-0 gap-4 justify-center mt-6 text-sm border-t border-base-300 pt-3">
                <div class="text-neutral-500 text-xs">Showing 1 to 3 of 10 entries</div>
                  <div class="join rounded-lg overflow-hidden bg-white">
                    <button class="btn btn-xs h-7 bg-white border-0 rounded-lg text-neutral-400 disabled:bg-white disabled:text-neutral-200">
                      <ChevronLeft class="w-3.5 h-3.5" />
                    </button>
                    <button class="btn btn-xs h-7 border-none rounded-lg bg-primary text-white hover:bg-primary/90 text-[11px] px-2.5">1</button>
                    <button class="btn btn-xs h-7 border-none rounded-lg bg-white text-neutral-600 hover:bg-base-100 text-[11px] px-2.5">2</button>
                    <button class="btn btn-xs h-7 border-none rounded-lg bg-white text-neutral-600 hover:bg-base-100 text-[11px] px-2.5">3</button>
                    <button class="btn btn-xs h-7 bg-white border-none rounded-lg text-neutral-600 hover:bg-base-100">
                      <ChevronRight class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Card: Detail Transaksi -->
      <div class="card bg-white border border-base-200 shadow-sm">
        <div class="card-body p-6">
          <div class="flex items-center gap-3 border-b border-base-100 pb-4 mb-6">
            <FileText class="w-5 h-5 text-neutral-800" />
            <h3 class="font-semibold text-neutral-800">Detail Transaksi</h3>
          </div>

          <!-- Tabs and Tools -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div class="flex border-b border-base-200 w-full md:w-auto">
              <button 
                @click="activeTab = 'layanan'"
                :class="['px-6 py-2.5 text-sm font-semibold transition-all border-b-2', activeTab === 'layanan' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
              >
                Layanan Terdaftar
              </button>
              <button 
                @click="activeTab = 'poin'"
                :class="['px-6 py-2.5 text-sm font-semibold transition-all border-b-2', activeTab === 'poin' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
              >
                Pendapatan Poin
              </button>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <div class="relative w-full md:w-72">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="text" placeholder="Search" class="input input-sm h-10 w-full pl-9 bg-base-100 border-base-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-xs" />
              </div>
              <button class="btn btn-outline border-base-300 text-neutral-600 btn-sm h-10 px-0 w-10 min-w-0 rounded-lg hover:bg-base-200 hover:text-neutral-800 transition-colors">
                <ListFilter class="w-4 h-4 text-primary mx-auto" />
              </button>
            </div>
          </div>

          <!-- Services Table -->
          <div v-show="activeTab === 'layanan'">
            <DataTable flat>
              <template #header>
                <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
                  <tr>
                    <th v-for="col in serviceColumns" :key="col.key" class="border-r border-base-200 font-semibold py-3 text-[13px]">
                      <div class="flex items-center justify-between">
                        {{ col.label }}
                        <div class="flex flex-col -space-y-1 opacity-20">
                          <ChevronUp class="w-3 h-3" />
                          <ChevronDown class="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
              </template>
              <template #body>
                <tbody class="text-[13px] text-neutral-600">
                  <tr v-for="(item, index) in services" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium">
                    <td class="py-3 border-r border-base-200 text-primary">{{ item.name }}</td>
                    <td class="py-3 border-r border-base-200 text-neutral-500">{{ item.activeDate }}</td>
                    <td class="py-3 border-r border-base-200 text-neutral-500">{{ item.period }}</td>
                    <td class="py-3 text-center">
                      <div :class="['badge border-none font-semibold text-[10px] rounded-lg', getStatusClass(item.status)]">
                        {{ item.status }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </DataTable>
          </div>

          <!-- Points Table -->
          <div v-show="activeTab === 'poin'">
            <DataTable flat>
              <template #header>
                <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
                  <tr>
                    <th v-for="col in pointColumns" :key="col.key" class="border-r border-base-200 font-semibold py-3 text-[13px]">
                      <div class="flex items-center justify-between">
                        {{ col.label }}
                        <div class="flex flex-col -space-y-1 opacity-20">
                          <ChevronUp class="w-3 h-3" />
                          <ChevronDown class="w-3 h-3" />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
              </template>
              <template #body>
                <tbody class="text-[13px] text-neutral-600">
                  <tr v-for="(item, index) in points" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                    <td class="py-3 border-r border-base-200 text-neutral-500">{{ item.date }}</td>
                    <td class="py-3 border-r border-base-200 text-neutral-500">{{ item.points }}</td>
                    <td class="py-3 border-r border-base-200 text-neutral-500">{{ item.type }}</td>
                    <td class="py-3 border-r border-base-200 text-primary">{{ item.service }}</td>
                    <td class="py-3 text-neutral-500">Rp. {{ item.price.toLocaleString('id-ID') }}</td>
                  </tr>
                </tbody>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, History, Package, MapPin, Users, 
  Calendar, Hash, Mail, Phone, Briefcase, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  FileText, Search, ListFilter
} from 'lucide-vue-next'
import { ref } from 'vue'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

const activeTab = ref('layanan')

const serviceColumns = [
  { label: 'Nama Layanan', key: 'name' },
  { label: 'Tanggal Aktif', key: 'date' },
  { label: 'Periode Berlangganan', key: 'period' },
  { label: 'Status', key: 'status' }
]

const services = [
  { name: 'Nusanet Broadband Business EDGE100', activeDate: '28/10/2025', period: 'Okt 2025 - Sep 2026', status: 'Free' },
  { name: 'Nusanet Broadband Business EDGE200', activeDate: '01/08/2025', period: 'Agu 2025 - Agu 2025', status: 'Aktif' },
  { name: 'Nusanet Broadband Business EDGE300', activeDate: '18/09/2025', period: 'Sep 2025 - Agu 2026', status: 'Aktif' },
  { name: 'Nusanet Dedicated Business NOVA90', activeDate: '12/06/2025', period: 'Jun 2025 - Mei 2026', status: 'Tidak Aktif' },
  { name: 'Nusanet Dedicated Business NOVA280', activeDate: '08/09/2025', period: 'Sep 2025 - Sep 2025', status: 'Block' }
]

const pointColumns = [
  { label: 'Tanggal Didapatkan', key: 'date' },
  { label: 'Poin Didapatkan', key: 'points' },
  { label: 'Tipe Poin', key: 'type' },
  { label: 'Nama Layanan', key: 'service' },
  { label: 'Harga Layanan', key: 'price' }
]

const points = [
  { date: '30/12/2025', points: 390, type: 'OTP', service: 'Nusanet Broadband Business EDGE100', price: 1500000 },
  { date: '30/12/2025', points: 213, type: 'OTP', service: 'Nusanet Broadband Business EDGE200', price: 1500000 },
  { date: '28/12/2025', points: 542, type: 'Bulanan', service: 'Nusanet Broadband Business EDGE300', price: 1500000 },
  { date: '20/12/2025', points: 332, type: 'OTP', service: 'Nusanet Dedicated Business NOVA90', price: 1500000 },
  { date: '28/11/2025', points: 542, type: 'Bulanan', service: 'Nusanet Broadband Business EDGE300', price: 1500000 }
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Free': return 'bg-yellow-100 text-yellow-600'
    case 'Aktif': return 'bg-accent text-primary'
    case 'Tidak Aktif': return 'bg-red-100 text-red-500'
    case 'Block': return 'bg-purple-100 text-purple-600'
    default: return 'bg-neutral-100 text-neutral-500'
  }
}
</script>