<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Input Poin Referral</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
           <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Input Poin Referral
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <button 
          v-if="canCreate('point-submission')"
          @click="openCreateModal" 
          class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
        >
          Input Poin
        </button>
      </template>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <!-- Tabs and Bulk Actions -->
      <div class="flex flex-col md:flex-row md:items-end justify-between w-full mb-2 border-b border-transparent md:border-base-200 gap-3 md:gap-0">
        <div class="flex border-b border-base-200 md:border-b-0 w-full md:w-auto">
          <button 
            @click="switchTab('pending')"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Belum Disetujui
          </button>
          <button
            @click="switchTab('approved')"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'approved' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Sudah Disetujui
          </button>
          <button
            @click="switchTab('monthly')"
            :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'monthly' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
          >
            Komisi Bulanan
          </button>
        </div>

        <!-- Bulk Action Button -->
        <div v-if="activeTab === 'pending' && canEdit('point-submission')" class="flex items-center gap-4 pb-2.5 md:pb-2 pr-4">
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
              @click="openApproveModal"
              :disabled="approving || selectedIds.length === 0"
              class="btn btn-primary btn-sm rounded-lg font-medium text-white flex items-center gap-2 h-9 min-h-0"
            >
              Setujui
            </button>
          </div>
        </div>
      </div>

      <DataTable
        v-if="activeTab !== 'monthly'"
        :key="activeTab"
        flat
        :columns="visibleColumns"
        :loading="loading"
        :is-empty="!loading && submissions.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama referral atau akun..."
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
                <span @click="filterType = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="filterType" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium">
                <option value="">Semua Tipe</option>
                <option value="OTC">OTC</option>
                <option value="Bulanan">Bulanan</option>
              </select>
            </div>

            <!-- Date Range -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tanggal Dibuat</span>
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
            <tr v-for="(item, index) in submissions" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Checkbox Column (pending tab only) -->
              <td v-if="activeTab === 'pending'" v-show="isColumnVisible('checkbox')" class="border-r border-base-200 w-12 text-center">
                <input 
                  type="checkbox" 
                  :checked="selectedIds.includes(item.id)" 
                  @change="toggleSelect(item.id)"
                  class="checkbox checkbox-primary checkbox-sm"
                />
              </td>
              <!-- Waktu Input Column (pending only) -->
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDate(item.createdAt) }}
              </td>
              <!-- Waktu Disetujui Column (approved only) -->
              <td v-show="isColumnVisible('approvedAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ item.approvedAt ? formatDate(item.approvedAt) : '-' }}
              </td>
              <!-- Nama Referral Column -->
              <td v-show="isColumnVisible('user')" class="border-r border-base-200 max-w-xs truncate" :title="item.user?.name">
                <NuxtLink :to="`/user/${item.user?.id}`" class="font-medium text-primary hover:underline">{{ item.user?.name || '-' }}</NuxtLink>
              </td>
              <!-- Jumlah Poin Column -->
              <td v-show="isColumnVisible('point')" class="border-r border-base-200 whitespace-nowrap">
                {{ (item.point || 0).toLocaleString('id-ID') }}
              </td>
              <!-- Tipe Komisi Column -->
              <td v-show="isColumnVisible('type')" class="border-r border-base-200 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span>{{ item.type }}</span>
                  <span v-if="item.isAuto" class="badge badge-sm bg-amber-50 text-amber-600 border-amber-200 font-medium gap-1" title="Dibuat otomatis oleh jadwal bulanan">
                    <RefreshCw class="w-3 h-3" /> Otomatis
                  </span>
                </div>
              </td>
              <!-- Nama Akun Column -->
              <td v-show="isColumnVisible('accountName')" class="border-r border-base-200 max-w-xs truncate" :title="item.nisData?.accountName">
                {{ item.nisData?.accountName || '-' }}
              </td>
              <!-- Account Manager Column -->
              <td v-show="isColumnVisible('accountManager')" class="border-r border-base-200 whitespace-nowrap max-w-[150px] truncate" :title="item.nisData?.accountManager">
                {{ item.nisData?.accountManager || '-' }}
              </td>
              <!-- Dibuat Oleh Column (pending only) -->
              <td v-show="isColumnVisible('createdBy')" class="border-r border-base-200 whitespace-nowrap max-w-[150px] truncate" :title="item.createdBy?.name">
                {{ item.createdBy?.name || '-' }}
              </td>
              <!-- Kadaluarsa Column (approved only) -->
              <td v-show="isColumnVisible('expiredAt')" class="border-r border-base-200 whitespace-nowrap max-w-[150px] truncate" :title="item.approvedAt ? formatDate(getExpiredDate(item.approvedAt)) : '-'">
                {{ item.approvedAt ? formatDate(getExpiredDate(item.approvedAt)) : '-' }}
              </td>
              <!-- Disetujui Oleh Column (approved only) -->
              <td v-show="isColumnVisible('approvedBy')" class="border-r border-base-200 whitespace-nowrap">
                {{ item.approvedBy?.name || '-' }}
              </td>
              <!-- Deskripsi Column (approved only) -->
              <td v-show="isColumnVisible('notes')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.notes || ''">
                {{ item.notes || '-' }}
              </td>
              <!-- Action Column -->
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div class="flex items-center justify-center gap-0">
                  <template v-if="activeTab === 'pending'">
                    <button v-if="canEdit('point-submission')" @click="openEditModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Edit">
                      <SquarePen class="w-4.5 h-4.5" />
                    </button>
                    <button v-if="canDelete('point-submission')" @click="openDeleteModal(item)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hapus">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </template>
                  <template v-else>
                    <button @click="openEditModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Lihat">
                      <Eye class="w-4.5 h-4.5" />
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>

      <!-- Monthly commission schedules tab -->
      <DataTable
        v-else
        key="monthly"
        flat
        :columns="scheduleColumns"
        :loading="loading"
        :is-empty="!loading && schedules.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        :current-sort="scheduleSort"
        :current-order="scheduleOrder"
        :show-search="false"
        @update:page="handlePageChange"
        @update:sort="handleScheduleSort"
        @update:order="handleScheduleOrderChange"
      >
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(s, i) in schedules" :key="i" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('user')" class="border-r border-base-200 max-w-xs truncate" :title="s.user?.name">
                <NuxtLink :to="`/user/${s.user?.id}`" class="font-medium text-primary hover:underline">{{ s.user?.name || '-' }}</NuxtLink>
              </td>
              <td v-show="isColumnVisible('account')" class="border-r border-base-200 max-w-xs truncate" :title="s.nisData?.accountName">
                {{ s.nisData?.accountName || '-' }}
              </td>
              <td v-show="isColumnVisible('price')" class="border-r border-base-200 whitespace-nowrap">
                Rp {{ (s.price || 0).toLocaleString('id-ID') }}
              </td>
              <td v-show="isColumnVisible('point')" class="border-r border-base-200 whitespace-nowrap">
                {{ (s.point || 0).toLocaleString('id-ID') }}
              </td>
              <td v-show="isColumnVisible('anchorDay')" class="border-r border-base-200 whitespace-nowrap">
                Tiap tanggal {{ s.anchorDay }}
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200 whitespace-nowrap">
                <span :class="['badge badge-sm font-medium', s.isActive ? 'bg-success/10 text-success border-success/20' : 'bg-neutral-100 text-neutral-500 border-neutral-200']">
                  {{ s.isActive ? 'Aktif' : 'Berhenti' }}
                </span>
              </td>
              <td v-show="isColumnVisible('createdBy')" class="border-r border-base-200 whitespace-nowrap max-w-[150px] truncate" :title="s.createdBy?.name">
                {{ s.createdBy?.name || '-' }}
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div v-if="s.isActive && canEdit('point-submission')" class="flex items-center justify-center gap-0">
                  <button @click="openAdjustModal(s)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Adjust Komisi">
                    <SquarePen class="w-4.5 h-4.5" />
                  </button>
                  <button @click="openStopModal(s)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hentikan Jadwal">
                    <Ban class="w-4.5 h-4.5" />
                  </button>
                </div>
                <span v-else class="text-neutral-300">-</span>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <!-- Modals -->
    <ModalPointSubmissionForm
      v-model="isOpenFormModal"
      :submission="selectedSubmission"
      :loading="submitting"
      @submit="handleFormSubmit"
    />

    <ModalConfirmDelete
      v-model="isOpenDeleteModal"
      title="Hapus Poin Referral"
      :message="`Apakah Anda yakin ingin menghapus poin referral untuk '${submissionToDelete?.user?.name || ''}'? Tindakan ini tidak dapat dibatalkan.`"
      :loading="deleting"
      @confirm="handleDelete"
    />

    <ModalApproveConfirm
      v-model="isOpenApproveModal"
      :count="selectedIds.length"
      :loading="approving"
      @confirm="handleApprove"
    />

    <ModalAdjustCommission
      v-model="isOpenAdjustModal"
      :schedule="scheduleToAdjust"
      :loading="adjusting"
      @submit="handleAdjust"
    />

    <ModalConfirmDelete
      v-model="isOpenStopModal"
      title="Hentikan Jadwal Bulanan"
      :message="`Hentikan komisi bulanan otomatis untuk '${scheduleToStop?.user?.name || ''}' (${scheduleToStop?.nisData?.accountName || ''})? Submission bulanan tidak akan dibuat lagi.`"
      :loading="stopping"
      @confirm="handleStop"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, SquarePen, Trash2, Eye, RefreshCw, Ban } from 'lucide-vue-next'
