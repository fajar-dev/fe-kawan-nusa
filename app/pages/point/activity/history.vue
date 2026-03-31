<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Withdrawn Table -->
    <DataTable 
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
          :is-filter-active="isWithdrawFilterActive"
          @apply="applyWithdrawFilters"
          @reset="resetWithdrawFilters"
          @cancel="cancelWithdrawFilters"
        >
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-neutral-400 text-xs font-medium">Tanggal Penarikan Poin</span>
              <span @click="withdrawStartDate = ''; withdrawEndDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-neutral-800">Dari:</label>
                <input v-model="withdrawStartDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                <input v-model="withdrawEndDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
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
                :title="`paid-${item.id}.pdf`"
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Download } from 'lucide-vue-next'
import { withdrawService } from '~/services/withdraw-service'
import { formatDateTime } from '~/utils/date'

const withdrawStartDate = ref('')
const withdrawEndDate = ref('')
const searchQuery = ref('')

const appliedFilters = ref({
  startDate: '',
  endDate: ''
})

const cancelWithdrawFilters = () => {
  withdrawStartDate.value = appliedFilters.value.startDate
  withdrawEndDate.value = appliedFilters.value.endDate
}

const applyWithdrawFilters = () => {
  appliedFilters.value = {
    startDate: withdrawStartDate.value,
    endDate: withdrawEndDate.value
  }
  withdrawPage.value = 1
}

const resetWithdrawFilters = () => {
  withdrawStartDate.value = ''
  withdrawEndDate.value = ''
  applyWithdrawFilters()
}

const isWithdrawFilterActive = computed(() => {
  return !!appliedFilters.value.startDate || !!appliedFilters.value.endDate
})

const withdrawPage = ref(1)
const withdrawSort = ref('createdAt')
const withdrawOrder = ref<'asc' | 'desc'>('desc')

const queryParams = computed(() => ({
  page: withdrawPage.value,
  sort: withdrawSort.value,
  order: withdrawOrder.value,
  q: searchQuery.value,
  startDate: appliedFilters.value.startDate || undefined,
  endDate: appliedFilters.value.endDate || undefined,
  limit: 5
}))

const { data: withdrawResponse, status: withdrawStatus, refresh: refreshWithdrawals } = useAsyncData(
  'withdrawals',
  () => withdrawService.getWithdrawals(queryParams.value)
)

watch(queryParams, () => {
  refreshWithdrawals()
}, { deep: true })

const withdrawMeta = computed(() => withdrawResponse.value?.meta)
const withdrawLoading = computed(() => withdrawStatus.value === 'pending')
const withdrawnPoints = computed(() => withdrawResponse.value?.data || [])

const currentColumns = [
  { label: 'Waktu Penarikan Poin', key: 'createdAt', sortable: true },
  { label: 'Poin Ditarik', key: 'point', sortable: true },
  { label: 'Nama Bank', key: 'bankName', sortable: true },
  { label: 'Nomor Akun Bank', key: 'accountNumber', sortable: true },
  { label: 'Nama Penerima', key: 'accountHolderName', sortable: true },
  { label: 'Nota', key: 'id', sortable: true }
]

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>
