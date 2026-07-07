<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Data Referral</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Pengguna
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
        :is-empty="!loading && users.length === 0"
        :total-from="meta?.from"
        :total-to="meta?.to"
        :total-entries="meta?.total"
        :current-page="meta?.currentPage"
        :last-page="meta?.lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama atau email..."
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
            <!-- Status -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Status</span>
                <span @click="statusFilter = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="statusFilter" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in users" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('name')" class="border-r border-base-200">
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div v-if="item.photo" class="w-9 h-9 rounded-full ring ring-base-200 ring-offset-1">
                      <img :src="item.photo" :alt="item.name" class="object-cover" />
                    </div>
                    <div v-else class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring ring-base-200 ring-offset-1">
                      <span class="text-primary font-semibold text-xs">{{ getInitials(item.name) }}</span>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <NuxtLink :to="`/user/${item.id}`" class="font-medium text-primary hover:underline truncate max-w-[180px] block" :title="item.name">{{ item.name }}</NuxtLink>
                    <p class="text-xs text-neutral-400 truncate max-w-[180px]" :title="item.email">{{ item.email }}</p>
                  </div>
                </div>
              </td>
              <td v-show="isColumnVisible('phone')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.phone || '-'">{{ item.phone || '-' }}</td>
              <td v-show="isColumnVisible('identityNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="String(item.identityNumber || '-')">{{ item.identityNumber || '-' }}</td>
              <td v-show="isColumnVisible('taxNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.taxNumber || '-'">{{ item.taxNumber || '-' }}</td>
              <td v-show="isColumnVisible('bank')" class="border-r border-base-200 max-w-[200px]">
                <template v-if="item.bank?.name">
                  <p class="font-medium text-neutral-800 truncate" :title="item.bank.name">{{ item.bank.name }}</p>
                  <p class="text-xs text-neutral-400 truncate" :title="item.bank.number || ''">{{ item.bank.number || '-' }} · {{ item.bank.holderName || '-' }}</p>
                </template>
                <span v-else>-</span>
              </td>
              <td v-show="isColumnVisible('status')" class="border-r border-base-200 text-center px-4">
                <div :class="[
                  'badge border-none font-semibold text-[12px] rounded-lg w-full',
                  getUserStatusClass(item.status)
                ]">
                  {{ getUserStatusLabel(item.status) }}
                </div>
              </td>
              <td v-show="isColumnVisible('lastReferanceDate')" class="border-r border-base-200 whitespace-nowrap">{{ item.lastReferanceDate ? formatDateShort(item.lastReferanceDate) : '-' }}</td>
              <td v-show="isColumnVisible('point')" class="border-r border-base-200 text-right">
                <span class="font-semibold text-primary">{{ formatNumber(item.point) }}</span>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, CircleHelp } from 'lucide-vue-next'
import { userService } from '~/services/user-service'
import { getInitials } from '~/utils/initials'
import { formatNumber } from '~/utils/string'
import { formatDateShort } from '~/utils/date'
import { getUserStatusClass, getUserStatusLabel } from '~/utils/status'
import type { UserListItem, UserQueryParams } from '~/types/user'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pengguna',
})

const columns = [
  { label: 'Pengguna', key: 'name', sortable: true },
  { label: 'No. Telpon', key: 'phone', sortable: true },
  { label: 'No. Identitas', key: 'identityNumber', sortable: true },
  { label: 'NPWP', key: 'taxNumber', sortable: true },
  { label: 'Informasi Bank', key: 'bank', sortable: false },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Referensi Terakhir', key: 'lastReferanceDate', sortable: true },
  { label: 'Poin', key: 'point', sortable: true },
]

const users = ref<UserListItem[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('point')
const currentOrder = ref<'asc' | 'desc'>('desc')

const statusFilter = ref('')
const isFilterActive = ref(false)

const appliedFilters = ref({
  status: ''
})

const fetchUsers = async (queryParams: UserQueryParams = {}) => {
  loading.value = true
  try {
    const response = await userService.getUsers({
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      status: appliedFilters.value.status || 'active,inactive',
      ...queryParams,
      page: queryParams.page || 1,
      limit: 10
    })
    
    if (response.success) {
      users.value = response.data
      meta.value = response.meta
    }
  } finally {
    loading.value = false
  }
}

const cancelFilters = () => {
  statusFilter.value = appliedFilters.value.status
}

const applyFilters = () => {
  appliedFilters.value = {
    status: statusFilter.value
  }
  isFilterActive.value = appliedFilters.value.status !== ''
  fetchUsers({ page: 1 })
}

const resetFilters = () => {
  statusFilter.value = ''
  applyFilters()
}



let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchUsers({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchUsers({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchUsers({ page: 1 })
}

onMounted(() => {
  fetchUsers()
})
</script>
