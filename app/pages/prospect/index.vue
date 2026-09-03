<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Prospek Saya</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              Daftar calon customer yang mendaftar lewat link referral Anda, menunggu proses validasi dan verifikasi dari tim Sales Nusanet.
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
        :is-empty="!loading && filteredProspects.length === 0"
        :total-from="filteredProspects.length === 0 ? 0 : 1"
        :total-to="filteredProspects.length"
        :total-entries="filteredProspects.length"
        :current-page="1"
        :last-page="1"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama customer..."
      >
        <!-- Filters Slot -->
        <template #filters>
          <DataFilter
            :is-filter-active="isFilterActive"
            @apply="applyFilters"
            @reset="resetFilters"
            @cancel="cancelFilters"
          >
            <!-- Status -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Status</span>
                <span v-if="filterStatus" @click="filterStatus = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="filterStatus" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium">
                <option value="">Semua Status</option>
                <option value="Diproses">Diproses</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            <!-- Tanggal Regist -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tanggal Regist</span>
                <span v-if="filterDateFrom || filterDateTo" @click="filterDateFrom = ''; filterDateTo = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <label class="text-[11px] text-neutral-400 mb-1 block">Dari</label>
                  <input v-model="filterDateFrom" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                </div>
                <div class="flex-1">
                  <label class="text-[11px] text-neutral-400 mb-1 block">Sampai</label>
                  <input v-model="filterDateTo" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                </div>
              </div>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="item in filteredProspects" :key="item.id" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 max-w-[160px] truncate font-medium text-neutral-800" :title="item.name">
                {{ item.name }}
              </td>
              <td v-show="isColumnVisible('services')" class="border-r border-base-200 whitespace-nowrap">
                <span>{{ item.services[0] }}</span>
                <span v-if="item.services.length > 1" class="badge badge-sm bg-accent border-none text-primary font-semibold ml-1.5">
                  +{{ item.services.length - 1 }}
                </span>
              </td>
              <td v-show="isColumnVisible('estimatedPoints')" class="border-r border-base-200 whitespace-nowrap">
                <span class="font-semibold text-neutral-800">{{ formatNumber(item.estimatedPoints) }}</span> Poin
              </td>
              <td v-show="isColumnVisible('registDate')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateShort(item.registDate) }}
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200 whitespace-nowrap">
                <span class="badge badge-sm font-medium" :class="statusBadgeClass(item.status)">{{ item.status }}</span>
              </td>
              <td v-show="isColumnVisible('actions')" class="text-center px-4 whitespace-nowrap">
                <button
                  v-if="item.status === 'Diproses'"
                  @click="openHistoryModal(item)"
                  class="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1.5"
                >
                  Detail
                  <ExternalLink class="w-3.5 h-3.5" />
                </button>
                <NuxtLink
                  v-else
                  :to="`/prospect/${item.id}`"
                  class="text-primary text-xs font-medium hover:underline inline-flex items-center gap-1.5"
                >
                  View
                  <ExternalLink class="w-3.5 h-3.5" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <ModalProspectHistory
      v-model="isOpenHistoryModal"
      :prospect="selectedProspect"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, ExternalLink } from 'lucide-vue-next'
import { formatDateShort } from '~/utils/date'
import { formatNumber } from '~/utils/string'
import type { Prospect, ProspectStatus } from '~/types/prospect'

definePageMeta({
  role: 'user',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Prospek Saya',
})

const columns = [
  { label: 'Nama', key: 'name', sortable: false },
  { label: 'Layanan', key: 'services', sortable: false },
  { label: 'Perkiraan Poin Didapatkan', key: 'estimatedPoints', sortable: false },
  { label: 'Tanggal Regist', key: 'registDate', sortable: false },
  { label: 'Status', key: 'status', sortable: false },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const loading = ref(false)
const searchQuery = ref('')

const { getProspects } = useProspects()
const prospects = ref<Prospect[]>(getProspects())

const filterStatus = ref<ProspectStatus | ''>('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  status: '' as ProspectStatus | '',
  dateFrom: '',
  dateTo: '',
})

const filteredProspects = computed(() => {
  return prospects.value.filter(p => {
    if (searchQuery.value && !p.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (appliedFilters.value.status && p.status !== appliedFilters.value.status) return false
    if (appliedFilters.value.dateFrom && p.registDate < appliedFilters.value.dateFrom) return false
    if (appliedFilters.value.dateTo && p.registDate > appliedFilters.value.dateTo) return false
    return true
  })
})

const statusBadgeClass = (status: ProspectStatus) => {
  if (status === 'Disetujui') return 'bg-success/10 text-success border-success/20'
  if (status === 'Ditolak') return 'bg-red-50 text-red-500 border-red-200'
  return 'bg-amber-50 text-amber-600 border-amber-200'
}

const cancelFilters = () => {
  filterStatus.value = appliedFilters.value.status
  filterDateFrom.value = appliedFilters.value.dateFrom
  filterDateTo.value = appliedFilters.value.dateTo
}

const applyFilters = () => {
  appliedFilters.value = {
    status: filterStatus.value,
    dateFrom: filterDateFrom.value,
    dateTo: filterDateTo.value,
  }
  isFilterActive.value = appliedFilters.value.status !== '' ||
                          appliedFilters.value.dateFrom !== '' ||
                          appliedFilters.value.dateTo !== ''
}

const resetFilters = () => {
  filterStatus.value = ''
  filterDateFrom.value = ''
  filterDateTo.value = ''
  applyFilters()
}

const isOpenHistoryModal = ref(false)
const selectedProspect = ref<Prospect | null>(null)

const openHistoryModal = (item: Prospect) => {
  selectedProspect.value = item
  isOpenHistoryModal.value = true
}
</script>
