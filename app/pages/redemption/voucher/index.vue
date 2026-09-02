<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Tukar Poin - Voucher</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Tukar Poin / Voucher
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
            Pending
          </button>
          <button 
            @click="activeTab = 'processing'"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'processing' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Diproses
          </button>
          <button 
            @click="activeTab = 'completed'"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Completed
          </button>
        </div>

        <!-- Bulk Action Button -->
        <div v-if="activeTab === 'processing' && canEdit('redemption.voucher')" class="flex items-center gap-4 pb-2.5 md:pb-2 pr-4">
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
              Selesaikan Semua
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
              <td v-show="isColumnVisible('voucher')" class="border-r border-base-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-base-200 shrink-0">
                    <img v-if="item.voucherDetails?.catalog?.image" :src="item.voucherDetails.catalog.image" :alt="item.voucherDetails.catalog.name" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <Ticket class="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-neutral-800 truncate max-w-[160px]" :title="item.voucherDetails?.catalog?.name">{{ item.voucherDetails?.catalog?.name }}</p>
                    <p class="text-xs text-neutral-400 truncate max-w-[160px]">{{ item.voucherDetails?.catalog?.category?.name }}</p>
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('recipient')" class="border-r border-base-200 max-w-[200px]">
                <p class="font-medium text-neutral-800 truncate" :title="item.voucherDetails?.name">{{ item.voucherDetails?.name }}</p>
                <p class="text-xs text-neutral-400 truncate" :title="item.voucherDetails?.email">{{ item.voucherDetails?.email }}</p>
              </td>
              <td v-show="isColumnVisible('pointsUsed')" class="border-r border-base-200 text-right">
                <span class="font-semibold text-primary">{{ formatNumber(item.pointsUsed) }}</span>
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap', getRedemptionStatusClass(item.status)]">
                  {{ getRedemptionStatusLabel(item.status) }}
                </span>
              </td>
              <td v-show="isColumnVisible('voucherCode')" class="border-r border-base-200 max-w-[200px]">
                <template v-if="item.voucherDetails?.detail">
                  <p class="font-medium text-neutral-800 text-xs font-mono truncate" :title="item.voucherDetails.detail.code">{{ item.voucherDetails.detail.code }}</p>
                  <p v-if="item.voucherDetails.detail.expiredDate" class="text-xs text-neutral-400">Exp: {{ formatDate(item.voucherDetails.detail.expiredDate) }}</p>
                </template>
                <span v-else class="text-neutral-400">-</span>
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openHistoryModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Riwayat Status">
                    <History class="w-4.5 h-4.5" />
                  </button>
                  <template v-if="activeTab === 'pending' && canEdit('redemption.voucher')">
                    <button 
                      @click="openVoucherModal(item)"
                      class="btn btn-ghost btn-xs text-primary hover:bg-primary/10 font-medium gap-1"
                    >
                      <Ticket class="w-3.5 h-3.5" />
                      Proses
                    </button>
                  </template>
                  <template v-else-if="activeTab === 'processing' && canEdit('redemption.voucher')">
                    <button 
                      @click="handleComplete(item.id)"
                      :disabled="completing"
                      class="btn btn-ghost btn-xs text-green-600 hover:bg-green-50 font-medium gap-1"
                    >
                      <Check class="w-3.5 h-3.5" />
                      Selesaikan
                    </button>
                  </template>
                  <template v-else>
                    <button class="btn btn-ghost btn-xs btn-circle" @click="openVoucherDetail(item)">
                      <Eye class="w-4 h-4 text-neutral-500" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <!-- Modals -->
    <ModalProcessVoucher ref="voucherModalRef" @success="fetchData({ page: 1 })" />

    <ModalRedemptionHistory
      v-model="showHistoryModal"
      :redemption-id="selectedHistoryId"
    />

    <!-- Voucher Detail Modal -->
    <dialog ref="detailDialogRef" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box max-w-md bg-white">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg text-neutral-800">Detail Voucher</h3>
          <button @click="detailDialogRef?.close()" class="btn btn-ghost btn-sm btn-circle">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>
        <div v-if="detailItem" class="space-y-4">
          <div class="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
            <div class="w-12 h-12 rounded-lg overflow-hidden bg-base-200 shrink-0">
              <img v-if="detailItem.voucherDetails?.catalog?.image" :src="detailItem.voucherDetails.catalog.image" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0">
              <p class="font-medium text-sm text-neutral-800 truncate">{{ detailItem.voucherDetails?.catalog?.name }}</p>
              <p class="text-xs text-neutral-400">{{ detailItem.redempNo }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-neutral-400 text-xs mb-0.5">Penerima</p>
              <p class="font-medium text-neutral-800">{{ detailItem.voucherDetails?.name }}</p>
            </div>
            <div>
              <p class="text-neutral-400 text-xs mb-0.5">Email</p>
              <p class="font-medium text-neutral-800">{{ detailItem.voucherDetails?.email }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-neutral-400 text-xs mb-0.5">Kode Voucher</p>
              <p class="font-medium text-neutral-800 font-mono">{{ detailItem.voucherDetails?.detail?.code || '-' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-neutral-400 text-xs mb-0.5">Tanggal Kadaluarsa</p>
              <p class="font-medium text-neutral-800">{{ detailItem.voucherDetails?.detail?.expiredDate ? formatDate(detailItem.voucherDetails.detail.expiredDate) : '-' }}</p>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftRight, CircleHelp, Eye, Check, Ticket, X, History } from 'lucide-vue-next'
import ModalProcessVoucher from '~/components/redemption/ModalProcessVoucher.vue'
import { redemptionService } from '~/services/redemption-service'
import { getInitials } from '~/utils/initials'
import { formatNumber } from '~/utils/string'
import { formatDateTime, formatDate } from '~/utils/date'
import type { VoucherRedemptionListItem, VoucherRedemptionQueryParams } from '~/types/redemption'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Tukar Poin - Voucher',
})

const getRedemptionStatusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-50 text-yellow-600'
    case 'processing': return 'bg-blue-50 text-blue-600'
    case 'completed': return 'bg-green-50 text-green-600'
    case 'cancelled': return 'bg-red-50 text-red-500'
    default: return 'bg-neutral-100 text-neutral-500'
  }
}

const getRedemptionStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending'
    case 'processing': return 'Diproses'
    case 'completed': return 'Selesai'
    case 'cancelled': return 'Dibatalkan'
    default: return status
  }
}

const { canEdit } = usePermission()
const activeTab = ref<'pending' | 'processing' | 'completed'>('pending')

const columns = computed(() => {
  const baseColumns = [
    { label: 'Tanggal', key: 'createdAt', sortable: true },
    { label: 'No. Transaksi', key: 'redempNo', sortable: true },
    { label: 'Pengguna', key: 'user', sortable: false },
    { label: 'Voucher', key: 'voucher', sortable: false },
    { label: 'Penerima', key: 'recipient', sortable: false },
    { label: 'Poin', key: 'pointsUsed', sortable: true },
    { label: 'Status', key: 'status', sortable: false },
    { label: 'Kode Voucher', key: 'voucherCode', sortable: false },
    { label: 'Aksi', key: 'actions', sortable: false },
  ]

  if (activeTab.value === 'processing') {
    return [
      { label: '', key: 'selection', sortable: false },
      ...baseColumns
    ]
  }

  return baseColumns
})

const items = ref<VoucherRedemptionListItem[]>([])
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

const openHistoryModal = (item: VoucherRedemptionListItem) => {
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

// Modals
const voucherModalRef = ref<InstanceType<typeof ModalProcessVoucher> | null>(null)
const detailDialogRef = ref<HTMLDialogElement | null>(null)
const detailItem = ref<VoucherRedemptionListItem | null>(null)

const openVoucherModal = (item: VoucherRedemptionListItem) => {
  voucherModalRef.value?.open(item)
}

const openVoucherDetail = (item: VoucherRedemptionListItem) => {
  detailItem.value = item
  detailDialogRef.value?.showModal()
}

const handleComplete = async (id: number) => {
  completing.value = true
  const toast = useToast()

  try {
    await redemptionService.completeVoucher(id)
    toast.success('Redemption berhasil diselesaikan')
    fetchData({ page: 1 })
  } catch (error: any) {
    toast.error('Gagal menyelesaikan redemption')
  } finally {
    completing.value = false
  }
}

const handleBulkComplete = async () => {
  if (selectedIds.value.length === 0) return

  // Only complete items that are in 'processing' status
  const processingIds = items.value
    .filter(item => selectedIds.value.includes(item.id) && item.status === 'processing')
    .map(item => item.id)

  if (processingIds.length === 0) {
    const toast = useToast()
    toast.warning('Tidak ada item dengan status "Diproses" yang bisa diselesaikan. Proses voucher terlebih dahulu.')
    return
  }
  
  completing.value = true
  const toast = useToast()
  
  try {
    const promises = processingIds.map(id => 
      redemptionService.completeVoucher(id)
        .then(() => ({ id, success: true }))
        .catch(() => ({ id, success: false }))
    )
    
    const results = await Promise.all(promises)
    const failedCount = results.filter(res => !res.success).length
    
    if (failedCount === 0) {
      toast.success(`${results.length} redemption berhasil diselesaikan`)
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

const fetchData = async (queryParams: Partial<VoucherRedemptionQueryParams> = {}) => {
  loading.value = true
  try {
    const params: VoucherRedemptionQueryParams = {
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value || undefined,
      page: queryParams.page || 1,
      limit: 10,
    }

    if (activeTab.value === 'pending') {
      params['status[]'] = ['pending']
    } else if (activeTab.value === 'processing') {
      params['status[]'] = ['processing']
    } else {
      params['status[]'] = ['completed']
    }

    if (appliedFilters.value.startDate) {
      params.startDate = appliedFilters.value.startDate
    }
    if (appliedFilters.value.endDate) {
      params.endDate = appliedFilters.value.endDate
    }

    const response = await redemptionService.getVoucherRedemptions(params)
    
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
