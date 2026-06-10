<template>
  <div class="transition-all duration-300">
    <DataTable 
      flat 
      :columns="serviceColumns" 
      v-model:search-query="searchQuery"
      :loading="serviceLoading"
      :is-empty="!serviceLoading && customerServices.length === 0"
      :total-from="serviceMeta?.from"
      :total-to="serviceMeta?.to"
      :total-entries="serviceMeta?.total"
      :current-page="servicePage"
      :last-page="serviceMeta?.lastPage"
      :current-sort="serviceSort"
      :current-order="serviceOrder"
      @update:page="servicePage = $event"
      @update:sort="serviceSort = $event"
      @update:order="serviceOrder = $event"
      class="mt-3"
    >
      <template #filters>
        <DataFilter 
          :is-filter-active="isFilterActive"
          @apply="applyFilters"
          @reset="resetFilters"
          @cancel="cancelFilters"
        >
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-neutral-400 text-xs font-medium">Tanggal</span>
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
        </DataFilter>
      </template>
      <template #body="{ isColumnVisible }">
        <tbody class="text-xs text-neutral-600">
          <tr v-for="(item, index) in customerServices" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
            <td v-show="isColumnVisible('accountName')" class="border-r border-base-200 text-neutral-500 max-w-[150px] truncate" :title="item.accountName || '-'">
              {{ item.accountName || '-' }}
            </td>
            <td v-show="isColumnVisible('customer')" class="border-r border-base-200 max-w-[200px]">
              <div class="min-w-0 py-1">
                <NuxtLink :to="`/customer/${item.customer?.id}`" class="font-medium text-primary hover:underline block truncate" :title="item.customer?.name || '-'">
                  {{ item.customer?.name || '-' }}
                </NuxtLink>
                <p class="text-xs text-neutral-400 truncate" :title="`${item.customer?.id || ''} · ${item.customer?.company || ''}`">
                  {{ item.customer?.id || '-' }} <span v-if="item.customer?.company">· {{ item.customer.company }}</span>
                </p>
              </div>
            </td>
            <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary max-w-[250px] truncate" :title="item.service.name">
              <NuxtLink :to="`/service/${item.service.code}`" class="hover:underline">{{ item.service.name }}</NuxtLink>
            </td>
            <td v-show="isColumnVisible('registrationDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDateShort(item.registrationDate) }}</td>
            <td v-show="isColumnVisible('period')" class="border-r border-base-200 text-neutral-500 min-w-[200px] whitespace-nowrap">
              {{ formatDate(item.startDate) }}
              <span v-if="item.endDate"> - {{ formatDate(item.endDate) }}</span>
            </td>
            <td v-show="isColumnVisible('status')" class="border-r border-base-200 text-center min-w-[140px]">
              <div :class="['badge border-none font-semibold text-xs rounded-lg w-full', getStatusClass(item.status)]">
                {{ item.status }}
              </div>
            </td>
            <td v-show="isColumnVisible('sales.name')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ item.sales?.name ?? '-' }}</td>
          </tr>
        </tbody>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { userService } from '~/services/user-service'
import { formatDate, formatDateShort } from '~/utils/date'
import { getStatusClass } from '~/utils/status'

const route = useRoute()
const userId = route.params.id as string

const searchQuery = ref('')
const servicePage = ref(1)
const serviceSort = ref('registrationDate')
const serviceOrder = ref<'asc' | 'desc'>('desc')

const startDate = ref('')
const endDate = ref('')
const appliedFilters = ref({ startDate: '', endDate: '' })

const isFilterActive = computed(() => 
  appliedFilters.value.startDate !== '' || appliedFilters.value.endDate !== ''
)

const applyFilters = () => {
  appliedFilters.value = { startDate: startDate.value, endDate: endDate.value }
  servicePage.value = 1
}
const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
  applyFilters()
}
const cancelFilters = () => {
  startDate.value = appliedFilters.value.startDate
  endDate.value = appliedFilters.value.endDate
}

const { data: serviceResponse, status: serviceStatus } = useAsyncData(
  `user-services-${userId}`,
  () => userService.getUserServices(userId, {
    page: servicePage.value,
    sort: serviceSort.value,
    order: serviceOrder.value,
    q: searchQuery.value,
    startDate: appliedFilters.value.startDate || undefined,
    endDate: appliedFilters.value.endDate || undefined,
    limit: 5
  }),
  { watch: [servicePage, serviceSort, serviceOrder, searchQuery, appliedFilters] }
)

const customerServices = computed(() => serviceResponse.value?.data || [])
const serviceMeta = computed(() => serviceResponse.value?.meta)
const serviceLoading = computed(() => serviceStatus.value === 'pending')

const serviceColumns = [
  { label: 'Account Name', key: 'accountName', sortable: true },
  { label: 'Pelanggan', key: 'customer', sortable: true },
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'Tanggal Registrasi', key: 'registrationDate', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Nama AM', key: 'sales.name', sortable: true }
]
</script>