import { pointSubmissionService } from '~/services/point-submission-service'
import type { PointSubmission, PointSubmissionSchedule } from '~/types/point-submission'
import { formatDateTimeShort as formatDate, getExpiredDate } from '~/utils/date'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Input Poin Referral',
})

const activeTab = ref<'pending' | 'approved' | 'monthly'>('pending')

const pendingColumns = [
  { label: '', key: 'checkbox', sortable: false },
  { label: 'Waktu Input', key: 'createdAt', sortable: true },
  { label: 'Nama Referral', key: 'user', sortable: true },
  { label: 'Jumlah Poin', key: 'point', sortable: true },
  { label: 'Tipe Komisi', key: 'type', sortable: true },
  { label: 'Nama Akun', key: 'accountName', sortable: false },
  { label: 'Account Manager', key: 'accountManager', sortable: false },
  { label: 'Dibuat Oleh', key: 'createdBy', sortable: false },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const approvedColumns = [
  { label: 'Waktu Disetujui', key: 'approvedAt', sortable: true },
  { label: 'Nama Referral', key: 'user', sortable: true },
  { label: 'Poin Diserahkan', key: 'point', sortable: true },
  { label: 'Tipe Komisi', key: 'type', sortable: true },
  { label: 'Nama Akun', key: 'accountName', sortable: false },
  { label: 'Nama Account Manager', key: 'accountManager', sortable: false },
  { label: 'Kadaluarsa', key: 'expiredAt', sortable: false },
  { label: 'Disetujui Oleh', key: 'approvedBy', sortable: false },
  { label: 'Deskripsi', key: 'notes', sortable: false },
]

const scheduleColumns = [
  { label: 'Nama Referral', key: 'user', sortable: true },
  { label: 'Nama Akun', key: 'account', sortable: false },
  { label: 'Komisi / Bulan', key: 'price', sortable: true },
  { label: 'Poin / Bulan', key: 'point', sortable: true },
  { label: 'Jadwal', key: 'anchorDay', sortable: true },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Dibuat Oleh', key: 'createdBy', sortable: false },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const visibleColumns = computed(() => activeTab.value === 'pending' ? pendingColumns : approvedColumns)

const submissions = ref<PointSubmission[]>([])
const schedules = ref<PointSubmissionSchedule[]>([])
const loading = ref(true)

// Filter & Search states
const searchQuery = ref('')
const filterType = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  type: '',
  startDate: '',
  endDate: ''
})

