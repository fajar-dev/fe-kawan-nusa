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
          <NuxtLink 
            to="/point/activity/reward"
            class="pb-3 font-medium transition-all relative"
            :class="[ $route.path === '/point/activity/reward' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
          >
            Poin Masuk
            <div v-if="$route.path === '/point/activity/reward'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </NuxtLink>
          <NuxtLink 
            to="/point/activity/history"
            class="pb-3 font-medium transition-all relative"
            :class="[ $route.path === '/point/activity/history' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
          >
            Poin Terpakai
            <div v-if="$route.path === '/point/activity/history'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </NuxtLink>
        </div>

        <!-- Tab Content -->
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp,
  Coins
} from 'lucide-vue-next'
import { pointService } from '~/services/point-service'
import { withdrawService } from '~/services/withdraw-service'
import { statisticService } from '~/services/statistic-service'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Poin Saya',
})

const isWithdrawModalOpen = ref(false)

const { data: pointResponse, refresh: refreshPoint } = useAsyncData(
  'point',
  () => pointService.getPoint()
)

const totalPoints = computed(() => pointResponse.value?.data.value || 0)

const { data: statisticPointResponse, refresh: refreshStatistic } = useAsyncData(
  'statistic-point',
  () => statisticService.getPointStatistic()
)

const AreaChartData = computed(() => {
  return (statisticPointResponse.value?.data || []).map(item => ({
    month: item.label,
    growth: item.total
  }))
})

const categories = {
  growth: { name: 'Point', color: '#24960F' }
}

const xFormatter = (tick: number): string => {
  return AreaChartData.value[tick]?.month || ''
}

const refreshData = async () => {
    await Promise.all([
        refreshPoint(),
        refreshStatistic()
    ])
}

// Provide generic data or refresh functions if needed by children
provide('refreshPointData', refreshData)

</script>
