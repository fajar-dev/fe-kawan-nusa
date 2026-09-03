<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Riwayat Unduhan Laporan</h1>
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> /
              <NuxtLink to="/report" class="text-primary hover:underline">Unduh Laporan</NuxtLink> /
              Riwayat Unduhan
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <DataTable
        flat
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && histories.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        v-model:search-query="searchQuery"
        search-placeholder="Cari periode atau nama admin..."
        @update:page="handlePageChange"
      >
        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="item in histories" :key="item.id" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateTimeShort(item.createdAt) }}
              </td>
              <td v-show="isColumnVisible('type')" class="border-r border-base-200 whitespace-nowrap">
                {{ typeLabel(item.type) }}
              </td>
              <td v-show="isColumnVisible('periodLabel')" class="border-r border-base-200 whitespace-nowrap">
                {{ item.periodLabel }}
              </td>
              <td v-show="isColumnVisible('format')" class="border-r border-base-200 whitespace-nowrap">
                <span class="badge badge-sm font-medium uppercase bg-neutral-100 text-neutral-600 border-none">{{ item.format }}</span>
              </td>
              <td v-show="isColumnVisible('requestedBy')" class="whitespace-nowrap">
                {{ item.requestedBy?.name || '-' }}
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reportService } from '~/services/report-service'
import type { ReportDownloadHistory, ReportType } from '~/types/report'
import { formatDateTimeShort } from '~/utils/date'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Riwayat Unduhan Laporan',
})

const columns = [
  { label: 'Waktu', key: 'createdAt', sortable: false },
  { label: 'Jenis Laporan', key: 'type', sortable: false },
  { label: 'Periode', key: 'periodLabel', sortable: false },
  { label: 'Format', key: 'format', sortable: false },
  { label: 'Diunduh Oleh', key: 'requestedBy', sortable: false },
]

const TYPE_LABELS: Record<ReportType, string> = {
  cash_redemption: 'Rekap Tukar Poin Tunai',
  product_voucher_redemption: 'Rekap Tukar Poin Produk & Voucher',
  referral_point: 'Rekap Poin Referral',
  point_balance: 'Saldo Poin & Data Referral',
}
const typeLabel = (type: ReportType) => TYPE_LABELS[type] || type

const histories = ref<ReportDownloadHistory[]>([])
const loading = ref(true)
const searchQuery = ref('')

const page = ref(1)
const lastPage = ref(1)
const meta = ref<PaginationMeta | null>(null)

const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

const fetchHistories = async () => {
  loading.value = true
  try {
    const res = await reportService.getDownloadHistories({
      page: page.value,
      limit: 10,
      q: searchQuery.value || undefined,
    })
    if (res.success && res.data) {
      histories.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      histories.value = []
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
    fetchHistories()
  }, 500)
})

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchHistories()
}

onMounted(() => {
  fetchHistories()
})
</script>