const page = ref(1)
const lastPage = ref(1)
const meta = ref<PaginationMeta | null>(null)

// Derived states for pagination
const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

// Modal states
const isOpenFormModal = ref(false)
const selectedSubmission = ref<PointSubmission | null>(null)
const submitting = ref(false)

const isOpenDeleteModal = ref(false)
const submissionToDelete = ref<PointSubmission | null>(null)
const deleting = ref(false)

const isOpenApproveModal = ref(false)
const approving = ref(false)

// Bulk select
const selectedIds = ref<number[]>([])

const isAllSelected = computed(() => {
  return submissions.value.length > 0 && selectedIds.value.length === submissions.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = submissions.value.map(item => item.id)
  }
}

const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')

const scheduleSort = ref('createdAt')
const scheduleOrder = ref<'asc' | 'desc'>('desc')

const toast = useToast()
const { canCreate, canEdit, canDelete } = usePermission()

const fetchSubmissions = async () => {
  loading.value = true
  try {
    const res = await pointSubmissionService.getSubmissions({
      page: page.value,
      limit: 10,
      status: activeTab.value,
      type: appliedFilters.value.type || undefined,
      q: searchQuery.value || undefined,
      sort: currentSort.value,
      order: currentOrder.value,
      startDate: appliedFilters.value.startDate || undefined,
      endDate: appliedFilters.value.endDate || undefined
    })
    
    if (res.success && res.data) {
      submissions.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      submissions.value = []
      meta.value = null
      lastPage.value = 1
    }
  } finally {
    loading.value = false
  }
}

