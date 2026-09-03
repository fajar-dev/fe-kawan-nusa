<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Riwayat Perubahan Rate Komisi</h1>
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> /
              <NuxtLink to="/rate-commission" class="text-primary hover:underline">Rate Komisi</NuxtLink> /
              Riwayat Perubahan
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <button
          @click="exportCsv"
          :disabled="exporting"
          class="btn btn-outline btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
        >
          <span v-if="exporting" class="loading loading-spinner loading-xs"></span>
          <Download v-else class="w-4 h-4" />
          Ekspor CSV
        </button>
      </template>
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
        search-placeholder="Cari nama layanan atau nama admin..."
        @update:page="handlePageChange"
      >
        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="item in histories" :key="item.id" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateTimeShort(item.createdAt) }}
              </td>
              <td v-show="isColumnVisible('action')" class="border-r border-base-200 whitespace-nowrap">
                <span class="badge badge-sm font-medium" :class="actionBadgeClass(item.action)">{{ actionLabel(item.action) }}</span>
              </td>
              <td v-show="isColumnVisible('service')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.service?.name">
                <p class="font-medium text-neutral-800 truncate">{{ item.service?.name || '-' }}</p>
                <p class="text-xs text-neutral-400">{{ item.category === 'Bulanan' ? 'Komisi Bulanan' : 'Komisi OTC' }}</p>
              </td>
              <td v-show="isColumnVisible('changes')" class="border-r border-base-200">
                <ul class="space-y-0.5">
                  <li v-for="(line, idx) in describeChanges(item)" :key="idx" class="whitespace-nowrap">{{ line }}</li>
                </ul>
              </td>
              <td v-show="isColumnVisible('notes')" class="border-r border-base-200 max-w-[200px] truncate" :title="item.notes || '-'">
                {{ item.notes || '-' }}
              </td>
              <td v-show="isColumnVisible('changedBy')" class="whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="avatar placeholder">
                    <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span class="text-primary font-semibold text-[10px]">{{ getInitials(item.changedBy?.name || '-') }}</span>
                    </div>
                  </div>
                  <span class="max-w-[120px] truncate" :title="item.changedBy?.name || '-'">{{ item.changedBy?.name || '-' }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import { rateCommissionService } from '~/services/rate-commission-service'
import type { RateCommissionHistory, RateCommissionValueType } from '~/types/rate-commission'
import { formatDateTimeShort, formatDateShort } from '~/utils/date'
import { getInitials } from '~/utils/initials'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Riwayat Perubahan Rate Komisi',
})

const columns = [
  { label: 'Waktu', key: 'createdAt', sortable: false },
  { label: 'Aksi', key: 'action', sortable: false },
  { label: 'Layanan', key: 'service', sortable: false },
  { label: 'Perubahan', key: 'changes', sortable: false },
  { label: 'Catatan', key: 'notes', sortable: false },
  { label: 'Oleh', key: 'changedBy', sortable: false },
]

const histories = ref<RateCommissionHistory[]>([])
const loading = ref(true)
const exporting = ref(false)
const searchQuery = ref('')

const page = ref(1)
const lastPage = ref(1)
const meta = ref<PaginationMeta | null>(null)

const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

const actionLabel = (action: RateCommissionHistory['action']) => action === 'created' ? 'Dibuat' : 'Diubah'
const actionBadgeClass = (action: RateCommissionHistory['action']) =>
  action === 'created' ? 'bg-success/10 text-success border-success/20' : 'bg-blue-50 text-blue-600 border-blue-200'

const formatValue = (value: number, type: RateCommissionValueType) => {
  return type === 'percentage' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')}`
}

const formatPeriod = (start: string, end: string | null) => {
  return `${formatDateShort(start)} – ${end ? formatDateShort(end) : 'Selamanya'}`
}

const describeChanges = (item: RateCommissionHistory): string[] => {
  if (item.action === 'created') {
    return [
      `Nilai: ${formatValue(item.toValue, item.toType)}`,
      `Periode: ${formatPeriod(item.toStartDate, item.toEndDate)}`,
    ]
  }

  const lines: string[] = []
  if (item.fromValue !== item.toValue || item.fromType !== item.toType) {
    lines.push(`Nilai: ${formatValue(item.fromValue ?? item.toValue, item.fromType ?? item.toType)} → ${formatValue(item.toValue, item.toType)}`)
  }
  if (item.fromStartDate !== item.toStartDate || item.fromEndDate !== item.toEndDate) {
    lines.push(`Periode: ${formatPeriod(item.fromStartDate ?? item.toStartDate, item.fromEndDate ?? null)} → ${formatPeriod(item.toStartDate, item.toEndDate)}`)
  }
  if (lines.length === 0) lines.push('Catatan diperbarui')
  return lines
}

const fetchHistories = async () => {
  loading.value = true
  try {
    const res = await rateCommissionService.getAllRateCommissionHistories({
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

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`

const exportCsv = async () => {
  exporting.value = true
  try {
    const res = await rateCommissionService.getAllRateCommissionHistories({
      page: 1,
      limit: 10000,
      q: searchQuery.value || undefined,
    })
    if (!res.success || !res.data || res.data.length === 0) return

    const header = ['Waktu', 'Aksi', 'Layanan', 'Tipe Komisi', 'Perubahan', 'Catatan', 'Oleh']
    const rows = res.data.map(item => [
      formatDateTimeShort(item.createdAt),
      actionLabel(item.action),
      item.service?.name || '-',
      item.category === 'Bulanan' ? 'Komisi Bulanan' : 'Komisi OTC',
      describeChanges(item).join(' | '),
      item.notes || '-',
      item.changedBy?.name || '-',
    ])

    const csvContent = [header, ...rows]
      .map(row => row.map(cell => csvEscape(String(cell))).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `riwayat-rate-komisi-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  fetchHistories()
})
</script>
