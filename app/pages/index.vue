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
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">{{ statisticCount?.customer?.value ?? '-' }}</h3>
            <div v-if="statisticCount?.customer" class="flex items-center gap-1 mt-4 text-xs font-medium" :class="statisticCount.customer.achievement.isUp ? 'text-primary' : 'text-error'">
              <component :is="statisticCount.customer.achievement.isUp ? ArrowUpRight : ArrowDownRight" class="w-3.5 h-3.5" />
              <span>{{ statisticCount.customer.achievement.percentage }}% dari bulan lalu</span>
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
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">{{ statisticCount?.point?.value ?? '-' }}</h3>
            <div v-if="statisticCount?.point" class="flex items-center gap-1 mt-4 text-xs font-medium" :class="statisticCount.point.achievement.isUp ? 'text-primary' : 'text-error'">
              <component :is="statisticCount.point.achievement.isUp ? ArrowUpRight : ArrowDownRight" class="w-3.5 h-3.5" />
              <span>{{ statisticCount.point.achievement.percentage }}% dari bulan lalu</span>
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
            <h3 class="text-3xl font-semibold mt-2 text-neutral-800">{{ statisticCount?.customerService?.value ?? '-' }}</h3>
            <div v-if="statisticCount?.customerService" class="flex items-center gap-1 mt-4 text-xs font-medium" :class="statisticCount.customerService.achievement.isUp ? 'text-primary' : 'text-error'">
              <component :is="statisticCount.customerService.achievement.isUp ? ArrowUpRight : ArrowDownRight" class="w-3.5 h-3.5" />
              <span>{{ statisticCount.customerService.achievement.percentage }}% dari bulan lalu</span>
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
            <select v-model="selectedType" class="select select-bordered select-sm w-full max-w-xs rounded-lg bg-base-100 text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs">
              <option value="yearly">Tahun Ini</option>
              <option value="monthly">Bulan Ini</option>
            </select>
          </div>
          
          <div class="w-full">
            <AreaChart
              :data="AreaChartData"
              :height="280"
              :categories="categories"
              :y-num-ticks="5"
              :x-num-ticks="AreaChartData.length"
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
            <NuxtLink to="/service" class="btn btn-ghost btn-circle btn-sm text-primary transition-colors hover:bg-primary/10">
              <ArrowUpRight class="w-5 h-5" />
            </NuxtLink>
          </div>
          
          <div class="flex flex-col gap-1 mt-2 flex-1 ">
            <div v-for="(svc, idx) in topServices" :key="idx" class="flex items-center gap-4 py-2 border-b border-base-200 last:border-0">
              <div :class="['w-9 h-9 rounded-sm flex items-center justify-center font-semibold text-lg shadow', svc.rankClass]">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate" :title="svc.name">{{ svc.name }}</p>
                <p class="text-xs text-neutral-500">{{ svc.customers }} Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-sm">{{ svc.points.toLocaleString('id-ID') }}</p>

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
      :current-sort="recentSort"
      :current-order="recentOrder"
      :loading="recentStatus === 'pending'"
      :is-empty="recentCustomers.length === 0"
      @update:sort="recentSort = $event"
      @update:order="recentOrder = $event"
    >
      <template #title-action>
        <DataFilter 
          :is-filter-active="isFilterActive"
          :align="'end'"
          @apply="applyFilters"
          @reset="resetFilters"
          @cancel="cancelFilters"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-neutral-400 text-xs font-medium">Periode Registarasi</span>
              <span @click="periodDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
            </div>
            <select v-model="periodDate" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium bg-white border-base-300 focus:outline-none focus:border-primary">
              <option value="">Semua Periode</option>
              <option value="today">Hari Ini</option>
              <option value="7_days">7 Hari Terakhir</option>
              <option value="30_days">30 Hari Terakhir</option>
              <option value="this_month">Bulan Ini</option>
            </select>
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-neutral-400 text-xs font-medium">Tipe Poin</span>
              <span @click="rewardType = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
            </div>
            <MultiSelect 
              v-model="rewardType" 
              :options="rewardTypeOptions" 
              labelKey="name"
              valueKey="name"
              placeholder="Semua Tipe Poin" 
              searchable
            />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-neutral-400 text-xs font-medium">Layanan</span>
              <span @click="serviceCode = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
            </div>
            <MultiSelect 
              v-model="serviceCode" 
              :options="serviceOptions" 
              labelKey="name"
              valueKey="code"
              placeholder="Semua Layanan" 
              searchable
            />
          </div>
        </DataFilter>
      </template>

      <template #body="{ isColumnVisible }">
        <tbody class="text-sm text-neutral-600">
          <tr v-for="(item, index) in recentCustomers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
            <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary max-w-[250px] truncate" :title="item.service.name">
              <NuxtLink :to="`/service/${item.service.code}`" class="hover:underline">{{ item.service.name }}</NuxtLink>
            </td>
            <td v-show="isColumnVisible('customerId')" class="text-primary/80 font-medium border-r border-base-200" :title="item.customerId">
              <NuxtLink :to="`/customer/${item.customerId}`" class="hover:underline">{{ item.customerId }}</NuxtLink>
            </td>
            <td v-show="isColumnVisible('registrationDate')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateShort(item.registrationDate) }}</td>
            <td v-show="isColumnVisible('period')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">
              {{ formatDate(item.startDate) }}
              <span v-if="item.endDate"> - {{ formatDate(item.endDate) }}</span>
            </td>
            <td v-show="isColumnVisible('status')" class=" border-r border-base-200">
              <div :class="['badge border-none font-medium text-xs rounded-full', getStatusClass(item.status)]">{{ item.status }}</div>
            </td>
            <td v-show="isColumnVisible('latestReward.type')" >{{ item.latestReward?.type ?? '-' }}</td>
            <td v-show="isColumnVisible('latestReward.point')" >{{ item.latestReward?.point ?? '-' }}</td>
          </tr>
        </tbody>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { Users, HandCoins, Box, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { serviceService } from '~/services/service-service'
import { statisticService } from '~/services/statistic-service'
import { additionalService } from '~/services/additional-service'
import { formatDate, formatDateShort, toISODate } from '~/utils/date'
import { getStatusClass } from '~/utils/status'
import type { AdditionalItem } from '~/types/additional'

useSeoMeta({
  title: 'Kawan Nusa | Dashboard',
})

const { state: authState } = useAuth()

const { data: statisticCountResponse } = useAsyncData(
  'statistic-count',
  () => statisticService.getCount()
)

const statisticCount = computed(() => statisticCountResponse.value?.data)

const { data: topServicesResponse } = useAsyncData(
  'top-services',
  () => serviceService.getServices({ sort: 'totalPoint', order: 'desc', limit: 5 })
)

const rankClasses = [
  'bg-[#2b7c41] text-white',
  'bg-primary text-white',
  'bg-[#73c847] text-white',
  'bg-[#a6e267] text-neutral-800',
  'bg-[#d9f5a8] text-neutral-800'
]

const topServices = computed(() => {
  return (topServicesResponse.value?.data || []).map((service, index) => ({
    name: service.name,
    customers: service.totalCustomerServices,
    points: service.totalPoint,
    rankClass: rankClasses[index] || 'bg-neutral-100 text-neutral-500'
  }))
})


const recentCustomerColumns = [
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'ID Pelanggan', key: 'customerId', sortable: true },
  { label: 'Tanggal Registarasi', key: 'registrationDate', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Tipe Poin', key: 'latestReward.type', sortable: true },
  { label: 'Poin Didapatkan', key: 'latestReward.point', sortable: true },
]

const recentCustomers = computed(() => recentCustomerServicesResponse.value?.data || [])

const rewardTypeOptions = ref<AdditionalItem[]>([])
const serviceOptions = ref<AdditionalItem[]>([])

const periodDate = ref('')
const startDate = ref('')
const endDate = ref('')
const rewardType = ref<string[]>([])
const serviceCode = ref<string[]>([])

const appliedFilters = ref({
  startDate: '',
  endDate: '',
  rewardType: [] as string[],
  serviceCode: [] as string[]
})

const isFilterActive = computed(() => {
  return appliedFilters.value.startDate !== '' || 
         appliedFilters.value.endDate !== '' || 
         appliedFilters.value.rewardType.length > 0 || 
         appliedFilters.value.serviceCode.length > 0
})

watch(periodDate, (newVal) => {
  const now = new Date()
  if (newVal === 'today') {
    startDate.value = toISODate(now)
    endDate.value = toISODate(now)
  } else if (newVal === '7_days') {
    const start = new Date()
    start.setDate(now.getDate() - 7)
    startDate.value = toISODate(start)
    endDate.value = toISODate(now)
  } else if (newVal === '30_days') {
    const start = new Date()
    start.setDate(now.getDate() - 30)
    startDate.value = toISODate(start)
    endDate.value = toISODate(now)
  } else if (newVal === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    startDate.value = toISODate(start)
    endDate.value = toISODate(now)
  } else {
    startDate.value = ''
    endDate.value = ''
  }
})

const applyFilters = () => {
  appliedFilters.value = {
    startDate: startDate.value,
    endDate: endDate.value,
    rewardType: [...rewardType.value],
    serviceCode: [...serviceCode.value]
  }
}

const resetFilters = () => {
  periodDate.value = ''
  rewardType.value = []
  serviceCode.value = []
  applyFilters()
}

const cancelFilters = () => {
  // We need to figure out which period matches the current startDate/endDate
  // for visual consistency, but for now we'll just keep it simple.
  // Ideally we'd store the appliedPeriod.
  rewardType.value = [...appliedFilters.value.rewardType]
  serviceCode.value = [...appliedFilters.value.serviceCode]
}

const recentSort = ref('registrationDate')
const recentOrder = ref<'asc' | 'desc'>('desc')

const { data: recentCustomerServicesResponse, status: recentStatus } = useAsyncData(
  'recent-customer-services',
  () => serviceService.getCustomerServices({ 
    sort: recentSort.value, 
    order: recentOrder.value, 
    limit: 5,
    startDate: appliedFilters.value.startDate || undefined,
    endDate: appliedFilters.value.endDate || undefined,
    type: appliedFilters.value.rewardType.length > 0 ? appliedFilters.value.rewardType : undefined,
    serviceCode: appliedFilters.value.serviceCode.length > 0 ? appliedFilters.value.serviceCode : undefined
  }),
  { watch: [recentSort, recentOrder, appliedFilters] }
)

const fetchOptions = async () => {
  const [servicesRes, rewardTypesRes] = await Promise.all([
    additionalService.getServices(),
    additionalService.getRewardPointTypes()
  ])
  if (servicesRes.success) {
    serviceOptions.value = servicesRes.data
  }
  if (rewardTypesRes.success) {
    rewardTypeOptions.value = rewardTypesRes.data
  }
}

onMounted(() => {
  fetchOptions()
})

const selectedType = ref<'monthly' | 'yearly'>('yearly')

const { data: customerStatisticResponse } = useAsyncData(
  'customer-statistic',
  () => statisticService.getCustomerStatistic(selectedType.value),
  { watch: [selectedType] }
)

const AreaChartData = computed(() => {
  return (customerStatisticResponse.value?.data || []).map(item => ({
    month: item.label,
    growth: item.count
  }))
})

const categories = {
  growth: { name: 'Customer', color: '#24960F' }
}

const xFormatter = (tick: number) => {
  return AreaChartData.value[tick]?.month || ''
}
</script>
