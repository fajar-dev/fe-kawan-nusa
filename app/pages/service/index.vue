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
          <div class="dropdown dropdown-bottom md:dropdown-start">
            <div tabindex="0" role="button" class="btn btn-outline border-primary text-primary btn-md h-10 px-4 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors w-full md:w-auto">
              <Filter class="w-4 h-4 text-primary" />
              Filter
            </div>
            <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[450px] shadow-xl border border-base-200 mt-2 left-0 md:left-auto">
              <div class="card-body p-0">
                <div class="flex items-center justify-between px-6 py-4 border-b border-base-200">
                  <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                  <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                </div>
                <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Tanggal Aktif</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Dari:</label>
                        <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                        <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Status</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                      <option selected disabled>Semua Status</option>
                      <option>Aktif</option>
                      <option>Dihentikan</option>
                    </select>
                  </div>
                </div>
                <div class="p-4 border-t border-base-200 flex items-center justify-between">
                  <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">Atur Ulang</button>
                  <button class="btn bg-primary border-none text-white hover:bg-primary/90 btn-sm rounded-lg text-sm font-semibold h-10 px-6">Terapkan</button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in services" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('name')" class="text-primary font-medium border-r border-base-200 max-w-[300px] truncate">
                <NuxtLink :to="`/service/${item.code}`" class="hover:underline" :title="item.name">{{ item.name }}</NuxtLink>
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
              <td v-show="isColumnVisible('totalPoints')" class="border-r border-base-200">{{ item.totalPoints }}</td>
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

const columns = [
  { label: 'Nama Layanan', key: 'name', sortable: true },
  { label: 'Referensi Terakhir', key: 'lastReferanceDate', sortable: true },
  { label: 'Status Layanan', key: 'isActive', sortable: true },
  { label: 'Poin Didapatkan', key: 'totalPoints', sortable: true },
  { label: 'Pelanggan Anda', key: 'totalCustomerServices', sortable: true }
]

const services = ref<Service[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('name')
const currentOrder = ref<'asc' | 'desc'>('desc')

const fetchServices = async (queryParams: ServiceQueryParams = {}) => {
  loading.value = true
  try {
    const response = await serviceService.getServices({
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      ...queryParams,
      page: queryParams.page || 1,
      limit: 20
    })
    
    if (response.success) {
      services.value = response.data
      meta.value = response.meta
    }
  } catch (error) {
    console.error('Failed to fetch services:', error)
  } finally {
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

onMounted(() => {
  fetchServices()
})
</script>
