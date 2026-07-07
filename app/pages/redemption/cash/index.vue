<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Tukar Poin - Tunai</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Tukar Poin / Tunai
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <!-- Tabs and Bulk Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between w-full mb-2 border-b border-transparent md:border-base-200 gap-3 md:gap-0">
        <div class="flex border-b border-base-200 md:border-b-0 w-full md:w-auto">
          <button 
            @click="activeTab = 'pending'"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Belum di Transfer
          </button>
          <button 
            @click="activeTab = 'completed'"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Sudah di Transfer
          </button>
        </div>

        <!-- Bulk Action Button -->
        <div v-if="activeTab === 'pending' && canEdit('redemption.cash')" class="flex items-center gap-4 pb-2.5 md:pb-2 pr-4">
          <!-- Select All Checkbox -->
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              class="checkbox checkbox-primary checkbox-sm rounded"
              :checked="isAllSelected"
              @change="toggleSelectAll"
            />
            <span class="text-xs text-neutral-500 font-medium">Pilih Semua</span>
          </label>

          <div class="flex items-center gap-3">
            <span v-if="selectedIds.length > 0" class="text-xs text-neutral-500 font-medium">{{ selectedIds.length }} terpilih</span>
            <button 
              @click="handleBulkComplete"
              :disabled="completing || selectedIds.length === 0"
              class="btn btn-primary btn-sm rounded-lg font-medium text-white flex items-center gap-2 h-9 min-h-0"
            >
              <Check class="w-4.5 h-4.5" />
              Tandai Sudah di Transfer
            </button>
          </div>
        </div>
      </div>

      <DataTable 
        :key="activeTab"
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && items.length === 0"
        :total-from="meta?.from"
        :total-to="meta?.to"
        :total-entries="meta?.total"
        :current-page="meta?.currentPage"
        :last-page="meta?.lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama, email, atau no. transaksi..."
        @update:page="handlePageChange"
        @update:sort="handleSort"
        @update:order="handleOrderChange"
      >
        <!-- Filters Slot -->
        <template #filters>
          <DataFilter 
            :is-filter-active="isFilterActive"
            @apply="applyFilters"
            @reset="resetFilters"
            @cancel="cancelFilters"
          >
            <!-- Date Range -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tanggal</span>
                <span @click="filterStartDate = ''; filterEndDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="flex items-center gap-2">
                <input v-model="filterStartDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                <span class="text-neutral-400 text-sm shrink-0">s/d</span>
                <input v-model="filterEndDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
              </div>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('selection')" class="border-r border-base-200 text-center w-10">
                <input 
                  type="checkbox" 
                  class="checkbox checkbox-primary checkbox-sm rounded" 
                  :value="item.id"
                  v-model="selectedIds"
                />
              </td>
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</td>
              <td v-show="isColumnVisible('redempNo')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.redempNo">{{ item.redempNo }}</td>
              <td v-show="isColumnVisible('user')" class="border-r border-base-200">
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div v-if="item.user.photo" class="w-9 h-9 rounded-full ring ring-base-200 ring-offset-1">
                      <img :src="item.user.photo" :alt="item.user.name" class="object-cover" />
                    </div>
                    <div v-else class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring ring-base-200 ring-offset-1">
                      <span class="text-primary font-semibold text-xs">{{ getInitials(item.user.name) }}</span>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <NuxtLink :to="`/user/${item.user.id}`" class="font-medium text-primary hover:underline truncate max-w-[180px] block" :title="item.user.name">{{ item.user.name }}</NuxtLink>
                    <p class="text-xs text-neutral-400 truncate max-w-[180px]" :title="item.user.email || '-'">{{ item.user.email || '-' }}</p>
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('user.identityNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="String(item.user.identityNumber || '-')">{{ item.user.identityNumber || '-' }}</td>
              <td v-show="isColumnVisible('user.taxNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.user.taxNumber || '-'">{{ item.user.taxNumber || '-' }}</td>
              <td v-show="isColumnVisible('pointsUsed')" class="border-r border-base-200 text-right">
                <span class="font-semibold text-primary">{{ formatNumber(item.pointsUsed) }}</span>
              </td>
              <td v-show="isColumnVisible('bank')" class="border-r border-base-200 max-w-[200px]">
                <template v-if="item.withdrawDetails?.bankName">
                  <p class="font-medium text-neutral-800 truncate" :title="item.withdrawDetails.bankName">{{ item.withdrawDetails.bankName }}</p>
                  <p class="text-xs text-neutral-400 truncate" :title="`${item.withdrawDetails.accountNumber} · ${item.withdrawDetails.accountHolderName}`">{{ item.withdrawDetails.accountNumber }} · {{ item.withdrawDetails.accountHolderName }}</p>
                </template>
                <span v-else>-</span>
              </td>
              <td v-show="isColumnVisible('payout')" class="border-r border-base-200 text-right whitespace-nowrap">
                <template v-if="item.withdrawDetails">
                  <p class="font-medium text-neutral-800">Rp. {{ formatNumber(item.withdrawDetails.payout) }}</p>
                  <p class="text-xs text-neutral-400">Pajak: Rp. {{ formatNumber(item.withdrawDetails.tax) }}</p>
                </template>
                <span v-else>-</span>
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openHistoryModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Riwayat Status">
                    <History class="w-4.5 h-4.5" />
                  </button>
                  <a :href="item.withdrawDetails?.receipt || '#'" target="_blank" class="btn btn-ghost btn-xs btn-circle">
                    <Eye class="w-4 h-4 text-neutral-500" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <ModalRedemptionHistory
      v-model="showHistoryModal"
      :redemption-id="selectedHistoryId"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftRight, CircleHelp, Eye, Download, Check, History } from 'lucide-vue-next'
