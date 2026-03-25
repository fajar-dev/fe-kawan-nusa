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
              Ringkasan perolehan dan penarikan poin referral Anda
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
            :x-num-ticks="AreaChartData.length"
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
                Total Point Saya
              </h1>
              <div class="flex items-center gap-2">
                <span class="text-neutral-800 font-medium text-3xl">{{ totalPoints.toLocaleString('id-ID') }}</span>
                <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Jumlah poin yang anda hasilkan akan diperbaharui pada tanggal 15 setiap bulannya.">

                  <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
                </div>
              </div>
              <button 
                @click="isWithdrawModalOpen = true"
                class="btn btn-primary btn-sm rounded-lg text-sm h-8 w-full mt-3 font-semibold"
              >
                Tarik Poin
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalWithdraw v-model="isWithdrawModalOpen" @success="refreshData" />

      <div class="flex flex-col gap-6 w-full pt-10">
        <!-- Tabs Section -->
        <div class="flex items-center gap-8 border-b border-base-200">
          <button 
            @click="activeTab = 'reward'"
            :class="[
              'pb-3 font-medium transition-all relative',
              activeTab === 'reward' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800'
            ]"
          >
            Poin Masuk
            <div v-if="activeTab === 'reward'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </button>
          <button 
            @click="activeTab = 'withdrawn'"
            :class="[
              'pb-3 font-medium transition-all relative',
              activeTab === 'withdrawn' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800'
            ]"
          >
            Sudah Ditarik
            <div v-if="activeTab === 'withdrawn'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </button>
        </div>

        <!-- Reward Table -->
        <DataTable 
          v-if="activeTab === 'reward'"
          flat 
          :columns="currentColumns"
          :loading="rewardLoading"
          :is-empty="!rewardLoading && rewards.length === 0"
          v-model:search-query="searchQuery"
          :total-from="rewardMeta?.from"
          :total-to="rewardMeta?.to"
          :total-entries="rewardMeta?.total"
          :current-page="rewardPage"
          :last-page="rewardMeta?.lastPage"
          :current-sort="rewardSort"
          :current-order="rewardOrder"
          @update:page="rewardPage = $event"
          @update:sort="rewardSort = $event"
          @update:order="rewardOrder = $event"
        >
          <template #filters>
            <DataFilter 
              :is-filter-active="isFilterActive"
              @apply="applyFilters"
              @reset="resetFilters"
              @cancel="cancelFilters"
            >
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-neutral-400 text-xs font-medium">Tanggal</span>
                  <span @click="startDate = ''; endDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-neutral-800">Dari:</label>
                    <input v-model="startDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                    <input v-model="endDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                  </div>
                </div>
              </div>
            </DataFilter>
          </template>

          <template #body="{ isColumnVisible }">
            <tbody class="text-sm text-neutral-600">
              <tr v-for="(item, index) in rewards" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
                <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</td>
                <td v-show="isColumnVisible('point')" class="border-r border-base-200">{{ item.point.toLocaleString('id-ID') }}</td>
                <td v-show="isColumnVisible('customer.name')" class="border-r border-base-200">
                  <NuxtLink :to="`customer/${item.customer.id}`" class="hover:underline text-primary">
                    {{ item.customer.name }} - {{ item.customer.id }}
                  </NuxtLink>
                </td>
                <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary max-w-[200px] truncate" :title="item.service.name">
                  <NuxtLink :to="`service/${item.service.code}`" class="hover:underline">
                    {{ item.service.name }}
                  </NuxtLink>
                </td>
                <td v-show="isColumnVisible('period')" class="border-r border-base-200 whitespace-nowrap">
                  {{ formatDate(item.customerService.startDate) }}
                  <span v-if="item.customerService.endDate"> - {{ formatDate(item.customerService.endDate) }}</span>
                </td>
                <td v-show="isColumnVisible('type')">{{ item.type }}</td>
              </tr>
            </tbody>
          </template>
        </DataTable>

        <!-- Withdrawn Table -->
        <DataTable 
          v-else
          flat 
          :columns="currentColumns"
          :loading="withdrawLoading"
          :is-empty="!withdrawLoading && withdrawnPoints.length === 0"
          v-model:search-query="searchQuery"
          :total-from="withdrawMeta?.from"
          :total-to="withdrawMeta?.to"
          :total-entries="withdrawMeta?.total"
          :current-page="withdrawPage"
          :last-page="withdrawMeta?.lastPage"
          :current-sort="withdrawSort"
          :current-order="withdrawOrder"
          @update:page="withdrawPage = $event"
          @update:sort="withdrawSort = $event"
          @update:order="withdrawOrder = $event"
        >
          <template #filters>
            <DataFilter 
              :is-filter-active="isFilterActive"
              @apply="applyFilters"
              @reset="resetFilters"
              @cancel="cancelFilters"
            >
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-neutral-400 text-xs font-medium">Tanggal Penarikan Poin</span>
                  <span @click="startDate = ''; endDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-neutral-800">Dari:</label>
                    <input v-model="startDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                    <input v-model="endDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                  </div>
                </div>
              </div>
            </DataFilter>
          </template>
          <template #body="{ isColumnVisible }">
            <tbody class="text-sm text-neutral-600">
              <tr v-for="(item, index) in withdrawnPoints" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
                <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</td>
                <td v-show="isColumnVisible('point')" class="border-r border-base-200">{{ Number(item.point).toLocaleString('id-ID') }}</td>
                <td v-show="isColumnVisible('bankName')" class="border-r border-base-200">{{ item.bankName }}</td>
                <td v-show="isColumnVisible('accountNumber')" class="border-r border-base-200">{{ item.accountNumber }}</td>
                <td v-show="isColumnVisible('accountHolderName')" class="border-r border-base-200">{{ item.accountHolderName }}</td>
                <td v-show="isColumnVisible('id')" class="flex items-center justify-between pr-4 gap-2">
                  <span 
                    @click="openUrl(withdrawService.getWithdrawPdfUrl(item.id))"
                    class="text-primary font-medium truncate cursor-pointer hover:underline"
                  >
                    paid-{{ item.id }}.pdf
                  </span>
                  <Download 
                    @click="openUrl(withdrawService.getWithdrawDownloadUrl(item.id))"
                    class="w-4 h-4 text-primary shrink-0 cursor-pointer" 
                  />
                </td>
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
  CircleHelp, X, 
  Coins, Download,
  Filter
} from 'lucide-vue-next'
import { rewardService } from '~/services/reward-service'
import { pointService } from '~/services/point-service'
import { withdrawService } from '~/services/withdraw-service'
import { statisticService } from '~/services/statistic-service'
import { formatDate, formatDateShort, formatDateTime } from '~/utils/date'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Poin Saya',
})

