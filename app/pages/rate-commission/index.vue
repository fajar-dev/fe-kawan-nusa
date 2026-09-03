<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Rate Komisi</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Rate Komisi
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/rate-commission/history"
            class="btn btn-outline btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            <History class="w-4 h-4" />
          </NuxtLink>
          <button
            v-if="canCreate('rate-commission')"
            @click="openCreateModal"
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            Tambah Rate
          </button>
        </div>
      </template>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <!-- Tabs -->
      <div class="flex border-b border-base-200 w-full mb-2">
        <button
          @click="switchTab('OTC')"
          :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'OTC' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
        >
          Komisi OTC
        </button>
        <button
          @click="switchTab('Bulanan')"
          :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'Bulanan' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
        >
          Komisi Bulanan
        </button>
      </div>

      <DataTable
        :key="activeTab"
        flat
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && rates.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama layanan..."
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
            <!-- Tipe Komisi Filter -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tipe Komisi</span>
                <span v-if="filterType" @click="filterType = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="filterType" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium">
                <option value="">Semua</option>
                <option value="percentage">Persentase</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <!-- Periode Berlaku -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Periode Berlaku</span>
                <span v-if="filterStartFrom || filterStartTo" @click="filterStartFrom = ''; filterStartTo = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <label class="text-[11px] text-neutral-400 mb-1 block">Dari</label>
                  <input v-model="filterStartFrom" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                </div>
                <div class="flex-1">
                  <label class="text-[11px] text-neutral-400 mb-1 block">Sampai</label>
                  <input v-model="filterStartTo" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                </div>
              </div>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="item in rates" :key="item.id" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('service')" class="border-r border-base-200 max-w-xs truncate font-medium text-neutral-800" :title="item.service?.name">
                {{ item.service?.name || '-' }}
              </td>
              <td v-show="isColumnVisible('value')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatValue(item) }}
              </td>
              <td v-show="isColumnVisible('startDate')" class="border-r border-base-200 whitespace-nowrap">
                <span>{{ formatDate(item.startDate) }} &ndash; </span>
                <span v-if="item.endDate">{{ formatDate(item.endDate) }}</span>
                <span v-else>Selamanya</span>
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200 whitespace-nowrap">
                <span class="badge badge-sm font-medium" :class="statusBadgeClass(item)">{{ statusLabel(item) }}</span>
              </td>
              <td v-show="isColumnVisible('createdBy')" class="border-r border-base-200 whitespace-nowrap max-w-[150px] truncate" :title="item.createdBy?.name">
                {{ item.createdBy?.name || '-' }}
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div class="flex items-center justify-center gap-0">
                  <button v-if="canEdit('rate-commission')" @click="openEditModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Edit">
                    <SquarePen class="w-4.5 h-4.5" />
                  </button>
                  <button v-if="canDelete('rate-commission')" @click="openDeleteModal(item)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hapus">
                    <Trash2 class="w-4.5 h-4.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <!-- Modals -->
    <ModalRateCommissionForm
      v-model="isOpenFormModal"
      :rate="selectedRate"
      :loading="submitting"
      @submit="handleFormSubmit"
    />

    <ModalConfirmDelete
      v-model="isOpenDeleteModal"
      title="Hapus Rate Komisi"
      :message="`Apakah Anda yakin ingin menghapus rate komisi untuk layanan '${rateToDelete?.service?.name}'?`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, SquarePen, Trash2, History } from 'lucide-vue-next'
import { rateCommissionService } from '~/services/rate-commission-service'
import type { RateCommission, RateCommissionCategory, RateCommissionSubmitItem, RateCommissionValueType } from '~/types/rate-commission'
import { formatDateShort as formatDate } from '~/utils/date'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Rate Komisi',
})

const columns = [
  { label: 'Layanan', key: 'service', sortable: true },
  { label: 'Nilai', key: 'value', sortable: true },
  { label: 'Periode', key: 'startDate', sortable: true },
  { label: 'Status', key: 'status', sortable: false },
  { label: 'Dibuat Oleh', key: 'createdBy', sortable: false },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const activeTab = ref<RateCommissionCategory>('OTC')
const rates = ref<RateCommission[]>([])
const loading = ref(true)
const searchQuery = ref('')

// Filter state
const filterType = ref<RateCommissionValueType | ''>('')
const filterStartFrom = ref('')
const filterStartTo = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  type: '' as RateCommissionValueType | '',
  startFrom: '',
  startTo: '',
})

const page = ref(1)
const lastPage = ref(1)
const meta = ref<PaginationMeta | null>(null)

const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')

const toast = useToast()
const { canCreate, canEdit, canDelete } = usePermission()

const formatValue = (item: RateCommission) => {
  if (item.type === 'percentage') return `${item.value}%`
  return `Rp ${item.value.toLocaleString('id-ID')}`
}

