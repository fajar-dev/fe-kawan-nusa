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
                  getUserStatusClass(user?.status)
                ]">
                  {{ getUserStatusLabel(user?.status) }}
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">
                  <Calendar class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Bergabung: <span class="font-semibold">{{ formatDate(user?.createdAt) }}</span></span>
                </div>
              </div>
            </div>
            <div class="text-xs text-neutral-400 font-medium mt-1 lg:mt-0">
              <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
              <NuxtLink to="/user" class="text-primary hover:underline">Referal</NuxtLink> / 
              <span class="text-neutral-500">{{ user?.firstName }} {{ user?.lastName }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Status Note Banner -->
      <div v-if="user?.statusNote && (user.status === 'revision' || user.status === 'reject' || user.status === 'inactive')" 
        :class="[
          'flex items-start gap-3 rounded-xl p-4 border',
          user.status === 'reject' ? 'bg-red-50 border-red-200' : user.status === 'inactive' ? 'bg-neutral-50 border-neutral-200' : 'bg-amber-50 border-amber-200'
        ]"
      >
        <AlertCircle :class="['w-5 h-5 shrink-0 mt-0.5', user.status === 'reject' ? 'text-red-500' : user.status === 'inactive' ? 'text-neutral-500' : 'text-amber-500']" />
        <div>
          <p :class="['text-sm font-semibold', user.status === 'reject' ? 'text-red-700' : user.status === 'inactive' ? 'text-neutral-700' : 'text-amber-700']">
            {{ user.status === 'reject' ? 'Ditolak' : user.status === 'inactive' ? 'Tidak Aktif' : 'Revisi' }}
          </p>
          <p :class="['text-xs mt-0.5', user.status === 'reject' ? 'text-red-600' : user.status === 'inactive' ? 'text-neutral-600' : 'text-amber-600']">
            {{ user.statusNote }}
          </p>
          <p v-if="user.statusUpdatedAt" class="text-xs mt-1 text-neutral-400">
            {{ formatDateTime(user.statusUpdatedAt) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Detail Pengguna -->
        <div class="lg:col-span-5">
          <div class="card bg-white border border-base-200">
            <div class="card-body p-6 flex flex-col gap-6">
              <!-- Informasi Pribadi -->
              <div>
                <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-5">
                  <UserIcon class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800 ps-2">Detail Pengguna</h3>
                </div>
                <div v-if="user" class="grid grid-cols-1 gap-y-5 ps-2">
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
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-neutral-800 font-medium">{{ user.phone || '-' }}</span>
                        <span v-if="user.hasWhatsapp" class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-medium rounded">
                          <MessageCircle class="w-2.5 h-2.5" /> WA
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <Cake class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900">Tempat / Tgl Lahir</span>
                      <span class="text-xs text-neutral-800 font-medium">
                        {{ user.birthPlace || '-' }}, {{ user.birthDate ? formatDate(user.birthDate) : '-' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <Hash class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900">NIK</span>
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
                </div>
                <div v-else class="space-y-4 animate-pulse ps-2">
                  <div v-for="i in 6" :key="i" class="h-10 bg-base-200 rounded-lg"></div>
                </div>
              </div>

              <!-- Informasi Bank -->
              <div v-if="user">
                <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-5">
                  <Landmark class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800 ps-2">Informasi Bank</h3>
                </div>
                <div class="grid grid-cols-1 gap-y-5 ps-2">
                  <div class="flex items-start gap-4">
                    <CreditCard class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900">Rekening Bank</span>
                      <template v-if="user.bankDetails?.name">
                        <span class="text-xs text-neutral-800 font-medium">{{ user.bankDetails.name }} - {{ user.bankDetails.number || '-' }}</span>
                        <span class="text-xs text-neutral-400">a.n {{ user.bankDetails.holderName || '-' }}</span>
                      </template>
                      <span v-else class="text-xs text-neutral-800 font-medium">-</span>
                    </div>
                  </div>
                  <div v-if="user.bankDetails?.accountPath" class="flex items-start gap-4">
                    <Image class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900 mb-1.5">Foto Buku Rekening</span>
                      <div class="w-36 h-24 rounded-lg border border-base-200 overflow-hidden bg-base-100 cursor-pointer" @click="previewImage(user.bankDetails!.accountPath!)">
                        <img :src="user.bankDetails.accountPath" alt="Buku Rekening" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informasi Perusahaan -->
              <div v-if="user && (user.company || user.jobPosition)">
                <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-5">
                  <Building2 class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800 ps-2">Informasi Perusahaan</h3>
                </div>
                <div class="grid grid-cols-1 gap-y-5 ps-2">
                  <div class="flex items-start gap-4">
                    <Building2 class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900">Nama Perusahaan</span>
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
                </div>
              </div>

              <!-- Dokumen -->
              <div v-if="user?.identityPath">
                <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-5">
                  <FileImage class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800 ps-2">Dokumen</h3>
                </div>
                <div class="ps-2">
                  <div class="flex items-start gap-4">
                    <IdCard class="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
                    <div class="flex flex-col">
                      <span class="text-xs text-neutral-900 mb-1.5">Foto KTP</span>
                      <div class="w-36 h-24 rounded-lg border border-base-200 overflow-hidden bg-base-100 cursor-pointer" @click="previewImage(user.identityPath!)">
                        <img :src="user.identityPath" alt="KTP" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pengaturan Akun -->
              <div v-if="user">
                <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-5">
                  <Settings class="w-5 h-5 text-neutral-800" />
                  <h3 class="font-semibold text-neutral-800 ps-2">Pengaturan Akun</h3>
                </div>
                <div class="flex flex-col ps-2">
                  <div class="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <Bell class="w-4 h-4 text-neutral-500" />
                      <span class="text-sm text-neutral-700 font-medium">Langganan Notifikasi</span>
                    </div>
                    <span :class="['text-xs font-semibold px-2 py-0.5 rounded', user.settings?.isSubscribe ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-500']">
                      {{ user.settings?.isSubscribe ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div class="flex items-center gap-3">
                      <ArrowDownUp class="w-4 h-4 text-neutral-500" />
                      <span class="text-sm text-neutral-700 font-medium">Auto Withdraw</span>
                    </div>
                    <span :class="['text-xs font-semibold px-2 py-0.5 rounded', user.settings?.isAutoWithdraw ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-500']">
                      {{ user.settings?.isAutoWithdraw ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistik & Poin -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Ringkasan Statistik -->
          <div v-if="statistic" class="flex flex-col gap-4">
            <div class="card bg-white border border-base-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-neutral-500 font-medium">Pelanggan</span>
                  <p class="text-2xl font-bold text-neutral-800 mt-0.5">{{ statistic.count?.customer?.value?.toLocaleString('id-ID') || 0 }}</p>
                </div>
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users class="w-5 h-5 text-primary" />
                </div>
              </div>
              <div v-if="statistic.count?.customer?.achievement" class="flex items-center gap-1 mt-2">
                <TrendingUp v-if="statistic.count.customer.achievement.isUp" class="w-3.5 h-3.5 text-primary" />
                <TrendingDown v-else class="w-3.5 h-3.5 text-red-500" />
                <span :class="['text-xs font-medium', statistic.count.customer.achievement.isUp ? 'text-primary' : 'text-red-500']">
                  {{ statistic.count.customer.achievement.percentage }}%
                </span>
                <span class="text-xs text-neutral-400">dari bulan lalu</span>
              </div>
            </div>

            <div class="card bg-white border border-base-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-neutral-500 font-medium">Layanan</span>
                  <p class="text-2xl font-bold text-neutral-800 mt-0.5">{{ statistic.count?.customerService?.value?.toLocaleString('id-ID') || 0 }}</p>
                </div>
                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Wifi class="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div v-if="statistic.count?.customerService?.achievement" class="flex items-center gap-1 mt-2">
                <TrendingUp v-if="statistic.count.customerService.achievement.isUp" class="w-3.5 h-3.5 text-primary" />
                <TrendingDown v-else class="w-3.5 h-3.5 text-red-500" />
                <span :class="['text-xs font-medium', statistic.count.customerService.achievement.isUp ? 'text-primary' : 'text-red-500']">
                  {{ statistic.count.customerService.achievement.percentage }}%
                </span>
                <span class="text-xs text-neutral-400">dari bulan lalu</span>
              </div>
            </div>

            <div class="card bg-white border border-base-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-neutral-500 font-medium">Poin Aktif</span>
                  <p class="text-2xl font-bold text-neutral-800 mt-0.5">{{ totalPoints.toLocaleString('id-ID') }}</p>
                </div>
                <div class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Coins class="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div v-if="statistic.count?.point?.achievement" class="flex items-center gap-1 mt-2">
                <TrendingUp v-if="statistic.count.point.achievement.isUp" class="w-3.5 h-3.5 text-primary" />
                <TrendingDown v-else class="w-3.5 h-3.5 text-red-500" />
                <span :class="['text-xs font-medium', statistic.count.point.achievement.isUp ? 'text-primary' : 'text-red-500']">
                  {{ statistic.count.point.achievement.percentage }}%
                </span>
                <span class="text-xs text-neutral-400">dari bulan lalu</span>
              </div>
            </div>
          </div>
          <!-- Grafik Poin -->
          <div class="card bg-white border border-base-200">
            <div class="card-body p-6">
              <div class="flex items-center gap-3 border-b border-base-300 pb-3 mb-4">
                <Coins class="w-5 h-5 text-neutral-800 shrink-0" />
                <h3 class="font-semibold text-neutral-800">Statistik Poin</h3>
              </div>

              <!-- Poin Aktif Display -->
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

    <!-- Image Preview -->
    <ModalImagePreview
      :is-open="showImagePreview"
      :image-url="previewImageUrl"
      @close="showImagePreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, Calendar, UserRound as UserIcon, Mail, Phone, Hash, 
  FileText, Building2, Briefcase, Landmark, ReceiptText, Coins, Cake, MapPin,
  CreditCard, Image, FileImage, IdCard, MessageCircle, Settings, Bell, ArrowDownUp,
  ShieldCheck, Users, Wifi, TrendingUp, TrendingDown, AlertCircle
} from 'lucide-vue-next'
import { userService } from '~/services/user-service'
import { getInitials } from '~/utils/initials'
import { formatDate, formatDateTime } from '~/utils/date'
import { getUserStatusClass, getUserStatusLabel } from '~/utils/status'

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

// Image preview
const showImagePreview = ref(false)
const previewImageUrl = ref('')

const previewImage = (url: string) => {
  previewImageUrl.value = url
  showImagePreview.value = true
}
</script>
