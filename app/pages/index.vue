<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- Welcome Banner -->
    <div class="card bg-base-100 shadow-xs border border-base-200 w-full rounded-lg">
      <div class="card-body p-6 lg:p-8">
        <h2 class="text-xl font-semibold text-neutral-800 md:text-2xl">Selamat Datang, {{ authState.user?.firstName }} {{ authState.user?.lastName }} 👋</h2>
        <p class="text-neutral-500 mt-1">Berikut adalah ringkasan aktivitas referral Anda</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div class="card bg-base-100 shadow-xs border border-base-200 rounded-lg">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Total Pelanggan</p>
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">320</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <Users class="w-8 h-8" />
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xs border border-base-200 rounded-lg">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Total Poin Aktif</p>
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">18876</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <HandCoins class="w-8 h-8" />
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xs border border-base-200 rounded-lg">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Layanan Direferensikan</p>
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">24</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <Box class="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <div class="card bg-base-100 shadow-xs border border-base-200 lg:col-span-2 rounded-lg">
        <div class="card-body p-6">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div>
              <h3 class="font-semibold text-lg text-neutral-800">Pertumbuhan Pelanggan</h3>
              <p class="text-neutral-500 text-sm">Grafik pertumbuhan pelanggan bulan ini</p>
            </div>
            <select class="select select-bordered select-sm w-full max-w-xs rounded-lg bg-base-100 text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs">
              <option disabled selected>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div class="w-full">
            <AreaChart
              :data="AreaChartData"
              :height="280"
              :categories="categories"
              :y-num-ticks="5"
              :x-num-ticks="7"
              :y-grid-line="true"
              :hide-legend="true"
              :x-formatter="xFormatter"
              :curve-type="CurveType.Linear"
            />
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xs border border-base-200 rounded-lg">
        <div class="card-body p-6 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-lg text-neutral-800">Layanan Teratas</h3>
              <p class="text-neutral-500 text-sm">Berdasarkan total poin yang diperoleh</p>
            </div>
            <button class="btn btn-ghost btn-circle btn-sm text-primary transition-colors hover:bg-primary/10">
              <ArrowUpRight class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex flex-col gap-1 mt-2 flex-1 justify-between">
            <div v-for="(svc, idx) in topServices" :key="idx" class="flex items-center gap-4 py-2 border-b border-base-200 last:border-0">
              <div :class="['w-9 h-9 rounded-sm flex items-center justify-center font-semibold text-lg shadow', svc.rankClass]">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">{{ svc.name }}</p>
                <p class="text-xs text-neutral-500">{{ svc.customers }} Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-sm">{{ svc.points }}</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Recent Users -->
    <DataTable 
      title="Pelanggan Terbaru" 
      description="Daftar pelanggan yang baru terdaftar"
      :columns="recentCustomerColumns"
      :show-search="false"
      :show-column-toggle="false"
    >
      <template #title-action>
        <NuxtLink to="/customer" class="btn btn-ghost btn-sm text-primary text-sm font-medium hover:bg-primary/10 group">
          <span class="hidden sm:inline">Lihat Semua</span>
          <ArrowUpRight class="w-5 h-5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </NuxtLink>
      </template>

      <template #body="{ isColumnVisible }">
        <tbody class="text-sm text-neutral-600">
          <tr v-for="(item, index) in recentCustomers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
            <td v-show="isColumnVisible('id')" class="text-primary/80 font-medium py-2 border-r border-base-200">{{ item.id }}</td>
            <td v-show="isColumnVisible('registrationDate')" class="py-2 border-r border-base-200">{{ item.registrationDate }}</td>
            <td v-show="isColumnVisible('lastPayment')" class="py-2 border-r border-base-200">{{ item.lastPayment }}</td>
            <td v-show="isColumnVisible('subscriptionPeriod')" class="py-2 border-r border-base-200">{{ item.subscriptionPeriod }}</td>
            <td v-show="isColumnVisible('status')" class="py-2 border-r border-base-200">
              <div class="badge bg-accent border-none text-primary font-bold text-[10px] py-1 px-3 rounded-full">{{ item.status }}</div>
            </td>
            <td v-show="isColumnVisible('salesName')" class="py-2">{{ item.salesName }}</td>
          </tr>
        </tbody>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { Users, HandCoins, Box, ArrowUpRight } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { state: authState } = useAuth()

const recentCustomerColumns = [
  { label: 'ID Pelanggan', key: 'id' },
  { label: 'Tanggal Registrasi', key: 'registrationDate' },
  { label: 'Pembayaran Terakhir', key: 'lastPayment' },
  { label: 'Periode Berlangganan', key: 'subscriptionPeriod' },
  { label: 'Status', key: 'status' },
  { label: 'Nama AM', key: 'salesName' }
]

const recentCustomers = [
  { id: '02001653518', registrationDate: '28/03/2026', lastPayment: '27/12/2027', subscriptionPeriod: '27/12/2028', status: 'Aktif', salesName: 'Jaya Gharaj' },
  { id: '02001267400', registrationDate: '11/03/2026', lastPayment: '27/12/2027', subscriptionPeriod: '27/12/2028', status: 'Aktif', salesName: 'Jaka Panggabean' },
  { id: '02001651535', registrationDate: '10/03/2026', lastPayment: '27/12/2027', subscriptionPeriod: '27/12/2028', status: 'Aktif', salesName: 'Mauliddana Putra' },
  { id: '02001487443', registrationDate: '12/02/2026', lastPayment: '28/12/2027', subscriptionPeriod: '12/06/2028', status: 'Aktif', salesName: 'Nicholas Simbolon' },
  { id: '02001651532', registrationDate: '01/02/2026', lastPayment: '28/12/2027', subscriptionPeriod: 'Sep 2028 - Sep 2028', status: 'Aktif', salesName: 'Mauliddana Putra' }
]

const topServices = [
  { name: 'Nusanet Broadband Business...', customers: 99, points: 5678, rankClass: 'bg-[#2b7c41] text-white' },
  { name: 'Google Workspace Starter', customers: 48, points: 4712, rankClass: 'bg-primary text-white' },
  { name: 'Nusanet Dedicated Business...', customers: 34, points: 4321, rankClass: 'bg-[#73c847] text-white' },
  { name: 'Google Workspace Business', customers: 20, points: 3942, rankClass: 'bg-[#a6e267] text-neutral-800' },
  { name: 'Nusanet Dedicated Business...', customers: 24, points: 3384, rankClass: 'bg-[#d9f5a8] text-neutral-800' }
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
