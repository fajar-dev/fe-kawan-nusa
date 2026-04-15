<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Redemptions Table -->
    <DataTable 
      flat 
      :columns="currentColumns"
      :loading="isLoading"
      :is-empty="!isLoading && redemptions.length === 0"
      v-model:search-query="searchQuery"
      :total-from="meta?.from"
      :total-to="meta?.to"
      :total-entries="meta?.total"
      :current-page="page"
      :last-page="meta?.lastPage"
      :current-sort="sort"
      :current-order="order"
      @update:page="page = $event"
      @update:sort="sort = $event"
      @update:order="order = $event"
    >
      <template #filters>
        <DataFilter 
          :is-filter-active="isFilterActive"
          @apply="applyFilters"
          @reset="resetFilters"
          @cancel="cancelFilters"
        >
          <div class="space-y-4">
            <!-- Rentang Tanggal -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Rentang Tanggal</span>
                <span @click="tempStartDate = ''; tempEndDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-neutral-800">Dari:</label>
                  <input v-model="tempStartDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                  <input v-model="tempEndDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                </div>
              </div>
            </div>

            <!-- Tipe Redem -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tipe Redem</span>
                <span @click="tempTypes = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <MultiSelect 
                v-model="tempTypes"
                :options="typeOptions"
                labelKey="label"
                valueKey="value"
                placeholder="Semua Tipe"
                searchable
              />
            </div>

            <!-- Status -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Status</span>
                <span @click="tempStatuses = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <MultiSelect 
                v-model="tempStatuses"
                :options="statusOptions"
                labelKey="label"
                valueKey="value"
                placeholder="Semua Status"
                searchable
              />
            </div>
          </div>
        </DataFilter>
      </template>

      <template #body="{ isColumnVisible }">
        <tbody class="text-sm text-neutral-600">
          <tr v-for="(item, index) in redemptions" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
            <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</td>
            <td v-show="isColumnVisible('type')" class="border-r border-base-200">
              <span class="capitalize">{{ formatType(item.type) }}</span>
            </td>
            <td v-show="isColumnVisible('reward')" class="border-r border-base-200 max-w-xs">
              <div v-if="item.type === 'cash' && item.withdrawDetails" class="flex items-center justify-between gap-3">
                <div class="truncate min-w-0">Penarikan tunai Rp.{{ (item.withdrawDetails.payout + item.withdrawDetails.tax).toLocaleString('id-ID') }}</div>
                
                <div class="dropdown dropdown-end shrink-0">
                  <div tabindex="0" role="button" class="p-1 hover:bg-base-200 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-primary">
                    <Maximize2 class="w-4 h-4" />
                  </div>
                  <div tabindex="0" class="dropdown-content z-[200] card card-compact bg-base-100 w-64 shadow-xl border border-base-200 mt-2">
                    <div class="card-body">
                      <h3 class="font-medium text-sm text-neutral-800 border-b border-base-200 pb-2 mb-2">Penarikan Tunai Rp.{{ item.withdrawDetails.payout + item.withdrawDetails.tax }}</h3>
                      <div class="space-y-3">
                        <div class="flex flex-col gap-2">
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Bank:</div>
                            <div class="text-xs text-neutral-800">{{ item.withdrawDetails.bankName }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Nama Pemilik Rekening:</div>
                            <div class="text-xs text-neutral-800">{{ item.withdrawDetails.accountHolderName }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Nomor Rekening:</div>
                            <div class="text-xs text-neutral-800">{{ item.withdrawDetails.accountNumber }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="item.type === 'voucher' && item.voucherDetails" class="flex items-center justify-between gap-3">
                <span class="truncate min-w-0">{{ item.voucherDetails.catalog.name }}</span>
                
                <div class="dropdown dropdown-end shrink-0">
                  <div tabindex="0" role="button" class="p-1 hover:bg-base-200 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-primary">
                    <Maximize2 class="w-4 h-4" />
                  </div>
                  <div tabindex="0" class="dropdown-content z-[200] card card-compact bg-base-100 w-64 shadow-xl border border-base-200 mt-2">
                    <div class="card-body">
                      <h3 class="font-medium text-sm text-neutral-800 border-b border-base-200 pb-2 mb-2 truncate">{{ item.voucherDetails.catalog.name }}</h3>
                      <div class="space-y-3">
                        <div class="flex flex-col gap-2">
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Nama:</div>
                            <div class="text-xs text-neutral-800">{{ item.voucherDetails.name }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Email:</div>
                            <div class="text-xs text-neutral-800">{{ item.voucherDetails.email }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="item.type === 'product' && item.productDetails" class="flex items-center justify-between gap-3">
                <span class="truncate min-w-0">{{ item.productDetails.catalog.name }}</span>

                <div class="dropdown dropdown-end shrink-0">
                  <div tabindex="0" role="button" class="p-1 hover:bg-base-200 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-primary">
                    <Maximize2 class="w-4 h-4" />
                  </div>
                  <div tabindex="0" class="dropdown-content z-[200] card card-compact bg-base-100 w-64 shadow-xl border border-base-200 mt-2">
                    <div class="card-body">
                      <h3 class="font-medium text-sm text-neutral-800 border-b border-base-200 pb-2 mb-2 truncate">{{ item.productDetails.catalog.name }}</h3>
                      <div class="space-y-3">
                        <div class="flex flex-col gap-2">
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Nama:</div>
                            <div class="text-xs text-neutral-800">{{ item.productDetails.name }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Email:</div>
                            <div class="text-xs text-neutral-800">{{ item.productDetails.email }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Nomor Handphone:</div>
                            <div class="text-xs text-neutral-800">{{ item.productDetails.phone }}</div>
                          </div>
                          <div class="space-y-0.5">
                            <div class="text-xs text-neutral-400">Alamat:</div>
                            <div class="text-xs text-neutral-800">{{ item.productDetails.address }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td v-show="isColumnVisible('status')" class="border-r border-base-200">
              <span>
                {{ formatStatus(item.status) }}
              </span>
            </td>
            <td v-show="isColumnVisible('pointsUsed')" class="border-r border-base-200  text-neutral-800">
              -{{ item.pointsUsed.toLocaleString('id-ID') }}
            </td>
            <td v-show="isColumnVisible('action')" class="flex grow pr-4 min-w-[120px]">
              <div v-if="item.type === 'cash'" class="flex items-center justify-between gap-2 w-full">
                <button 
                  @click="openUrl(redemptionService.getWithdrawPdfUrl(item.id))"
                  class="text-primary hover:underline font-medium"
                >
                  {{ item.redempNo }}
                </button>
                <Download 
                  @click="openUrl(redemptionService.getWithdrawDownloadUrl(item.id))"
                  class="w-4 h-4 text-primary shrink-0 cursor-pointer" 
                />
              </div>
              <div v-else class="w-full flex justify-between">
                <NuxtLink 
                  to="/point/reedem/history"
                  class="text-primary hover:underline font-medium flex justify-between w-full"
                >
                Riwayat Penukaran
                <ExternalLink
                  class="w-4 h-4 text-primary shrink-0 cursor-pointer"
                />
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { Download, ExternalLink, Maximize2 } from 'lucide-vue-next'
import { redemptionService } from '~/services/redemption-service'
import { formatDateTime } from '~/utils/date'

const typeOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Voucher', value: 'voucher' },
  { label: 'Produk', value: 'product' }
]

const statusOptions = [
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Selesai', value: 'completed' }
]

// Filter states for UI (temp)
const tempStartDate = ref('')
const tempEndDate = ref('')
const tempTypes = ref<string[]>([])
const tempStatuses = ref<string[]>([])

// Applied filter states for Query
const appliedFilters = ref({
  startDate: '',
  endDate: '',
  types: [] as string[],
  statuses: [] as string[]
})

const cancelFilters = () => {
  tempStartDate.value = appliedFilters.value.startDate
  tempEndDate.value = appliedFilters.value.endDate
  tempTypes.value = [...appliedFilters.value.types]
  tempStatuses.value = [...appliedFilters.value.statuses]
}

const applyFilters = () => {
  appliedFilters.value = {
    startDate: tempStartDate.value,
    endDate: tempEndDate.value,
    types: [...tempTypes.value],
    statuses: [...tempStatuses.value]
  }
  page.value = 1
}

const resetFilters = () => {
  tempStartDate.value = ''
  tempEndDate.value = ''
  tempTypes.value = []
  tempStatuses.value = []
  applyFilters()
}

const isFilterActive = computed(() => {
  return !!appliedFilters.value.startDate || 
  !!appliedFilters.value.endDate || 
  appliedFilters.value.types.length > 0 || 
  appliedFilters.value.statuses.length > 0
})

const searchQuery = ref('')
const page = ref(1)
const sort = ref('createdAt')
const order = ref<'asc' | 'desc'>('desc')

const queryParams = computed(() => ({
  page: page.value,
  sort: sort.value,
  order: order.value,
  q: searchQuery.value,
  type: appliedFilters.value.types.length > 0 ? (appliedFilters.value.types as any) : undefined,
  status: appliedFilters.value.statuses.length > 0 ? appliedFilters.value.statuses : undefined,
  startDate: appliedFilters.value.startDate || undefined,
  endDate: appliedFilters.value.endDate || undefined,
  limit: 5
}))

const { data: response, status, refresh: refreshData } = useAsyncData(
  'redemptions-history',
  () => redemptionService.getRedemptions(queryParams.value)
)

watch(queryParams, () => {
  refreshData()
}, { deep: true })

const meta = computed(() => response.value?.meta)
const isLoading = computed(() => status.value === 'pending')
const redemptions = computed(() => response.value?.data || [])

const currentColumns = [
  { label: 'Waktu', key: 'createdAt', sortable: true },
  { label: 'Tipe Penukaran', key: 'type', sortable: true },
  { label: 'Penukaran', key: 'reward' },
  { label: 'Status Penukaran', key: 'status', sortable: true },
  { label: 'Poin', key: 'pointsUsed', sortable: true },
  { label: 'Aksi', key: 'action' }
]

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const formatType = (type: string) => {
  switch (type) {
    case 'cash': return 'Cash'
    case 'voucher': return 'Voucher'
    case 'product': return 'Produk'
    default: return type
  }
}

const formatStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'Menunggu Verifikasi'
    case 'processing': return 'Diproses'
    case 'completed': return 'Selesai'
    default: return status
  }
}

</script>
