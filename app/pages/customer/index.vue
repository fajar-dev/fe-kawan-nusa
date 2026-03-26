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
          <DataFilter 
            :is-filter-active="isFilterActive"
            @apply="applyFilters"
            @reset="resetFilters"
            @cancel="cancelFilters"
          >
            <!-- Tipe Industri -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tipe Industri</span>
                <span @click="industryType = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <MultiSelect 
                v-model="industryType" 
                :options="industryOptions" 
                labelKey="name"
                valueKey="name"
                placeholder="Semua Industri" 
                searchable
              />
            </div>

            <!-- Status -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Status</span>
                <span @click="isActive = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="isActive" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                <option value="">Semua Status</option>
                <option value="1">Aktif</option>
                <option value="0">Tidak Aktif</option>
              </select>
            </div>

            <!-- Layanan -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Layanan</span>
                <span @click="serviceCode = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <MultiSelect 
                v-model="serviceCode" 
                :options="serviceOptions" 
                labelKey="name"
                valueKey="code"
                placeholder="Semua Layanan" 
                searchable
              />
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in customers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('id')" class="text-primary border-r border-base-200 max-w-[100px] truncate" :title="item.id">
                <NuxtLink :to="`/customer/${item.id}`" class="hover:underline">{{ item.id }}</NuxtLink>
              </td>
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.name">{{ item.name }}</td>
              <td v-show="isColumnVisible('company')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.company">{{ item.company || '-' }}</td>
              <td v-show="isColumnVisible('isActive')" class="border-r border-base-200 text-center">
                <div class="badge bg-accent border-none text-primary font-semibold text-xs w-full rounded-lg">
                  {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </div>
              </td>
              <td v-show="isColumnVisible('emails')" class="border-r border-base-200 max-w-[180px]">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate flex-1" :title="item.emails?.[0]?.email">{{ item.emails?.[0]?.email || '-' }}</span>
                  <div v-if="item.emails?.length > 1" class="badge bg-accent border-none text-primary font-semibold text-xs rounded-lg shrink-0">
                    +{{ item.emails.length - 1 }} <ChevronDown class="w-3 h-3" />
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('phones')" class="border-r border-base-200 max-w-[150px]">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate flex-1" :title="item.phones?.[0]?.phone">{{ item.phones?.[0]?.phone || '-' }}</span>
                  <div v-if="item.phones?.length > 1" class="badge bg-accent border-none text-primary font-semibold text-xs rounded-lg shrink-0">
                    +{{ item.phones.length - 1 }} <ChevronDown class="w-3 h-3" />
                  </div>
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
import { Users, CircleHelp, ChevronDown } from 'lucide-vue-next'
import { customerService } from '~/services/customer-service'
import { additionalService } from '~/services/additional-service'
import type { CustomerQueryParams } from '~/types/customer'
import type { AdditionalItem } from '~/types/additional'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pelanggan',
})

const columns = [
  { label: 'ID Pelanggan', key: 'id', sortable: true },
  { label: 'Nama PIC', key: 'name', sortable: true },
  { label: 'Nama Bisnis', key: 'company', sortable: true },
  { label: 'Status', key: 'isActive', sortable: true },
  { label: 'Email', key: 'emails', sortable: false },
  { label: 'No Telpon', key: 'phones', sortable: false },
]

const customers = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<any>(null)
const currentSort = ref('name')
const currentOrder = ref<'asc' | 'desc'>('asc')

const isFilterActive = ref(false)

const industryOptions = ref<AdditionalItem[]>([])
const serviceOptions = ref<AdditionalItem[]>([])

const industryType = ref<string[]>([])
const isActive = ref('')
const serviceCode = ref<string[]>([])

const appliedFilters = ref({
  industryType: [] as string[],
  isActive: '',
  serviceCode: [] as string[]
})

const fetchCustomers = async (queryParams: CustomerQueryParams = {}) => {
  loading.value = true
  try {
    const response = await customerService.getCustomers({
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      type: appliedFilters.value.industryType || undefined,
      isActive: appliedFilters.value.isActive === '' ? undefined : Number(appliedFilters.value.isActive),
      serviceCode: appliedFilters.value.serviceCode || undefined,
      ...queryParams,
      page: queryParams.page || 1,
      limit: 10
    })
    
    if (response.success) {
      customers.value = response.data
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

const cancelFilters = () => {
    industryType.value = [...appliedFilters.value.industryType]
    isActive.value = appliedFilters.value.isActive
    serviceCode.value = [...appliedFilters.value.serviceCode]
}

const applyFilters = () => {
    appliedFilters.value = {
        industryType: [...industryType.value],
        isActive: isActive.value,
        serviceCode: [...serviceCode.value]
    }
    isFilterActive.value = appliedFilters.value.industryType.length > 0 || 
                           appliedFilters.value.isActive !== '' ||
                           appliedFilters.value.serviceCode.length > 0
    fetchCustomers({ page: 1 })
}

const resetFilters = () => {
    industryType.value = []
    isActive.value = ''
    serviceCode.value = []
    applyFilters()
}

const fetchFilterOptions = async () => {
    const [types, svcs] = await Promise.all([
        additionalService.getCustomerTypes(),
        additionalService.getServices()
    ])
    if (types?.success) industryOptions.value = types.data
    if (svcs?.success) serviceOptions.value = svcs.data
}

onMounted(() => {
  fetchFilterOptions()
  fetchCustomers()
})
</script>
