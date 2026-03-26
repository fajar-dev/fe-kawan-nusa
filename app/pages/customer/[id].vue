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
        <!-- Detail Pelanggan -->
        <div class="lg:col-span-5 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <Users class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Pelanggan</h3>
              </div>
            </div>
            <div class="card-body p-6 pt-0 flex flex-col gap-5 ps-8">
              <div v-if="customer" class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                <!-- Row 1 -->
                <div class="flex items-start gap-4">
                  <Calendar class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Tanggal Bergabung</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ formatDate(customer.registrationDate) }}</span>
                  </div>
                </div>
                <!-- Row 2 -->
                <div class="flex items-start gap-4 min-w-0">
                  <Mail class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-xs text-neutral-900">Email</span>
                    <div class="flex items-center justify-between w-full gap-2 min-w-0">
                      <span class="text-xs text-neutral-800 font-medium truncate">{{ customer.emails?.[0]?.email || '-' }}</span>
                      <div v-if="customer.emails && customer.emails.length > 1" class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                          +{{ customer.emails.length - 1 }} <ChevronDown class="w-3 h-3" />
                        </div>
                        <ul tabindex="0" class="dropdown-content z-[10] menu bg-base-100 rounded-box shadow-lg border border-base-200 p-2 w-56 mt-1">
                          <li v-for="email in customer.emails.slice(1)" :key="email.id">
                              <span class="text-xs text-neutral-700 font-medium">{{ email.email }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 3 -->
                <div class="flex items-start gap-4">
                  <Hash class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">ID Pelanggan</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ customer.id }}</span>
                  </div>
                </div>
                <!-- Row 4 -->
                <div class="flex items-start gap-4 min-w-0">
                  <Phone class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-xs text-neutral-900">No Handphone</span>
                    <div class="flex items-center justify-between w-full gap-2 min-w-0">
                      <span class="text-xs text-neutral-800 font-medium truncate">{{ customer.phones?.[0]?.phone || '-' }}</span>
                      <div v-if="customer.phones && customer.phones.length > 1" class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="badge bg-accent border-none text-primary font-medium text-[10px] rounded px-1.5 py-0.5 flex items-center gap-1 cursor-pointer">
                          +{{ customer.phones.length - 1 }} <ChevronDown class="w-3 h-3" />
                        </div>
                        <ul tabindex="0" class="dropdown-content z-[10] menu bg-base-100 rounded-box shadow-lg border border-base-200 p-2 w-48 mt-1">
                          <li v-for="phone in customer.phones.slice(1)" :key="phone.id">
                            <span class="text-xs text-neutral-700 font-medium">{{ phone.phone }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Row 5 -->
                <div class="flex items-start gap-4">
                  <Briefcase class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Bidang Industri</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ customer.type || '-' }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-4 animate-pulse">
                <div v-for="i in 5" :key="i" class="h-10 bg-base-200 rounded-lg"></div>
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
                <tbody class="text-xs text-neutral-600">
                  <tr v-for="(item, index) in customerServices" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                    <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary ps-4 max-w-[250px] truncate" :title="item.service.name">
                      <NuxtLink :to="`/service/${item.service.code}`" class="hover:underline">{{ item.service.name }}</NuxtLink>
                    </td>
                    <td v-show="isColumnVisible('activationDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDateShort(item.activationDate) }}</td>
                    <td v-show="isColumnVisible('period')" class="border-r border-base-200 text-neutral-500 min-w-[200px] whitespace-nowrap">
                      {{ formatDate(item.startDate) }}
                      <span v-if="item.endDate"> - {{ formatDate(item.endDate) }}</span>
                    </td>
                    <td v-show="isColumnVisible('address')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ item.address }}</td>
                    <td v-show="isColumnVisible('status')" class="text-center max-w-[80px]">
                      <div :class="['badge border-none font-semibold text-xs rounded-lg w-full', getStatusClass(item.status)]">
                        {{ item.status }}
                      </div>
                    </td>
                    <td v-show="isColumnVisible('salesName')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ item.salesName }}</td>
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
              :loading="pointLoading"
              :is-empty="!pointLoading && rewards.length === 0"
              :total-from="pointMeta?.from"
              :total-to="pointMeta?.to"
              :total-entries="pointMeta?.total"
              :current-page="pointPage"
              :last-page="pointMeta?.lastPage"
              :current-sort="pointSort"
              :current-order="pointOrder"
              @update:page="pointPage = $event"
              @update:sort="pointSort = $event"
              @update:order="pointOrder = $event"
            >
              <template #body="{ isColumnVisible }">
                <tbody class="text-xs text-neutral-600">
                  <tr v-for="(item, index) in rewards" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0 font-medium font-sans">
                    <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap">{{ formatDateShort(item.createdAt) }}</td>
                    <td v-show="isColumnVisible('point')" class="border-r border-base-200 text-neutral-500">{{ item.point }}</td>
                    <td v-show="isColumnVisible('type')" class="border-r border-base-200 text-neutral-500">{{ item.type }}</td>
                    <td v-show="isColumnVisible('service.name')" class="border-r border-base-200 text-primary max-w-[250px] truncate" :title="item.service.name">
                      <NuxtLink :to="`/service/${item.service.code}`" class="hover:underline">{{ item.service.name }}</NuxtLink>
                    </td>
                    <td v-show="isColumnVisible('price')" class="text-neutral-500">Rp. {{ item.price.toLocaleString('id-ID') }}</td>
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
import { CircleHelp, History, Package, Users, Calendar, Hash, Mail, Phone, Briefcase, ChevronDown, FileText } from 'lucide-vue-next'
import { customerService } from '~/services/customer-service'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

useSeoMeta({
  title: 'Kawan Nusa | Detail Pelanggan',
})

const route = useRoute()
const customerId = route.params.id as string

const { data: customerResponse } = useAsyncData(
  `customer-${customerId}`,
  () => customerService.getCustomerById(customerId)
)

const customer = computed(() => customerResponse.value?.data)

const activeTab = ref('layanan')
const searchQuery = ref('')
const servicePage = ref(1)
const serviceSort = ref('activationDate')
const serviceOrder = ref<'asc' | 'desc'>('desc')

const { data: serviceResponse, status: serviceStatus } = useAsyncData(
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

const pointPage = ref(1)
const pointSort = ref('createdAt')
const pointOrder = ref<'asc' | 'desc'>('desc')

const { data: pointResponse, status: pointStatus } = useAsyncData(
  `customer-rewards-${customerId}`,
  () => customerService.getCustomerRewards(customerId, {
    page: pointPage.value,
    sort: pointSort.value,
    order: pointOrder.value,
    q: searchQuery.value,
    limit: 5
  }),
  {
    watch: [pointPage, pointSort, pointOrder, searchQuery]
  }
)

const rewards = computed(() => pointResponse.value?.data || [])
const pointMeta = computed(() => pointResponse.value?.meta)
const pointLoading = computed(() => pointStatus.value === 'pending')

const serviceColumns = [
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'Tanggal Aktif', key: 'activationDate', sortable: true },
  { label: 'Periode Berlangganan', key: 'period', sortable: false },
  { label: 'Alamat Pemasangan', key: 'address', sortable: false },
  { label: 'Status', key: 'status', sortable: true },
  { label: 'Nama AM', key: 'salesName', sortable: true }
]

const pointColumns = [
  { label: 'Tanggal Didapatkan', key: 'createdAt', sortable: true },
  { label: 'Poin Didapatkan', key: 'point', sortable: true },
  { label: 'Tipe Poin', key: 'type', sortable: true },
  { label: 'Nama Layanan', key: 'service.name', sortable: true },
  { label: 'Harga Layanan', key: 'price', sortable: true }
]

</script>