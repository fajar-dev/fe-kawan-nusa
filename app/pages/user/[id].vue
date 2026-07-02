<template>
  <div class="space-y-6">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex flex-col gap-1 w-full">
        <div class="flex items-start gap-4">
          <div v-if="user?.photo" class="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <img :src="user.photo" :alt="user.firstName" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg text-xl font-semibold shrink-0 uppercase">
            {{ getInitials(`${user?.firstName || ''} ${user?.lastName || ''}`) }}
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-semibold text-neutral-800">{{ user?.firstName }} {{ user?.lastName }}</h1>
                <CircleHelp class="w-5 h-5 text-neutral-400 cursor-pointer hover:text-primary transition-colors shrink-0" />
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div :class="[
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                  user?.status === 'active' ? 'bg-primary/10 text-primary' : user?.status === 'pending' ? 'bg-amber-50 text-amber-600' : user?.status === 'revision' ? 'bg-blue-50 text-blue-600' : user?.status === 'reject' ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-500'
                ]">
                  {{ user?.status === 'active' ? 'Aktif' : user?.status === 'pending' ? 'Pending' : user?.status === 'revision' ? 'Revisi' : user?.status === 'reject' ? 'Ditolak' : 'Tidak Aktif' }}
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">
                  <Calendar class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Bergabung: <span class="font-semibold">{{ formatDate(user?.createdAt) }}</span></span>
                </div>
              </div>
            </div>
            <div class="text-xs text-neutral-400 font-medium mt-1 lg:mt-0">
              <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
              <NuxtLink to="/user" class="text-primary hover:underline">Pengguna</NuxtLink> / 
              <span class="text-neutral-500">{{ userId }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Detail Pengguna -->
        <div class="lg:col-span-5 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-header p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3">
                <UserIcon class="w-5 h-5 text-neutral-800" />
                <h3 class="font-semibold text-neutral-800 ps-2">Detail Pengguna</h3>
              </div>
            </div>
            <div class="card-body p-6 pt-0 flex flex-col gap-5 ps-8">
              <div v-if="user" class="grid grid-cols-1 gap-y-5">
                <div class="flex items-start gap-4">
                  <Mail class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Email</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.email || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Phone class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">No. Telepon</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.phone || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Cake class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Tempat / Tgl Lahir</span>
                    <span class="text-xs text-neutral-800 font-medium">
                      {{ user.birthPlace || '-' }}, {{ user.birthDate || '-' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Hash class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">No. Identitas</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.identityNumber || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <FileText class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">NPWP</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.taxNumber || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <MapPin class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Alamat</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.address || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Building2 class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Perusahaan</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.company || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Briefcase class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Jabatan</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.jobPosition || '-' }}</span>
                  </div>
                </div>
                <div v-if="user.companyAddress" class="flex items-start gap-4">
                  <MapPin class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Alamat Perusahaan</span>
                    <span class="text-xs text-neutral-800 font-medium">{{ user.companyAddress }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <Landmark class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                  <div class="flex flex-col">
                    <span class="text-xs text-neutral-900">Informasi Bank</span>
                    <template v-if="user.bankDetails?.name">
                      <span class="text-xs text-neutral-800 font-medium">{{ user.bankDetails.name }} - {{ user.bankDetails.number || '-' }}</span>
                      <span class="text-xs text-neutral-400">a.n {{ user.bankDetails.holderName || '-' }}</span>
                    </template>
                    <span v-else class="text-xs text-neutral-800 font-medium">-</span>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-4 animate-pulse">
                <div v-for="i in 7" :key="i" class="h-10 bg-base-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistik & Poin -->
        <div class="lg:col-span-7 h-full">
          <div class="card bg-white border border-base-200 h-full">
            <div class="card-body p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-4">
                <Coins class="w-5 h-5 text-neutral-800 shrink-0" />
                <h3 class="font-semibold text-neutral-800">Statistik Poin</h3>
              </div>

              <!-- Poin Aktif Display (Di atas chart) -->
              <div class="mb-6">
                <span class="text-xs text-neutral-500 font-medium">Poin Aktif</span>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-neutral-800 font-medium text-4xl">{{ totalPoints.toLocaleString('id-ID') }}</span>
                  <div class="tooltip tooltip-bottom tooltip-neutral" data-tip="Jumlah poin komisi yang tersisa saat ini.">
                    <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <!-- Chart -->
              <AreaChart
                v-if="AreaChartData.length > 0"
                :data="AreaChartData"
                :height="220"
                :categories="categories"
                :y-num-ticks="5"
                :x-num-ticks="AreaChartData.length"
                :y-grid-line="true"
                :hide-legend="true"
                :x-formatter="xFormatter"
                :curve-type="CurveType.Linear"
              />
              <div v-else class="h-[220px] flex items-center justify-center text-neutral-400 text-sm">
                Tidak ada data statistik
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Card: Detail Transaksi -->
      <div class="card bg-white border border-base-200 shadow-sm">
        <div class="card-body p-6">
          <div class="flex items-center gap-3 border-b border-base-100 pb-2">
            <ReceiptText class="w-5 h-5 text-neutral-800" />
            <h3 class="font-semibold text-neutral-800">Detail Transaksi</h3>
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-base-200 w-full mb-1">
            <NuxtLink 
              :to="`/user/${userId}/services`"
              class="px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs"
              :class="[ $route.path.includes('/services') ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600' ]"
            >
              Layanan Terdaftar
            </NuxtLink>
            <NuxtLink 
              :to="`/user/${userId}/reward`"
              class="px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs"
              :class="[ $route.path.includes('/reward') ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600' ]"
            >
              Poin Masuk
            </NuxtLink>
            <NuxtLink 
              :to="`/user/${userId}/redeem`"
              class="px-6 py-2.5 md:text-sm font-semibold transition-all border-b-2 text-xs"
              :class="[ $route.path.includes('/redeem') ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600' ]"
            >
              Poin Keluar
            </NuxtLink>
          </div>

          <!-- Tab Content -->
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, Calendar, UserRound as UserIcon, Mail, Phone, Hash, 
  FileText, Building2, Briefcase, Landmark, ReceiptText, Coins, Cake, MapPin
} from 'lucide-vue-next'
import { userService } from '~/services/user-service'
import { getInitials } from '~/utils/initials'
import { formatDate } from '~/utils/date'

definePageMeta({
  bgColor: 'bg-[#F7FDF9]'
})

useSeoMeta({
  title: 'Kawan Nusa | Detail Pengguna',
})

const route = useRoute()
const userId = route.params.id as string

// Fetch User Detail
const { data: userResponse } = useAsyncData(
  `user-${userId}`,
  () => userService.getUserById(userId)
)
const user = computed(() => userResponse.value?.data)

// Guard: redirect if user is not active or inactive
watch(user, (val) => {
  if (val && val.status !== 'active' && val.status !== 'inactive') {
    navigateTo('/user')
  }
}, { immediate: true })

// Fetch User Statistic
const { data: statisticResponse } = useAsyncData(
  `user-statistic-${userId}`,
  () => userService.getUserStatistic(userId)
)
const statistic = computed(() => statisticResponse.value?.data)

const totalPoints = computed(() => statistic.value?.count?.point?.value || 0)

const AreaChartData = computed(() => {
  return (statistic.value?.pointPerMonth || []).map(item => ({
    month: item.label,
    growth: item.total
  }))
})

const categories = {
  growth: { name: 'Point', color: '#24960F' }
}

const xFormatter = (tick: number): string => {
  return AreaChartData.value[tick]?.month || ''
}
</script>
