<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Package class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Produk dan Layanan</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Produk dan Layanan
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-6 w-full">
      <DataTable 
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && services.length === 0"
        :total-from="meta?.from"
        :total-to="meta?.to"
        :total-entries="meta?.total"
        :current-page="meta?.currentPage"
        :last-page="meta?.lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        @update:page="handlePageChange"
        @update:sort="handleSort"
        @update:order="handleOrderChange"
      >
        <template #filters>
          <DataFilter 
            :is-filter-active="isFilterActive"
            @apply="applyFilters"
            @reset="resetFilters"
            @cancel="cancelFilters"
          >
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Referensi Terakhir</span>
                <span @click="startDate = ''; endDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-neutral-800">Dari:</label>
                  <input v-model="startDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                  <input v-model="endDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                </div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Status</span>
                <span @click="isActive = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="isActive" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                <option value="">Semua Status</option>
                <option value="1">Aktif</option>
                <option value="0">Dihentikan</option>
              </select>
            </div>
          </DataFilter>
        </template>

        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in services" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('name')" class="text-primary font-medium border-r border-base-200 max-w-[300px] truncate" :title="item.name">
                <NuxtLink :to="`/service/${item.code}`" class="hover:underline">{{ item.name }}</NuxtLink>
              </td>
              <td v-show="isColumnVisible('lastReferanceDate')" class="border-r border-base-200">{{ formatDateShort(item.lastReferanceDate) }}</td>
              <td v-show="isColumnVisible('isActive')" class="border-r border-base-200 text-center px-4">
                <div :class="[
                  'badge border-none font-semibold text-[12px] rounded-lg w-full',
                  item.isActive ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                ]">
                  {{ item.isActive ? 'Aktif' : 'Dihentikan' }}
                </div>
              </td>
              <td v-show="isColumnVisible('totalPoint')" class="border-r border-base-200">{{ item.totalPoint }}</td>
              <td v-show="isColumnVisible('totalCustomerServices')" class="text-primary font-medium">{{ item.totalCustomerServices }}</td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, X, Package, Filter } from 'lucide-vue-next'
import { serviceService } from '~/services/service-service'
import type { Service, ServiceQueryParams, PaginationMeta } from '~/types/service'
import { formatDateShort } from '~/utils/date'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Produk & Layanan',
})

const columns = [
  { label: 'Nama Layanan', key: 'name', sortable: true },
  { label: 'Referensi Terakhir', key: 'lastReferanceDate', sortable: true },
  { label: 'Status Layanan', key: 'isActive', sortable: true },
  { label: 'Poin Didapatkan', key: 'totalPoint', sortable: true },
  { label: 'Pelanggan Anda', key: 'totalCustomerServices', sortable: true }
]

const services = ref<Service[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('totalPoint')
const currentOrder = ref<'asc' | 'desc'>('desc')

const isFilterActive = ref(false)

const startDate = ref('')
const endDate = ref('')
const isActive = ref('')

const appliedFilters = ref({
  startDate: '',
  endDate: '',
  isActive: ''
})

const fetchServices = async (queryParams: ServiceQueryParams = {}) => {
  loading.value = true
  try {
    const response = await serviceService.getServices({
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      startDate: appliedFilters.value.startDate || undefined,
      endDate: appliedFilters.value.endDate || undefined,
      isActive: appliedFilters.value.isActive === '' ? undefined : Number(appliedFilters.value.isActive),
      ...queryParams,
      page: queryParams.page || 1,
      limit: 10
    })
    
    if (response.success) {
      services.value = response.data
      meta.value = response.meta
    }
  }  finally {
    loading.value = false
  }
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchServices({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchServices({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchServices({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchServices({ page: 1 })
}

const resetFilters = () => {
    startDate.value = ''
    endDate.value = ''
    isActive.value = ''
    applyFilters()
}

const cancelFilters = () => {
    startDate.value = appliedFilters.value.startDate
    endDate.value = appliedFilters.value.endDate
    isActive.value = appliedFilters.value.isActive
}

const applyFilters = () => {
    appliedFilters.value = {
        startDate: startDate.value,
        endDate: endDate.value,
        isActive: isActive.value
    }
    isFilterActive.value = Object.values(appliedFilters.value).some(v => v !== '')
    fetchServices({ page: 1 })
}

onMounted(() => {
  fetchServices()
})
</script>