const fetchSchedules = async () => {
  loading.value = true
  try {
    const res = await pointSubmissionService.getSchedules({
      page: page.value,
      limit: 10,
      sort: scheduleSort.value,
      order: scheduleOrder.value
    })
    if (res.success && res.data) {
      schedules.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      schedules.value = []
      meta.value = null
      lastPage.value = 1
    }
  } finally {
    loading.value = false
  }
}

const refetch = () => (activeTab.value === 'monthly' ? fetchSchedules() : fetchSubmissions())

// Watchers for filtering and searching
let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchSubmissions()
  }, 500)
})

const handlePageChange = (newPage: number) => {
  page.value = newPage
  refetch()
}

const handleSort = (key: string) => {
  currentSort.value = key
  page.value = 1
  fetchSubmissions()
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  page.value = 1
  fetchSubmissions()
}

const handleScheduleSort = (key: string) => {
  scheduleSort.value = key
  page.value = 1
  fetchSchedules()
}

const handleScheduleOrderChange = (order: 'asc' | 'desc') => {
  scheduleOrder.value = order
  page.value = 1
  fetchSchedules()
}

// Tab switching
const switchTab = (tab: 'pending' | 'approved' | 'monthly') => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  selectedIds.value = []
  page.value = 1
  refetch()
}

watch(submissions, () => {
  selectedIds.value = []
})

// DataFilter triggers
const applyFilters = () => {
  appliedFilters.value = {
    type: filterType.value,
    startDate: filterStartDate.value,
    endDate: filterEndDate.value
  }
  isFilterActive.value = appliedFilters.value.type !== '' || appliedFilters.value.startDate !== '' || appliedFilters.value.endDate !== ''
  page.value = 1
  fetchSubmissions()
}

const cancelFilters = () => {
  filterType.value = appliedFilters.value.type
  filterStartDate.value = appliedFilters.value.startDate
  filterEndDate.value = appliedFilters.value.endDate
}

const resetFilters = () => {
  filterType.value = ''
  filterStartDate.value = ''
  filterEndDate.value = ''
  applyFilters()
}

