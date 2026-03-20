<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Users class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Pelanggan Saya</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Pelanggan Saya
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
        :is-empty="!loading && customers.length === 0"
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
        <!-- Filters Slot -->
        <template #filters>
          <div class="dropdown dropdown-bottom md:dropdown-start">
            <div tabindex="0" role="button" class="btn btn-outline border-primary text-primary btn-md h-10 px-4 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors w-full md:w-auto">
              <FilterIcon class="w-4 h-4 text-primary" />
              Filter
            </div>
            <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[450px] shadow-xl border border-base-200 mt-2 left-0 md:left-auto">
              <div class="card-body p-0">
                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-2 border-b border-base-200">
                  <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                  <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                </div>
                
                <!-- Content -->
                <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
                  <!-- Tanggal Aktif -->
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

                  <!-- Tipe Industri -->
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Tipe Industri</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                      <option selected disabled>Semua Industri</option>
                      <option>Technology</option>
                      <option>Manufacturing</option>
                      <option>Retail</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Status</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                      <option selected disabled>Pilih Status</option>
                      <option>Aktif</option>
                      <option>Tidak Aktif</option>
                    </select>
                  </div>

                  <!-- Layanan -->
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Layanan</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                      <option selected disabled>Semua Layanan</option>
                      <option>Nusanet Dedicated</option>
                      <option>Nusafiber</option>
                    </select>
                  </div>
                </div>

                <!-- Footer -->
                <div class="p-4 border-t border-base-200 flex items-center justify-between">
                  <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">
                    Atur Ulang
                  </button>
                  <button class="btn bg-[#e8f2e6] border-none text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in customers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('id')" class="text-primary border-r border-base-200 max-w-[100px] truncate">
                <NuxtLink :to="`/customer/${item.id}`" class="hover:underline">{{ item.id }}</NuxtLink>
              </td>
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 max-w-[150px] truncate">{{ item.name }}</td>
              <td v-show="isColumnVisible('company')" class="border-r border-base-200 max-w-[150px] truncate">{{ item.company || '-' }}</td>
              <td v-show="isColumnVisible('isActive')" class="border-r border-base-200 text-center">
                <div class="badge bg-accent border-none text-primary font-semibold text-[12px] w-full rounded-lg">
                  {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </div>
              </td>
              <td v-show="isColumnVisible('activationDate')" class="border-r border-base-200 whitespace-nowrap">{{ formatDateShort(item.activationDate) }}</td>
              <td v-show="isColumnVisible('emails')" class="border-r border-base-200 max-w-[180px]">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate flex-1">{{ item.emails?.[0]?.email || '-' }}</span>
                  <div v-if="item.emails?.length > 1" class="badge bg-accent border-none text-primary font-semibold text-[12px] rounded-lg shrink-0">
                    +{{ item.emails.length - 1 }} <ChevronDown class="w-3 h-3" />
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('phones')" class="border-r border-base-200 max-w-[150px]">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate flex-1">{{ item.phones?.[0]?.phone || '-' }}</span>
                  <div v-if="item.phones?.length > 1" class="badge bg-accent border-none text-primary font-semibold text-[12px] rounded-lg shrink-0">
                    +{{ item.phones.length - 1 }} <ChevronDown class="w-3 h-3" />
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('salesName')" class="max-w-[120px] truncate">{{ item.salesName || '-' }}</td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, CircleHelp, ChevronDown, X, 
  Filter as FilterIcon
} from 'lucide-vue-next'
import { customerService } from '~/services/customer-service'
import type { Customer, CustomerQueryParams } from '~/types/customer'

definePageMeta({
  bgColor: 'bg-white'
})

const columns = [
  { label: 'ID Pelanggan', key: 'id', sortable: true },
  { label: 'Nama PIC', key: 'name', sortable: true },
  { label: 'Nama Bisnis', key: 'company', sortable: true },
  { label: 'Status', key: 'isActive', sortable: true },
  { label: 'Tanggal Aktif', key: 'activationDate', sortable: true },
  { label: 'Email', key: 'emails', sortable: false },
  { label: 'No Telpon', key: 'phones', sortable: false },
  { label: 'Nama AM', key: 'salesName', sortable: true }
]

const customers = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<any>(null)
const currentSort = ref('activationDate')
const currentOrder = ref<'asc' | 'desc'>('desc')

const fetchCustomers = async (queryParams: CustomerQueryParams = {}) => {
  loading.value = true
  try {
    const response = await customerService.getCustomers({
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      ...queryParams,
      page: queryParams.page || 1,
      limit: 20
    })
    
    if (response.success) {
      customers.value = response.data
      meta.value = response.meta
    }
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  } finally {
    loading.value = false
  }
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchCustomers({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchCustomers({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchCustomers({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchCustomers({ page: 1 })
}

onMounted(() => {
  fetchCustomers()
})
</script>
