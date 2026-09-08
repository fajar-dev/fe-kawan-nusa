<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Penyesuaian Poin</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Manajemen Poin / Penyesuaian Poin
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <button
          v-if="canCreate('point-adjustment')"
          @click="isOpenCreateModal = true"
          class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Ajukan Penyesuaian
        </button>
      </template>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <!-- Info banner -->
      <div v-if="showInfoBanner" class="flex items-center justify-between gap-3 bg-primary/5 border border-primary/20 text-primary text-sm rounded-lg px-4 py-3">
        <div class="flex items-center gap-2">
          <Info class="w-4 h-4 shrink-0" />
          <span>
            Kamu login sebagai <span class="font-semibold">{{ currentEmployeeName }}</span>.
            Ajukan koreksi poin untuk entri yang masih <span class="font-semibold">Belum Disetujui</span> — sebelum poin masuk saldo referral.
          </span>
        </div>
        <button @click="showInfoBanner = false" class="text-primary/60 hover:text-primary shrink-0">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Lock warning banner -->
      <div class="flex items-start gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-lg px-4 py-3">
        <Lock class="w-4 h-4 mt-0.5 shrink-0" />
        <span>Begitu diajukan, entri <span class="font-semibold">dikunci dan keluar dari antrean approve Admin</span> sampai atasan Anda memutuskan — poin tidak akan keburu masuk saldo.</span>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-base-200 w-full mb-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="switchTab(tab.key)"
          :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs flex items-center gap-2', activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
        >
          {{ tab.label }}
          <span class="badge badge-sm" :class="activeTab === tab.key ? 'bg-primary/10 text-primary border-none' : 'bg-neutral-100 text-neutral-500 border-none'">{{ counts[tab.key] ?? 0 }}</span>
        </button>
      </div>

      <DataTable
        :key="activeTab"
        flat
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && adjustments.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        v-model:search-query="searchQuery"
        search-placeholder="Cari kode, referral, layanan, atau AM..."
        @update:page="handlePageChange"
      >
        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="item in adjustments" :key="item.id" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('code')" class="border-r border-base-200 whitespace-nowrap font-medium text-primary">
                {{ item.code }}
              </td>
              <td v-show="isColumnVisible('referral')" class="border-r border-base-200 max-w-[180px]">
                <p class="font-medium text-neutral-800 truncate">{{ item.pointSubmission?.accountName || '-' }}</p>
                <p class="text-xs text-neutral-400 truncate">{{ item.pointSubmission?.custId }}</p>
              </td>
              <td v-show="isColumnVisible('service')" class="border-r border-base-200 max-w-[160px] truncate">
                {{ item.pointSubmission?.serviceName || '-' }}
              </td>
              <td v-show="isColumnVisible('type')" class="border-r border-base-200 whitespace-nowrap">
                <span class="badge badge-sm bg-blue-50 text-blue-600 border-blue-200 font-medium">{{ item.pointSubmission?.type }}</span>
              </td>
              <td v-show="isColumnVisible('value')" class="border-r border-base-200 whitespace-nowrap">
                <span class="text-neutral-400 line-through decoration-neutral-300">Rp{{ formatNumber(item.fromValue) }}</span>
                <ArrowRight class="w-3 h-3 inline mx-1 text-neutral-400" />
                <span class="font-semibold text-neutral-800">Rp{{ formatNumber(item.toValue) }}</span>
              </td>
              <td v-show="isColumnVisible('point')" class="border-r border-base-200 whitespace-nowrap">
                <span class="text-neutral-400 line-through decoration-neutral-300">{{ formatNumber(item.fromPoint) }}</span>
                <ArrowRight class="w-3 h-3 inline mx-1 text-neutral-400" />
                <span class="font-semibold text-neutral-800">{{ formatNumber(item.toPoint) }}</span>
                <span class="badge badge-sm ml-1.5" :class="item.toPoint - item.fromPoint >= 0 ? 'bg-success/10 text-success border-none' : 'bg-red-50 text-red-500 border-none'">
                  {{ item.toPoint - item.fromPoint >= 0 ? '+' : '' }}{{ formatNumber(item.toPoint - item.fromPoint) }}
                </span>
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 badge badge-sm font-medium" :class="statusBadgeClass(item.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(item.status)"></span>
                  {{ statusLabel(item.status) }}
                </span>
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center px-4 whitespace-nowrap">
                <button @click="openDetail(item.id)" class="text-primary text-xs font-medium hover:underline">
                  {{ actionLabel(item) }}
                </button>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <ModalPointAdjustmentCreate
      v-model="isOpenCreateModal"
      :submitting="creating"
      @submit="handleCreate"
    />

    <ModalPointAdjustmentDetail
      v-model="isOpenDetailModal"
      :adjustment-id="selectedId"
      @changed="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, Plus, Info, Lock, X, ArrowRight } from 'lucide-vue-next'
import { pointAdjustmentService } from '~/services/point-adjustment-service'
import { formatNumber } from '~/utils/string'
import type { PointAdjustment, PointAdjustmentStatus, PointAdjustmentTab, PointAdjustmentCounts } from '~/types/point-adjustment'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Penyesuaian Poin',
})