const isWithdrawModalOpen = ref(false)
const activeTab = ref('reward')
const searchQuery = ref('')

const isFilterActive = ref(false)
const startDate = ref('')
const endDate = ref('')

const appliedFilters = ref({
  startDate: '',
  endDate: ''
})

const cancelFilters = () => {
  startDate.value = appliedFilters.value.startDate
  endDate.value = appliedFilters.value.endDate
}

const applyFilters = () => {
  appliedFilters.value = {
    startDate: startDate.value,
    endDate: endDate.value
  }
  isFilterActive.value = Object.values(appliedFilters.value).some(v => v !== '')
}

const resetFilters = () => {
    startDate.value = ''
    endDate.value = ''
    applyFilters()
}

const rewardPage = ref(1)
const rewardSort = ref('createdAt')
const rewardOrder = ref<'asc' | 'desc'>('desc')

const { data: rewardResponse, status: rewardStatus } = await useAsyncData(
  'rewards',
  () => rewardService.getRewards({
    page: rewardPage.value,
    sort: rewardSort.value,
    order: rewardOrder.value,
    q: searchQuery.value,
    startDate: appliedFilters.value.startDate || undefined,
    endDate: appliedFilters.value.endDate || undefined,
    limit: 5
  }),
  {
    watch: [rewardPage, rewardSort, rewardOrder, searchQuery, appliedFilters]
  }
)

const rewards = computed(() => rewardResponse.value?.data || [])
const rewardMeta = computed(() => rewardResponse.value?.meta)
const rewardLoading = computed(() => rewardStatus.value === 'pending')

const { data: pointResponse, refresh: refreshPoint } = await useAsyncData(
  'point',
  () => pointService.getPoint()
)

const totalPoints = computed(() => pointResponse.value?.data.value || 0)

const withdrawPage = ref(1)
const withdrawSort = ref('createdAt')
const withdrawOrder = ref<'asc' | 'desc'>('desc')

const { data: withdrawResponse, status: withdrawStatus, refresh: refreshWithdrawals } = await useAsyncData(
  'withdrawals',
  () => withdrawService.getWithdrawals({
    page: withdrawPage.value,
    sort: withdrawSort.value,
    order: withdrawOrder.value,
    q: searchQuery.value,
    startDate: appliedFilters.value.startDate || undefined,
    endDate: appliedFilters.value.endDate || undefined,
    limit: 5
  }),
  {
    watch: [withdrawPage, withdrawSort, withdrawOrder, searchQuery, appliedFilters]
  }
)

const refreshData = async () => {
    await Promise.all([
        refreshPoint(),
        refreshWithdrawals()
    ])
}

const withdrawMeta = computed(() => withdrawResponse.value?.meta)
const withdrawLoading = computed(() => withdrawStatus.value === 'pending')
const withdrawnPoints = computed(() => withdrawResponse.value?.data || [])

const { data: statisticPointResponse } = await useAsyncData(
  'statistic-point',
  () => statisticService.getPointStatistic()
)

const AreaChartData = computed(() => {
  return (statisticPointResponse.value?.data || []).map(item => ({
    month: item.label,
    growth: item.total
  }))
})

const currentColumns = computed(() => {
  if (activeTab.value === 'reward') {
    return [
      { label: 'Waktu', key: 'createdAt', sortable: true },
      { label: 'Jumlah Poin', key: 'point', sortable: true },
      { label: 'Pelanggan Yang Direferensikan', key: 'customer.name', sortable: true },
      { label: 'Nama Layanan', key: 'service.name', sortable: true },
      { label: 'Periode Berlangganan', key: 'period', sortable: false },
      { label: 'Tipe Komisi', key: 'type', sortable: true }
    ]
  }
  return [
    { label: 'Waktu Penarikan Poin', key: 'createdAt', sortable: true },
    { label: 'Poin Ditarik', key: 'point', sortable: true },
    { label: 'Nama Bank', key: 'bankName', sortable: true },
    { label: 'Nomor Akun Bank', key: 'accountNumber', sortable: true },
    { label: 'Nama Penerima', key: 'accountHolderName', sortable: true },
    { label: 'Nota', key: 'id', sortable: true }
  ]
})

const categories = {
  growth: { name: 'Point', color: '#24960F' }
}

const xFormatter = (tick: number): string => {
  return AreaChartData.value[tick]?.month || ''
}

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>
