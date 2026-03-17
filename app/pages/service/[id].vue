<template>
  <div class="space-y-6">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex flex-col gap-1 w-full">
        <div class="flex items-start gap-4">
          <div class="flex flex-col w-full">
            <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-semibold text-neutral-800">Nusanet Dedicated Business NOVA90</h1>
                <CircleHelp class="w-5 h-5 text-neutral-400 cursor-pointer hover:text-primary transition-colors shrink-0" />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[10px] text-neutral-600">
                  <History class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Terakhir Direferensikan: <span class="font-semibold">27 Mei 2025</span></span>
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] text-primary font-semibold">
                  <Users class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">73 Customer Aktif</span>
                </div>
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-medium tracking-wider mt-1 lg:mt-1.5">
              <NuxtLink to="/" class="text-primary hover:underline font-semibold">Beranda</NuxtLink> / 
              <NuxtLink to="/service" class="text-primary hover:underline font-semibold">Produk dan Layanan</NuxtLink> / 
              <span class="text-neutral-500">Nusanet Dedicated Business NOVA90</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Top: Detail Layanan (4 columns) -->
        <div class="lg:col-span-4 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6 pb-2">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <h3 class="font-semibold text-neutral-800">Detail Layanan</h3>
              </div>
            </div>
            <div class="card-body p-6 pt-0 flex flex-col gap-5 ps-6">
              <div class="space-y-5">
                <!-- Deskripsi -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Deskripsi</span>
                  <p class="text-sm text-neutral-800 font-medium leading-relaxed">
                    Stabilitas, daya tahan (durability), dan backup redundancy Internet + sistem failover (dual WAN). Untuk bisnis yang tidak boleh down & butuh keandalan jangka panjang.
                  </p>
                </div>
                
                <!-- Tipe Layanan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Tipe Layanan</span>
                  <span class="text-[13px] text-neutral-800 font-semibold">Jasa</span>
                </div>

                <!-- Status Layanan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Status Layanan</span>
                  <span class="text-[13px] text-neutral-800 font-semibold">Aktif</span>
                </div>

                <!-- Jumlah Berlangganan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Jumlah Berlangganan</span>
                  <span class="text-[13px] text-neutral-800 font-semibold">99 pelanggan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom: Detail Berlangganan (12 columns) -->
        <div class="lg:col-span-12">
          <div class="card bg-white border border-base-200">
            <div class="card-body p-6">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                  <FileText class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800">Detail Berlangganan</h3>
                </div>

                <div class="flex items-center gap-3 w-full md:w-auto">
                  <div class="relative flex-1 md:w-64">
                    <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Cari Layanan..." 
                        class="input input-bordered w-full pl-10 bg-white border-base-300 rounded-lg focus:outline-none focus:border-primary text-sm h-10"
                    />
                </div>
                  <button class="btn btn-outline border-base-300 text-neutral-600 btn-sm h-10 px-0 w-10 min-w-0 rounded-lg hover:bg-base-200 transition-colors">
                    <ListFilter class="w-4 h-4 text-primary mx-auto" />
                  </button>
                </div>
              </div>

              <!-- Subscriptions Table -->
              <DataTable flat>
                <template #header>
                  <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
                    <tr>
                      <th v-for="col in columns" :key="col.key" class="border-r border-base-200 font-semibold py-3 text-[13px] last:border-r-0">
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
                  <tbody class="text-[13px] text-neutral-600 border-x border-base-200">
                    <tr v-for="(item, index) in subscriptions" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                      <td class="py-3 border-r border-base-200 text-primary font-semibold ps-4">{{ item.id }}</td>
                      <td class="py-3 border-r border-base-200 text-neutral-500 ps-4">{{ item.regDate }}</td>
                      <td class="py-3 border-r border-base-200 text-neutral-500 ps-4">{{ item.lastPayment }}</td>
                      <td class="py-3 border-r border-base-200 text-neutral-500 ps-4">{{ item.period }}</td>
                      <td class="py-3 border-r border-base-200 text-center px-4">
                        <div :class="['badge border-none font-semibold text-[10px] rounded-lg w-full py-2.5', getStatusClass(item.status)]">
                          {{ item.status }}
                        </div>
                      </td>
                      <td class="py-3 ps-4">{{ item.am }}</td>
                    </tr>
                  </tbody>
                </template>
              </DataTable>
            </div>
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
  FileText, Search, ListFilter, Tag, Info
} from 'lucide-vue-next'
import { ref } from 'vue'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

const columns = [
  { label: 'ID Pelanggan', key: 'id' },
  { label: 'Tanggal Registrasi', key: 'regDate' },
  { label: 'Pembayaran Terak...', key: 'lastPayment' },
  { label: 'Periode Berlangga...', key: 'period' },
  { label: 'Status', key: 'status' },
  { label: 'Nama AM', key: 'am' }
]

const subscriptions = [
  { id: '02001653518', regDate: '28/12/2023', lastPayment: '27/12/2024', period: '27/12/2025', status: 'Aktif', am: 'Jaya Gharaj' },
  { id: '02001267400', regDate: '28/12/2023', lastPayment: '27/12/2024', period: '27/12/2025', status: 'Aktif', am: 'Jaka Panggabean' },
  { id: '02001651535', regDate: '28/12/2023', lastPayment: '27/12/2025', period: '27/12/2026', status: 'Aktif', am: 'Mauliddana Putra' },
  { id: '02001487443', regDate: '28/12/2023', lastPayment: '28/12/2025', period: '12/06/2026', status: 'Block', am: 'Nicholas Simbolon' },
  { id: '02001651532', regDate: '28/12/2020', lastPayment: '28/12/2020', period: 'Sep 2021 - Sep 2021', status: 'Tidak Aktif', am: 'Mauliddana Putra' }
]

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Aktif': return 'bg-primary/10 text-primary'
    case 'Tidak Aktif': return 'bg-red-50 text-red-500'
    case 'Block': return 'bg-purple-50 text-purple-500'
    default: return 'bg-neutral-100 text-neutral-500'
  }
}
</script>