const { canCreate } = usePermission()
const { state } = useAuth()
const currentEmployeeName = computed(() => state.user?.name || '-')
const showInfoBanner = ref(true)

const columns = [
  { label: 'Kode', key: 'code', sortable: false },
  { label: 'Referral / Akun', key: 'referral', sortable: false },
  { label: 'Layanan', key: 'service', sortable: false },
  { label: 'Tipe', key: 'type', sortable: false },
  { label: 'Komisi (asli → usulan)', key: 'value', sortable: false },
  { label: 'Poin', key: 'point', sortable: false },
  { label: 'Status', key: 'status', sortable: false },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const tabs: { key: PointAdjustmentTab; label: string }[] = [
  { key: 'menunggu_sm', label: 'Menunggu SM' },
  { key: 'perlu_revisi', label: 'Perlu Revisi' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai', label: 'Selesai' },
]

const activeTab = ref<PointAdjustmentTab>('menunggu_sm')
const adjustments = ref<PointAdjustment[]>([])
const loading = ref(true)
const searchQuery = ref('')
const counts = ref<PointAdjustmentCounts>({ menunggu_sm: 0, perlu_revisi: 0, diproses: 0, selesai: 0 })

const page = ref(1)
const lastPage = ref(1)
const meta = ref<PaginationMeta | null>(null)
const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

const statusLabel = (status: PointAdjustmentStatus) => ({
  pending_approval: 'Menunggu SM',
  needs_revision: 'Perlu Revisi',
  approved_pending_credit: 'Menunggu Credit',
  completed: 'Sudah Credit',
}[status])

const statusBadgeClass = (status: PointAdjustmentStatus) => ({
  pending_approval: 'bg-amber-50 text-amber-600 border-amber-200',
  needs_revision: 'bg-blue-50 text-blue-600 border-blue-200',
  approved_pending_credit: 'bg-purple-50 text-purple-600 border-purple-200',
  completed: 'bg-success/10 text-success border-success/20',
}[status])

const statusDotClass = (status: PointAdjustmentStatus) => ({
  pending_approval: 'bg-amber-500',
  needs_revision: 'bg-blue-500',
  approved_pending_credit: 'bg-purple-500',
  completed: 'bg-success',
}[status])

const actionLabel = (item: PointAdjustment) => {
  if (item.status === 'needs_revision' && item.requestedBy?.id === state.user?.id) return 'Perbaiki'
  return 'Lihat'
}

const fetchCounts = async () => {
  const res = await pointAdjustmentService.getCounts()
  if (res.success) counts.value = res.data
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await pointAdjustmentService.getList({
      page: page.value,
      limit: 10,
      q: searchQuery.value || undefined,
      tab: activeTab.value,
    })
    if (res.success && res.data) {
      adjustments.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      adjustments.value = []
      meta.value = null
      lastPage.value = 1
    }
  } finally {
    loading.value = false
  }
  fetchCounts()
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchData()
  }, 500)
})

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchData()
}

const switchTab = (tab: PointAdjustmentTab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  page.value = 1
  fetchData()
}

const isOpenCreateModal = ref(false)
const creating = ref(false)
const toast = useToast()

const handleCreate = async (payload: { pointSubmissionId: number; toValue: number; reason: string }) => {
  creating.value = true
  try {
    const res = await pointAdjustmentService.create(payload)
    if (res.success) {
      toast.success('Pengajuan penyesuaian poin berhasil dikirim')
      isOpenCreateModal.value = false
      activeTab.value = 'menunggu_sm'
      page.value = 1
      fetchData()
    } else {
      toast.error(res.message || 'Gagal mengajukan penyesuaian poin')
    }
  } finally {
    creating.value = false
  }
}

const isOpenDetailModal = ref(false)
const selectedId = ref<number | null>(null)

const openDetail = (id: number) => {
  selectedId.value = id
  isOpenDetailModal.value = true
}

onMounted(() => {
  fetchData()
})
</script>