// Status is derived client-side from startDate/endDate — not stored on the backend.
const getStatus = (item: RateCommission): 'Aktif' | 'Terjadwal' | 'Berakhir' => {
  const today = new Date().toISOString().slice(0, 10)
  if (item.startDate.slice(0, 10) > today) return 'Terjadwal'
  if (item.endDate && item.endDate.slice(0, 10) < today) return 'Berakhir'
  return 'Aktif'
}

const statusLabel = (item: RateCommission) => getStatus(item)

const statusBadgeClass = (item: RateCommission) => {
  const status = getStatus(item)
  if (status === 'Aktif') return 'bg-success/10 text-success border-success/20'
  if (status === 'Terjadwal') return 'bg-blue-50 text-blue-600 border-blue-200'
  return 'bg-neutral-100 text-neutral-500 border-neutral-200'
}

const fetchRates = async () => {
  loading.value = true
  try {
    const res = await rateCommissionService.getRateCommissions({
      page: page.value,
      limit: 10,
      category: activeTab.value,
      q: searchQuery.value || undefined,
      sort: currentSort.value,
      order: currentOrder.value,
      type: appliedFilters.value.type || undefined,
      startDateFrom: appliedFilters.value.startFrom || undefined,
      startDateTo: appliedFilters.value.startTo || undefined,
    })
    if (res.success && res.data) {
      rates.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      rates.value = []
      meta.value = null
      lastPage.value = 1
    }
  } finally {
    loading.value = false
  }
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchRates()
  }, 500)
})

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchRates()
}

const handleSort = (key: string) => {
  currentSort.value = key
  page.value = 1
  fetchRates()
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  page.value = 1
  fetchRates()
}

const switchTab = (tab: RateCommissionCategory) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  page.value = 1
  fetchRates()
}

// DataFilter triggers
const applyFilters = () => {
  appliedFilters.value = {
    type: filterType.value,
    startFrom: filterStartFrom.value,
    startTo: filterStartTo.value,
  }
  isFilterActive.value = appliedFilters.value.type !== '' ||
                          appliedFilters.value.startFrom !== '' ||
                          appliedFilters.value.startTo !== ''
  page.value = 1
  fetchRates()
}

const cancelFilters = () => {
  filterType.value = appliedFilters.value.type
  filterStartFrom.value = appliedFilters.value.startFrom
  filterStartTo.value = appliedFilters.value.startTo
}

const resetFilters = () => {
  filterType.value = ''
  filterStartFrom.value = ''
  filterStartTo.value = ''
  applyFilters()
}

// Modal state
const isOpenFormModal = ref(false)
const submitting = ref(false)
const selectedRate = ref<RateCommission | null>(null)

const openCreateModal = () => {
  selectedRate.value = null
  isOpenFormModal.value = true
}

const openEditModal = (item: RateCommission) => {
  selectedRate.value = item
  isOpenFormModal.value = true
}

const handleFormSubmit = async (items: RateCommissionSubmitItem[]) => {
  submitting.value = true
  try {
    if (selectedRate.value) {
      // Edit: always exactly one item, for the row's own (fixed) category.
      const item = items[0]
      if (!item) return
      const res = await rateCommissionService.updateRateCommission(selectedRate.value.id, item)
      if (res.success) {
        toast.success('Rate komisi berhasil diperbarui')
        isOpenFormModal.value = false
        fetchRates()
      } else {
        toast.error(res.message || 'Gagal memperbarui rate komisi')
      }
      return
    }

    // Create: 1 or 2 items (OTC and/or Bulanan) for the same product.
    const results = await Promise.all(items.map(item => rateCommissionService.createRateCommission(item)))
    const succeeded = results.filter(r => r.success)
    const failed = results.map((r, i) => ({ r, category: items[i]?.category })).filter(x => !x.r.success)

    if (succeeded.length > 0) {
      toast.success(`Rate komisi ${succeeded.length === items.length ? '' : `(${succeeded.length}/${items.length}) `}berhasil ditambahkan`)
    }
    for (const f of failed) {
      toast.error(`${f.category}: ${f.r.message || 'Gagal menyimpan'}`)
    }

    if (failed.length === 0) {
      isOpenFormModal.value = false
    }
    fetchRates()
  } finally {
    submitting.value = false
  }
}

const isOpenDeleteModal = ref(false)
const deleting = ref(false)
const rateToDelete = ref<RateCommission | null>(null)

const openDeleteModal = (item: RateCommission) => {
  rateToDelete.value = item
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!rateToDelete.value) return
  deleting.value = true
  try {
    const res = await rateCommissionService.deleteRateCommission(rateToDelete.value.id)
    if (res.success) {
      toast.success('Rate komisi berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchRates()
    } else {
      toast.error(res.message || 'Gagal menghapus rate komisi')
    }
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchRates()
})
</script>
