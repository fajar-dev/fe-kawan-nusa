<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Point Saya</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              This is a clever description about Poin Saya
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-9 h-full">
                <AreaChart
                :data="AreaChartData"
                :height="400"
                :categories="categories"
                :y-num-ticks="5"
                :x-num-ticks="7"
                :y-grid-line="true"
                :hide-legend="true"
                :x-formatter="xFormatter"
                :curve-type="CurveType.Linear"
                />
            </div>
            <div class="lg:col-span-3 h-full">
                <div class="card bg-white border border-base-200">
                    <div class="card-body">
                        <h1 class="text-neutral-700 font-medium flex gap-2">
                        <Coins class="w-5 h-5 text-primary" />
                        Total Point Saya</h1>
                        <div class="flex items-center gap-2">
                            <span class="text-neutral-800 font-medium text-3xl">1874</span>
                            <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
                        </div>
                        <button class="btn btn-primary btn-sm rounded-lg text-sm h-8 w-full mt-3">
                            Tarik Point
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-6 w-full">
        <!-- Table Section -->
        <DataTable flat>
        <!-- Filters Slot -->
        <template #filters>
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <!-- Filter Dropdown -->
            <div class="dropdown dropdown-bottom md:dropdown-start">
                <div tabindex="0" role="button" class="btn btn-outline border-base-300 text-neutral-600 btn-sm h-10 px-4 gap-2 rounded-lg hover:bg-base-200 hover:text-neutral-800 transition-colors w-full md:w-auto">
                <ListFilter class="w-4 h-4 text-primary" />
                Filter
                </div>
                <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[450px] shadow-xl border border-base-200 mt-2 left-0 md:left-auto">
                <div class="card-body p-0">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-base-200">
                    <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                    <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                    </div>
                    
                    <!-- Content -->
                    <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
                    <!-- Tanggal Aktif -->
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                        <span class="text-neutral-400 text-xs font-medium">Tanggal Aktif</span>
                        <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-xs font-medium text-neutral-800">Dari:</label>
                            <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                            <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                        </div>
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                        <span class="text-neutral-400 text-xs font-medium">Status</span>
                        <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                        </div>
                        <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                        <option selected disabled>Semua Status</option>
                        <option>Aktif</option>
                        <option>Dihentikan</option>
                        </select>
                    </div>
                    </div>

                    <!-- Footer -->
                    <div class="p-4 border-t border-base-200 flex items-center justify-between">
                    <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">
                        Atur Ulang
                    </button>
                    <button class="btn bg-primary border-none text-white hover:bg-primary/90 btn-sm rounded-lg text-sm font-semibold h-10 px-6">
                        Terapkan
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <div class="flex items-center gap-2 w-full md:w-auto">
                <div class="relative flex-1 md:w-64">
                <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                    type="text" 
                    placeholder="Cari Layanan..." 
                    class="input input-bordered w-full pl-10 bg-white border-base-300 rounded-lg focus:outline-none focus:border-primary text-sm h-10"
                />
                </div>
                <button class="btn btn-ghost btn-sm h-10 w-10 p-0 text-neutral-400 hover:bg-base-200 rounded-lg border border-base-300">
                <Columns2 class="w-5 h-5" />
                </button>
            </div>
            </div>
        </template>

        <!-- Table Header -->
        <template #header>
            <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
            <tr>
                <th v-for="col in columns" :key="col.key" class="border-r border-base-200 font-medium py-3">
                <div class="flex items-center justify-between">
                    {{ col.label }}
                    <div class="flex flex-col -space-y-1 opacity-40">
                    <ChevronUp class="w-3.5 h-3.5" />
                    <ChevronDown class="w-3.5 h-3.5" />
                    </div>
                </div>
                </th>
            </tr>
            </thead>
        </template>

        <!-- Table Body -->
        <template #body>
            <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in services" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
                <td class="text-primary font-medium py-3 border-r border-base-200 ps-4">{{ item.name }}</td>
                <td class="py-3 border-r border-base-200 ps-4">{{ item.lastRef }}</td>
                <td class="py-3 border-r border-base-200 text-center px-4">
                <div :class="[
                    'badge border-none font-semibold text-[12px] rounded-lg w-full py-3',
                    item.status === 'Aktif' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                ]">
                    {{ item.status }}
                </div>
                </td>
                <td class="py-3 border-r border-base-200 ps-4">{{ item.points }}</td>
                <td class="py-3 text-primary font-medium ps-4">{{ item.customers }}</td>
            </tr>
            </tbody>
        </template>
        </DataTable>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, CircleHelp, ListFilter, Search, Columns2, 
  ChevronUp, ChevronDown, Calendar, X, 
  Package,
  Coins
} from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-white'
})

const columns = [
  { label: 'Nama Layanan', key: 'name' },
  { label: 'Referensi Terakhir', key: 'lastRef' },
  { label: 'Status Layanan', key: 'status' },
  { label: 'Poin Didapatkan', key: 'points' },
  { label: 'Pelanggan Anda', key: 'customers' }
]

const services = [
  { name: 'Nusanet Broadband Business EDGE100', lastRef: '28/12/2025', status: 'Aktif', points: 5678, customers: 99 },
  { name: 'Nusanet Broadband Business EDGE200', lastRef: '28/12/2025', status: 'Aktif', points: 2231, customers: 54 },
  { name: 'Nusanet Broadband Business EDGE300', lastRef: '28/12/2025', status: 'Aktif', points: 2332, customers: 21 },
  { name: 'Nusanet Dedicated Business NOVA90', lastRef: '28/12/2025', status: 'Aktif', points: 4321, customers: 14 },
  { name: 'Nusanet Dedicated Business NOVA280', lastRef: '28/12/2025', status: 'Aktif', points: 3384, customers: 12 },
  { name: 'Nusafiber Selecta Basic 30', lastRef: '28/12/2025', status: 'Aktif', points: 831, customers: 3 },
  { name: 'Nusafiber Selecta Prime 100', lastRef: '22/12/2025', status: 'Aktif', points: 400, customers: 1 },
  { name: 'Nusafiber Selecta Prime 200', lastRef: '22/12/2025', status: 'Aktif', points: 1210, customers: 5 },
  { name: 'Google Workspace Starter', lastRef: '22/12/2025', status: 'Aktif', points: 4712, customers: 33 },
  { name: 'Google Workspace Business', lastRef: '22/12/2025', status: 'Aktif', points: 3942, customers: 12 },
  { name: 'Nusawork Business', lastRef: '22/12/2025', status: 'Dihentikan', points: 763, customers: 3 },
  { name: 'Nusawork Advance', lastRef: '22/12/2025', status: 'Dihentikan', points: 100, customers: 1 }
]


interface AreaChartItem {
  month: string
  growth: number
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', growth: 186 },
  { month: 'February', growth: 305 },
  { month: 'March', growth: 237 },
  { month: 'April', growth: 73 },
  { month: 'May', growth: 209 },
  { month: 'June', growth: 214 }
]

const categories = {
  growth: { name: 'Pertumbuhan', color: '#24960F' }
}

const xFormatter = (tick: number): string => {
  return AreaChartData[tick]?.month || ''
}
</script>