// Bulk select
const toggleSelect = (id: number) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// Dialog open helpers
const openCreateModal = () => {
  selectedSubmission.value = null
  isOpenFormModal.value = true
}

const openEditModal = (item: PointSubmission) => {
  if (item.status === 'approved' && activeTab.value === 'approved') {
    // View only mode for approved items — we can still open the form in view
    selectedSubmission.value = item
    isOpenFormModal.value = true
    return
  }
  selectedSubmission.value = item
  isOpenFormModal.value = true
}

const handleFormSubmit = async (formData: any) => {
  submitting.value = true
  try {
    let response
    const id = selectedSubmission.value?.id
    if (id) {
      response = await pointSubmissionService.updateSubmission(id, formData)
      if (response.success) {
        toast.success('Poin referral berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui poin referral')
      }
    } else {
      response = await pointSubmissionService.createSubmission(formData)
      if (response.success) {
        toast.success('Poin referral berhasil ditambahkan')
      } else {
        toast.error(response.message || 'Gagal menambahkan poin referral')
      }
    }
    isOpenFormModal.value = false
    fetchSubmissions()
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (item: PointSubmission) => {
  if (item.status === 'approved') {
    toast.error('Poin yang sudah disetujui tidak dapat dihapus')
    return
  }
  submissionToDelete.value = item
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!submissionToDelete.value) return
  deleting.value = true
  try {
    const res = await pointSubmissionService.deleteSubmission(submissionToDelete.value.id)
    if (res.success) {
      toast.success('Poin referral berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchSubmissions()
    } else {
      toast.error(res.message || 'Gagal menghapus poin referral')
    }
  } finally {
    deleting.value = false
  }
}

// Approve
const openApproveModal = () => {
  if (selectedIds.value.length === 0) return
  isOpenApproveModal.value = true
}

const handleApprove = async (payload: { notes: string }) => {
  approving.value = true
  try {
    const res = await pointSubmissionService.approveSubmissions(selectedIds.value, payload.notes || undefined)
    if (res.success) {
      toast.success(`${selectedIds.value.length} poin referral berhasil disetujui`)
      isOpenApproveModal.value = false
      selectedIds.value = []
      fetchSubmissions()
    } else {
      toast.error(res.message || 'Gagal menyetujui poin referral')
    }
  } finally {
    approving.value = false
  }
}

// Monthly schedule: adjust commission + stop
const isOpenAdjustModal = ref(false)
const scheduleToAdjust = ref<PointSubmissionSchedule | null>(null)
const adjusting = ref(false)

const openAdjustModal = (s: PointSubmissionSchedule) => {
  scheduleToAdjust.value = s
  isOpenAdjustModal.value = true
}

const handleAdjust = async (price: number) => {
  if (!scheduleToAdjust.value) return
  adjusting.value = true
  try {
    const res = await pointSubmissionService.adjustSchedule(scheduleToAdjust.value.id, price)
    if (res.success) {
      toast.success('Komisi bulanan berhasil diperbarui')
      isOpenAdjustModal.value = false
      fetchSchedules()
    } else {
      toast.error(res.message || 'Gagal memperbarui komisi bulanan')
    }
  } finally {
    adjusting.value = false
  }
}

const isOpenStopModal = ref(false)
const scheduleToStop = ref<PointSubmissionSchedule | null>(null)
const stopping = ref(false)

const openStopModal = (s: PointSubmissionSchedule) => {
  scheduleToStop.value = s
  isOpenStopModal.value = true
}

const handleStop = async () => {
  if (!scheduleToStop.value) return
  stopping.value = true
  try {
    const res = await pointSubmissionService.stopSchedule(scheduleToStop.value.id)
    if (res.success) {
      toast.success('Jadwal komisi bulanan dihentikan')
      isOpenStopModal.value = false
      fetchSchedules()
    } else {
      toast.error(res.message || 'Gagal menghentikan jadwal')
    }
  } finally {
    stopping.value = false
  }
}

onMounted(() => {
  fetchSubmissions()
})
</script>
