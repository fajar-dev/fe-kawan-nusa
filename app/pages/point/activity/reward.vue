<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Reward Table -->
    <DataTable 
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
          :is-filter-active="isRewardFilterActive"
          @apply="applyRewardFilters"
          @reset="resetRewardFilters"
          @cancel="cancelRewardFilters"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-neutral-400 text-xs font-medium">Tanggal</span>
              <span @click="rewardStartDate = ''; rewardEndDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-neutral-800">Dari:</label>
                <input v-model="rewardStartDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                <input v-model="rewardEndDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
              </div>
            </div>
          </div>
          <!-- Status -->
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
        </DataFilter>
      </template>

      <template #body="{ isColumnVisible }">
        <tbody class="text-sm text-neutral-600">
          <tr v-for="(item, index) in rewards" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
            <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</td>
            <td v-show="isColumnVisible('customer.name')" class="border-r border-base-200">
              <NuxtLink :to="`/customer/${item.customer.id}`" class="hover:underline text-primary">
                {{ item.customer.name }} - {{ item.customer.id }}
              </NuxtLink>
            </td>
            <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary max-w-[200px] truncate" :title="item.service.name">
              <NuxtLink :to="`/service/${item.service.code}`" class="hover:underline">
                {{ item.service.name }}
              </NuxtLink>
            </td>
            <td v-show="isColumnVisible('period')" class="border-r border-base-200 whitespace-nowrap">
              {{ formatDate(item.customerService.startDate) }}
              <span v-if="item.customerService.endDate"> - {{ formatDate(item.customerService.endDate) }}</span>
            </td>
            <td v-show="isColumnVisible('type')">{{ item.type }}</td>
            <td v-show="isColumnVisible('point')" class="border-r border-base-200">+ {{ item.point.toLocaleString('id-ID') }}</td>
            <td v-show="isColumnVisible('expiredDate')" class="border-r border-base-200">{{ formatDate(item.expiredDate) }}</td>
          </tr>
        </tbody>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { rewardService } from '~/services/reward-service'
import { additionalService } from '~/services/additional-service'
import { formatDate, formatDateTime } from '~/utils/date'
import type { AdditionalItem } from '~/types/additional'

// State for filters
const rewardStartDate = ref('')
const rewardEndDate = ref('')
const rewardType = ref<string[]>([])
const rewardTypeOptions = ref<AdditionalItem[]>([])
const searchQuery = ref('')

const appliedFilters = ref({
  startDate: '',
  endDate: '',
  type: [] as string[]
})

const cancelRewardFilters = () => {
  rewardStartDate.value = appliedFilters.value.startDate
  rewardEndDate.value = appliedFilters.value.endDate
  rewardType.value = [...appliedFilters.value.type]
}

const applyRewardFilters = () => {
  appliedFilters.value = {
    startDate: rewardStartDate.value,
    endDate: rewardEndDate.value,
    type: [...rewardType.value]
  }
  rewardPage.value = 1
}

const resetRewardFilters = () => {
  rewardStartDate.value = ''
  rewardEndDate.value = ''
  rewardType.value = []
  applyRewardFilters()
}

const isRewardFilterActive = computed(() => {
  return !!appliedFilters.value.startDate || 
         !!appliedFilters.value.endDate || 
         (appliedFilters.value.type && appliedFilters.value.type.length > 0)
})

const rewardPage = ref(1)
const rewardSort = ref('createdAt')
const rewardOrder = ref<'asc' | 'desc'>('desc')

const queryParams = computed(() => ({
  page: rewardPage.value,
  sort: rewardSort.value,
  order: rewardOrder.value,
  q: searchQuery.value,
  startDate: appliedFilters.value.startDate || undefined,
  endDate: appliedFilters.value.endDate || undefined,
  type: (appliedFilters.value.type && appliedFilters.value.type.length > 0) ? appliedFilters.value.type : undefined,
  limit: 5
}))

const { data: rewardResponse, status: rewardStatus, refresh: refreshRewards } = useAsyncData(
  'rewards',
  () => rewardService.getRewards(queryParams.value)
)

watch(queryParams, () => {
  refreshRewards()
}, { deep: true })

const rewards = computed(() => rewardResponse.value?.data || [])
const rewardMeta = computed(() => rewardResponse.value?.meta)
const rewardLoading = computed(() => rewardStatus.value === 'pending')

const currentColumns = [
  { label: 'Waktu', key: 'createdAt', sortable: true },
  { label: 'Pelanggan Yang Direferensikan', key: 'customer.name', sortable: true },
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Tipe Poin', key: 'type', sortable: true },
  { label: 'Poin', key: 'point', sortable: true },
  { label: 'Tanggal Kadaluarsa', key: 'expiredDate', sortable: true }
]

const fetchFilterOptions = async () => {
  const res = await additionalService.getRewardPointTypes()
  if (res.success) {
    rewardTypeOptions.value = res.data
  }
}

onMounted(() => {
  fetchFilterOptions()
})
</script>