import { redemptionService } from '~/services/redemption-service'
import { getInitials } from '~/utils/initials'
import { formatNumber } from '~/utils/string'
import { formatDateTime } from '~/utils/date'
import type { CashRedemptionListItem, CashRedemptionQueryParams } from '~/types/redemption'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Tukar Poin - Tunai',
})

const { canEdit } = usePermission()
const activeTab = ref<'pending' | 'completed'>('pending')

const columns = computed(() => {
  const baseColumns = [
    { label: 'Tanggal', key: 'createdAt', sortable: true },
    { label: 'No. Transaksi', key: 'redempNo', sortable: true },
    { label: 'Pengguna', key: 'user', sortable: false },
    { label: 'No. Identitas', key: 'user.identityNumber', sortable: true },
    { label: 'NPWP', key: 'user.taxNumber', sortable: true },
    { label: 'Poin', key: 'pointsUsed', sortable: true },
    { label: 'Informasi Bank', key: 'bank', sortable: false },
    { label: 'Nominal', key: 'payout', sortable: false },
    { label: 'Aksi', key: 'actions', sortable: false },
  ]

  if (activeTab.value === 'pending') {
    return [
      { label: '', key: 'selection', sortable: false },
      ...baseColumns
    ]
  }

  return baseColumns
})

const items = ref<CashRedemptionListItem[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')

// Filter states
const filterStartDate = ref('')
const filterEndDate = ref('')
const isFilterActive = ref(false)

const appliedFilters = ref({
  startDate: '',
  endDate: ''
})

const selectedIds = ref<number[]>([])
const completing = ref(false)

const showHistoryModal = ref(false)
const selectedHistoryId = ref<number | null>(null)

const openHistoryModal = (item: CashRedemptionListItem) => {
  selectedHistoryId.value = item.id
  showHistoryModal.value = true
}

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedIds.value.length === items.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = items.value.map(item => item.id)
  }
}

const handleBulkComplete = async () => {
  if (selectedIds.value.length === 0) return
  
  completing.value = true
  const toast = useToast()
  
  try {
    const promises = selectedIds.value.map(id => 
      redemptionService.completeCash(id)
        .then(() => ({ id, success: true }))
        .catch(() => ({ id, success: false }))
    )
    
    const results = await Promise.all(promises)
    const failedCount = results.filter(res => !res.success).length
    
    if (failedCount === 0) {
      toast.success('Poin ditandai sudah ditransfer.')
    } else {
      toast.warning(`Berhasil menyelesaikan ${results.length - failedCount} transaksi, ${failedCount} transaksi gagal`)
    }
  } catch (error: any) {
    toast.error('Gagal memproses penandaan transaksi')
  } finally {
    completing.value = false
    selectedIds.value = []
    fetchData({ page: 1 })
  }
}

const fetchData = async (queryParams: Partial<CashRedemptionQueryParams> = {}) => {
  loading.value = true
  try {
    const params: CashRedemptionQueryParams = {
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value || undefined,
      page: queryParams.page || 1,
      limit: 10,
    }

    if (activeTab.value === 'pending') {
      params['status[]'] = ['pending', 'processing']
    } else {
      params['status[]'] = ['completed']
    }

    if (appliedFilters.value.startDate) {
      params.startDate = appliedFilters.value.startDate
    }
    if (appliedFilters.value.endDate) {
      params.endDate = appliedFilters.value.endDate
    }

    const response = await redemptionService.getCashRedemptions(params)
    
    if (response.success) {
      items.value = response.data
      meta.value = response.meta
    }
  } finally {
    loading.value = false
  }
}

const cancelFilters = () => {
  filterStartDate.value = appliedFilters.value.startDate
  filterEndDate.value = appliedFilters.value.endDate
}

const applyFilters = () => {
  appliedFilters.value = {
    startDate: filterStartDate.value,
    endDate: filterEndDate.value
  }
  isFilterActive.value = appliedFilters.value.startDate !== '' || appliedFilters.value.endDate !== ''
  fetchData({ page: 1 })
}

const resetFilters = () => {
  filterStartDate.value = ''
  filterEndDate.value = ''
  applyFilters()
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchData({ page: 1 })
  }, 500)
})

watch(activeTab, () => {
  selectedIds.value = []
  fetchData({ page: 1 })
})

watch(items, () => {
  selectedIds.value = []
})

const handlePageChange = (page: number) => {
  fetchData({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchData({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchData({ page: 1 })
}

onMounted(() => {
  fetchData()
})
</script>
