<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Persetujuan Registrasi</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
              <NuxtLink to="/user" class="text-primary hover:underline">Referal</NuxtLink> / 
              <span class="text-neutral-500">Persetujuan Registrasi</span>
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <!-- Tabs -->
      <div class="flex border-b border-base-200 w-full bg-white rounded-t-lg px-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="switchTab(tab.key)"
          class="px-6 py-3 text-sm font-semibold transition-all border-b-2"
          :class="[
            activeTab === tab.key 
              ? 'border-primary text-primary' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

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
        search-placeholder="Cari nama, email, atau no telepon..."
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
            <!-- Date Range -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tanggal Registrasi</span>
                <span @click="startDate = ''; endDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="flex gap-2">
                <input v-model="startDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" placeholder="Dari" />
                <input v-model="endDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" placeholder="Sampai" />
              </div>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in users" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateShort(item.createdAt) }}
              </td>
              <td v-show="isColumnVisible('name')" class="border-r border-base-200">
                <NuxtLink :to="`/user/approval/${item.id}`" class="font-medium text-primary hover:underline truncate max-w-[180px] block" :title="item.name">
                  {{ item.name }}
                </NuxtLink>
              </td>
              <td v-show="isColumnVisible('phone')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.phone || '-'">
                {{ item.phone || '-' }}
              </td>
              <td v-show="isColumnVisible('identityNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="String(item.identityNumber || '-')">
                {{ item.identityNumber || '-' }}
              </td>
              <td v-show="isColumnVisible('taxNumber')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.taxNumber || '-'">
                {{ item.taxNumber || '-' }}
              </td>
              <td v-show="isColumnVisible('company')" class="border-r border-base-200 max-w-[180px] truncate" :title="item.company || '-'">
                {{ item.company || '-' }}
              </td>
              <td v-show="isColumnVisible('bankName')" class="border-r border-base-200 max-w-[150px] truncate" :title="item.bank?.name || '-'">
                {{ item.bank?.name || '-' }}
              </td>
              <td v-show="isColumnVisible('bankInfo')" class="border-r border-base-200 max-w-[220px]">
                <template v-if="item.bank?.holderName || item.bank?.number">
                  <span class="truncate block" :title="`${item.bank?.holderName || '-'} - ${item.bank?.number || '-'}`">
                    {{ item.bank?.holderName || '-' }} - {{ item.bank?.number || '-' }}
                  </span>
                </template>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardCheck, CircleHelp } from 'lucide-vue-next'
import { userService } from '~/services/user-service'
import { formatDateShort } from '~/utils/date'
import type { UserListItem, UserQueryParams } from '~/types/user'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Persetujuan Registrasi',
})

const tabs = [
  { label: 'Perlu Ditinjau', key: 'pending' },
  { label: 'Perlu Direvisi', key: 'revision' },
  { label: 'Ditolak', key: 'reject' },
]

const columns = [
  { label: 'Waktu Registrasi', key: 'createdAt', sortable: true },
  { label: 'Nama Referal', key: 'name', sortable: true },
  { label: 'No. Telp', key: 'phone', sortable: false },
  { label: 'No. Identitas', key: 'identityNumber', sortable: false },
  { label: 'NPWP', key: 'taxNumber', sortable: false },
  { label: 'Nama Perusahaan', key: 'company', sortable: false },
  { label: 'Bank', key: 'bankName', sortable: false },
  { label: 'Informasi Bank', key: 'bankInfo', sortable: false },
]

const activeTab = ref('pending')
const users = ref<UserListItem[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')
const startDate = ref('')
const endDate = ref('')
const appliedStartDate = ref('')
const appliedEndDate = ref('')

const isFilterActive = computed(() => !!appliedStartDate.value || !!appliedEndDate.value)

const applyFilters = () => {
  appliedStartDate.value = startDate.value
  appliedEndDate.value = endDate.value
  fetchUsers({ page: 1 })
}

const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
  appliedStartDate.value = ''
  appliedEndDate.value = ''
  fetchUsers({ page: 1 })
}

const cancelFilters = () => {
  startDate.value = appliedStartDate.value
  endDate.value = appliedEndDate.value
}

const fetchUsers = async (queryParams: UserQueryParams = {}) => {
  loading.value = true
  try {
    const params: any = {
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value,
      status: activeTab.value,
      ...queryParams,
      page: queryParams.page || 1,
      limit: 10
    }
    if (appliedStartDate.value) params.startDate = appliedStartDate.value
    if (appliedEndDate.value) params.endDate = appliedEndDate.value

    const response = await userService.getUsers(params)
    
    if (response.success) {
      users.value = response.data
      meta.value = response.meta
    }
  } finally {
    loading.value = false
  }
}

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
  searchQuery.value = ''
  fetchUsers({ page: 1 })
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
