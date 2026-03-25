<template>
  <div class="space-y-6">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex flex-col gap-1 w-full">
        <div class="flex items-start gap-4">
          <div class="flex flex-col w-full">
            <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-semibold text-neutral-800">{{ service?.name }}</h1>
                <CircleHelp class="w-5 h-5 text-neutral-400 cursor-pointer hover:text-primary transition-colors shrink-0" />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[10px] text-neutral-600">
                  <History class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Terakhir Direferensikan: <span class="font-semibold">{{ formatDate(service?.lastReferanceDate) }}</span></span>
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] text-primary font-semibold">
                  <Users class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">{{ service?.totalCustomerServices }} Customer Aktif</span>
                </div>
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-medium mt-1 lg:mt-1.5">
              <NuxtLink to="/" class="text-primary hover:underline font-semibold">Beranda</NuxtLink> / 
              <NuxtLink to="/service" class="text-primary hover:underline font-semibold">Produk dan Layanan</NuxtLink> / 
              <span class="text-neutral-500">{{ serviceCode }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Top: Detail Layanan (4 columns) -->
        <div class="lg:col-span-5 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6 pb-2">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <h3 class="font-semibold text-neutral-800">Detail Layanan</h3>
              </div>
            </div>
            <div v-if="service" class="card-body p-6 pt-0 flex flex-col gap-5 ps-6">
              <div class="space-y-5">
                <!-- Deskripsi -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Deskripsi</span>
                  <p class="text-sm text-neutral-800 font-medium leading-relaxed">
                    {{ service.description || '-' }}
                  </p>
                </div>
                
                <!-- Tipe Layanan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Tipe Layanan</span>
                  <span class="text-sm text-neutral-800 font-medium">{{ service.type }}</span>
                </div>

                <!-- Status Layanan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Status Layanan</span>
                  <span class="text-sm text-neutral-800 font-medium">{{ service.isActive ? 'Aktif' : 'Dihentikan' }}</span>
                </div>

                <!-- Jumlah Berlangganan -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-neutral-400 font-medium">Jumlah Berlangganan</span>
                  <span class="text-sm text-neutral-800 font-medium">{{ service.totalCustomerServices }} pelanggan</span>
                </div>
              </div>
            </div>
            <div v-else class="card-body p-6 space-y-4 animate-pulse">
              <div class="h-4 bg-neutral-100 rounded-lg w-3/4"></div>
              <div class="h-4 bg-neutral-100 rounded-lg w-1/2"></div>
              <div class="h-4 bg-neutral-100 rounded-lg w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Bottom: Detail Berlangganan (12 columns) -->
        <div class="lg:col-span-12">
          <div class="card bg-white border border-base-200">
            <div class="card-body p-6">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <FileText class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800">Detail Berlangganan</h3>
                </div>
              </div>

              <!-- Subscriptions Table -->
              <DataTable 
                flat 
                :columns="columns"
                v-model:search-query="searchQuery"
                :loading="customerLoading"
                :is-empty="!customerLoading && customers.length === 0"
                :total-from="customerMeta?.from"
                :total-to="customerMeta?.to"
                :total-entries="customerMeta?.total"
                :current-page="customerPage"
                :last-page="customerMeta?.lastPage"
                :current-sort="customerSort"
                :current-order="customerOrder"
                @update:page="customerPage = $event"
                @update:sort="customerSort = $event"
                @update:order="customerOrder = $event"
              >
                <template #body="{ isColumnVisible }">
                  <tbody class="text-xs text-neutral-600 border-x border-base-200">
                    <tr v-for="(item, index) in customers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                      <td v-show="isColumnVisible('customerId')" class="border-r border-base-200 text-primary font-semibold">
                        <NuxtLink :to="`/customer/${item.customerId}`" class="hover:underline">{{ item.customerId }}</NuxtLink>
                      </td>
                      <td v-show="isColumnVisible('registrationDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDateShort(item.registrationDate) }}</td>
                      <td v-show="isColumnVisible('referenceDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDate(item.referenceDate) }}</td>
                      <td v-show="isColumnVisible('period')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">
                        {{ formatDate(item.startDate) }}
                        <span v-if="item.endDate"> - {{ formatDate(item.endDate) }}</span>
                      </td>
                      <td v-show="isColumnVisible('status')" class="border-r border-base-200 text-center px-4">
                        <div :class="['badge border-none font-semibold text-xs rounded-lg w-full', getStatusClass(item.status)]">
                          {{ item.status }}
                        </div>
                      </td>
                      <td v-show="isColumnVisible('salesName')" class="ps-4 max-w-[200px] truncate" :title="item.salesName">{{ item.salesName }}</td>
                    </tr>
                  </tbody>
                </template>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, History, Users, 
  FileText
} from 'lucide-vue-next'
import { serviceService } from '~/services/service-service'
import { formatDate, formatDateShort } from '~/utils/date'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

useSeoMeta({
  title: 'Kawan Nusa | Detail Produk & Layanan',
})

const route = useRoute()
const serviceCode = route.params.id as string

// Fetch Service Detail
const { data: serviceResponse } = useAsyncData(
  `service-${serviceCode}`,
  () => serviceService.getServiceByCode(serviceCode)
)
const service = computed(() => serviceResponse.value?.data)

// Fetch Customers for Service
const searchQuery = ref('')
const customerPage = ref(1)
const customerSort = ref('referenceDate')
const customerOrder = ref<'asc' | 'desc'>('desc')

const { data: customerResponse, status: customerStatus } = useAsyncData(
  `service-customers-${serviceCode}`,
  () => serviceService.getServiceCustomers(serviceCode, {
    page: customerPage.value,
    sort: customerSort.value,
    order: customerOrder.value,
    q: searchQuery.value,
    limit: 5
  }),
  {
    watch: [customerPage, customerSort, customerOrder, searchQuery]
  }
)

const customers = computed(() => customerResponse.value?.data || [])
const customerMeta = computed(() => customerResponse.value?.meta)
const customerLoading = computed(() => customerStatus.value === 'pending')

const columns = [
  { label: 'ID Pelanggan', key: 'customerId', sortable: true },
  { label: 'Tanggal Registrasi', key: 'registrationDate', sortable: true },
  { label: 'Referensi Terakhir', key: 'referenceDate', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Nama AM', key: 'salesName', sortable: true }
]

</script>
