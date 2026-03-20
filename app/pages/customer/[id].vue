<template>
  <div class="space-y-6">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex flex-col gap-1 w-full">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg text-xl font-semibold shrink-0 uppercase">
            {{ getInitials(customer?.name || '??') }}
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-semibold text-neutral-800">{{ customer?.name }}</h1>
                <CircleHelp class="w-5 h-5 text-neutral-400 cursor-pointer hover:text-primary transition-colors shrink-0" />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[10px] text-neutral-600">
                  <History class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Terakhir Direferensikan: <span class="font-semibold">{{ formatDate(customer?.latestCustomerService?.referenceDate) }}</span></span>
                </div>
                <!-- This could be dynamic if we had service count in the main response -->
                <div class="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] text-primary font-semibold">
                  <Package class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">{{ customer?.totalCustomerServices }} Layanan Aktif</span>
                </div>
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-medium mt-1 lg:mt-1.5">
              <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
              <NuxtLink to="/customer" class="text-primary hover:underline">Customer Saya</NuxtLink> / 
              <span class="text-neutral-500">{{ customer?.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Detail Pelanggan -->
        <div class="lg:col-span-4 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <Users class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Pelanggan</h3>
              </div>
            </div>
            <div class="card-body p-6 pt-0 flex flex-col gap-5 ps-8">
              <div v-if="customer" class="space-y-5">
                <!-- Row 1 -->
                <div class="flex items-start gap-4">
                  <Calendar class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Tanggal Bergabung</span>
                    <span class="text-[13px] text-neutral-800 font-medium">{{ formatDate(customer.registrationDate || customer.activationDate) }}</span>
                  </div>
                </div>
                <!-- Row 2 -->
                <div class="flex items-start gap-4">
                  <Hash class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">ID Pelanggan</span>
                    <span class="text-[13px] text-neutral-800 font-medium">{{ customer.id }}</span>
                  </div>
                </div>
                <!-- Row 3 -->
                <div class="flex items-start gap-4">
                  <Mail class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col flex-1">
                    <span class="text-xs text-neutral-900">Email</span>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-[13px] text-neutral-800 font-medium">{{ customer.emails?.[0]?.email || '-' }}</span>
                      <div v-if="customer.emails && customer.emails.length > 1" class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                        +{{ customer.emails.length - 1 }} <ChevronDown class="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 4 -->
                <div class="flex items-start gap-4">
                  <Phone class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col flex-1">
                    <span class="text-xs text-neutral-900">No Handphone</span>
                    <div class="flex items-center justify-between w-full">
                      <span class="text-[13px] text-neutral-800 font-medium">{{ customer.phones?.[0]?.phone || '-' }}</span>
                      <div v-if="customer.phones && customer.phones.length > 1" class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                        +{{ customer.phones.length - 1 }} <ChevronDown class="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 5 -->
                <div class="flex items-start gap-4">
                  <Briefcase class="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Bidang Industri</span>
                    <span class="text-[13px] text-neutral-800 font-medium">{{ customer.type || '-' }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-4 animate-pulse">
                <div v-for="i in 5" :key="i" class="h-10 bg-base-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Detail Alamat -->
        <div class="lg:col-span-8 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <MapPin class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Alamat</h3>
              </div>
            </div>
            <div class="card-body pt-0 flex flex-col gap-5 ps-7">
              <div v-if="addresses.length > 0" class="flex-1 space-y-3">
                <div v-for="(address, index) in addresses" :key="address.id" class="flex gap-1 group">
                  <div class="w-8 h-8 flex items-start justify-center text-neutral-500 shrink-0">
                    <MapPin class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-neutral-900">{{ `Alamat Pemasangan ${index + 1 + (addressPage - 1) * (addressMeta?.perPage || 10)}` }} {{ address.label ? `(${address.label})` : '' }}</span>
                    <p class="text-sm text-neutral-600 font-medium leading-relaxed whitespace-pre-line">
                      {{ address.address }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else-if="addressLoading" class="flex-1 space-y-3 animate-pulse">
                <div v-for="i in 3" :key="i" class="h-20 bg-base-200 rounded-lg"></div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-400">
                <MapPin class="w-12 h-12 mb-2 opacity-20" />
                <p class="text-sm font-medium">Tidak ada detail alamat</p>
              </div>

            <div class="card-footer">
              <!-- Pagination footer -->
                <div class="flex flex-col lg:flex-row items-center lg:justify-between lg:gap-0 gap-4 justify-center mt-6 text-sm border-t border-base-300 pt-3">
                  <div class="text-neutral-500 text-sm">
                    Showing {{ addressMeta?.from || 0 }} to {{ addressMeta?.to || 0 }} of {{ addressMeta?.total || 0 }} entries
                  </div>
                  <div class="join">
                    <button 
                      class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 disabled:bg-transparent"
                      :disabled="addressPage === 1 || addressLoading"
                      @click="addressPage = 1"
                    >
                      <ChevronFirst class="w-4 h-4" />
                    </button>
                    <button 
                      class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 disabled:bg-transparent"
                      :disabled="addressPage === 1 || addressLoading"
                      @click="addressPage--"
                    >
                      <ChevronLeft class="w-4 h-4" />
                    </button>
                    
                    <button 
                      v-for="page in addressMeta?.lastPage || 1" 
                      :key="page"
                      class="btn border-none shadow-none btn-sm rounded-sm"
                      :class="addressPage === page ? 'bg-primary text-primary-content hover:bg-primary/90' : 'bg-white text-neutral-600 hover:bg-base-200 border border-base-200'"
                      @click="addressPage = page"
                    >
                      {{ page }}
                    </button>

                    <button 
                      class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 disabled:bg-transparent"
                      :disabled="addressPage === (addressMeta?.lastPage || 1) || addressLoading"
                      @click="addressPage++"
                    >
                      <ChevronRight class="w-4 h-4" />
                    </button>
                    <button 
                      class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 disabled:bg-transparent"
                      :disabled="addressPage === (addressMeta?.lastPage || 1) || addressLoading"
                      @click="addressPage = addressMeta?.lastPage || 1"
                    >
                      <ChevronLast class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Card: Detail Transaksi -->
      <div class="card bg-white border border-base-200 shadow-sm">
        <div class="card-body p-6">
          <div class="flex items-center gap-3 border-b border-base-100 pb-2">
            <FileText class="w-5 h-5 text-neutral-800" />
            <h3 class="font-semibold text-neutral-800">Detail Transaksi</h3>
          </div>

          <!-- Tabs -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex border-b border-base-200 w-full md:w-auto">
              <button 
                @click="activeTab = 'layanan'"
                :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'layanan' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
              >
                Layanan Terdaftar
              </button>
              <button 
                @click="activeTab = 'poin'"
                :class="['px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs', activeTab === 'poin' ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600']"
              >
                Pendapatan Poin
              </button>
            </div>
          </div>

          <!-- Services Table -->
          <div v-show="activeTab === 'layanan'" class="transition-all duration-300">
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
            >
              <template #body="{ isColumnVisible }">
                <tbody class="text-[13px] text-neutral-600">
                  <tr v-for="(item, index) in customerServices" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                    <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary ps-4 max-w-[250px] truncate" :title="item.service.name">{{ item.service.name }}</td>
                    <td v-show="isColumnVisible('activationDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDateShort(item.activationDate) }}</td>
                    <td v-show="isColumnVisible('period')" class="border-r border-base-200 text-neutral-500 min-w-[200px] whitespace-nowrap">
                      {{ formatDate(item.startDate) }}
                      <span v-if="item.endDate"> - {{ formatDate(item.endDate) }}</span>
                    </td>
                    <td v-show="isColumnVisible('status')" class="text-center max-w-[80px]">
                      <div :class="['badge border-none font-semibold text-xs rounded-lg w-full', getStatusClass(item.status)]">
                        {{ item.status }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </DataTable>
          </div>

          <!-- Points Table -->
          <div v-show="activeTab === 'poin'" class="transition-all duration-300">
            <DataTable 
              flat 
              :columns="pointColumns"
              v-model:search-query="searchQuery"
              search-placeholder="Cari Poin..."
              :is-empty="filteredPoints.length === 0"
            >
              <template #body="{ isColumnVisible }">
                <tbody class="text-[13px] text-neutral-600">
                  <tr v-for="(item, index) in filteredPoints" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                    <td v-show="isColumnVisible('date')" class="border-r border-base-200 text-neutral-500 ps-4">{{ item.date }}</td>
                    <td v-show="isColumnVisible('points')" class="border-r border-base-200 text-neutral-500 ps-4">{{ item.points }}</td>
                    <td v-show="isColumnVisible('type')" class="border-r border-base-200 text-neutral-500 ps-4">{{ item.type }}</td>
                    <td v-show="isColumnVisible('service')" class="border-r border-base-200 text-primary ps-4">{{ item.service }}</td>
                    <td v-show="isColumnVisible('price')" class="text-neutral-500 ps-4">Rp. {{ item.price.toLocaleString('id-ID') }}</td>
                  </tr>
                </tbody>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, History, Package, MapPin, Users, Calendar, Hash, Mail, Phone, Briefcase, ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, FileText, ListFilter } from 'lucide-vue-next'
import { customerService } from '~/services/customer-service'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

const route = useRoute()
const customerId = route.params.id as string

const { data: customerResponse } = await useAsyncData(
  `customer-${customerId}`,
  () => customerService.getCustomerById(customerId)
)

const customer = computed(() => customerResponse.value?.data)

const addressPage = ref(1)
const { data: addressResponse, status: addressStatus } = await useAsyncData(
  `customer-addresses-${customerId}`,
  () => customerService.getCustomerAddresses(customerId, { page: addressPage.value }),
  {
    watch: [addressPage]
  }
)

const addresses = computed(() => addressResponse.value?.data || [])
const addressMeta = computed(() => addressResponse.value?.meta)
const addressLoading = computed(() => addressStatus.value === 'pending')

const activeTab = ref('layanan')
const searchQuery = ref('')
const servicePage = ref(1)
const serviceSort = ref('startDate')
const serviceOrder = ref<'asc' | 'desc'>('desc')

const { data: serviceResponse, status: serviceStatus } = await useAsyncData(
  `customer-services-${customerId}`,
  () => customerService.getCustomerServices(customerId, {
    page: servicePage.value,
    sort: serviceSort.value,
    order: serviceOrder.value,
    q: searchQuery.value,
    limit: 5
  }),
  {
    watch: [servicePage, serviceSort, serviceOrder, searchQuery]
  }
)

const customerServices = computed(() => serviceResponse.value?.data || [])
const serviceMeta = computed(() => serviceResponse.value?.meta)
const serviceLoading = computed(() => serviceStatus.value === 'pending')

interface CustomerLocalPoint {
  date: string
  points: number
  type: string
  service: string
  price: number
}

const serviceColumns = [
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'Tanggal Aktif', key: 'activationDate', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Status', key: 'status', sortable: true }
]

const pointColumns = [
  { label: 'Tanggal Didapatkan', key: 'date' },
  { label: 'Poin Didapatkan', key: 'points' },
  { label: 'Tipe Poin', key: 'type' },
  { label: 'Nama Layanan', key: 'service' },
  { label: 'Harga Layanan', key: 'price' }
]

const points: CustomerLocalPoint[] = [
  { date: '30/12/2025', points: 390, type: 'OTP', service: 'Nusanet Broadband Business EDGE100', price: 1500000 },
  { date: '30/12/2025', points: 213, type: 'OTP', service: 'Nusanet Broadband Business EDGE200', price: 1500000 },
  { date: '28/12/2025', points: 542, type: 'Bulanan', service: 'Nusanet Broadband Business EDGE300', price: 1500000 },
  { date: '20/12/2025', points: 332, type: 'OTP', service: 'Nusanet Dedicated Business NOVA90', price: 1500000 },
  { date: '28/11/2025', points: 542, type: 'Bulanan', service: 'Nusanet Broadband Business EDGE300', price: 1500000 }
]

const filteredPoints = computed(() => {
  if (!searchQuery.value) return points
  const query = searchQuery.value.toLowerCase()
  return points.filter(item => 
    item.service.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query)
  )
})

</script>