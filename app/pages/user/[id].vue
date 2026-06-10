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
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold',
                  user?.isActive ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                ]">
                  {{ user?.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full text-[10px] text-neutral-600">
                  <Calendar class="w-3.5 h-3.5 shrink-0" />
                  <span class="whitespace-nowrap">Bergabung: <span class="font-semibold">{{ formatDate(user?.createdAt) }}</span></span>
                </div>
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-medium mt-1 lg:mt-1.5">
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
      </div>

      <!-- Bottom Card: Detail Transaksi -->
      <div class="card bg-white border border-base-200 shadow-sm">
        <div class="card-body p-6">
          <div class="flex items-center gap-3 border-b border-base-100 pb-2">
            <ReceiptText class="w-5 h-5 text-neutral-800" />
            <h3 class="font-semibold text-neutral-800">Detail Transaksi</h3>
          </div>

          <!-- Tabs -->
          <div class="flex items-center gap-8 border-b border-base-200">
            <NuxtLink 
              :to="`/user/${userId}/services`"
              class="pb-3 font-medium transition-all relative"
              :class="[ $route.path.includes('/services') ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
            >
              Layanan Terdaftar
              <div v-if="$route.path.includes('/services')" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            </NuxtLink>
            <NuxtLink 
              :to="`/user/${userId}/reward`"
              class="pb-3 font-medium transition-all relative"
              :class="[ $route.path.includes('/reward') ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
            >
              Poin Masuk
              <div v-if="$route.path.includes('/reward')" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
            </NuxtLink>
            <NuxtLink 
              :to="`/user/${userId}/redeem`"
              class="pb-3 font-medium transition-all relative"
              :class="[ $route.path.includes('/redeem') ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800' ]"
            >
              Poin Keluar
              <div v-if="$route.path.includes('/redeem')" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
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
  FileText, Building2, Briefcase, Landmark, ReceiptText
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
</script>
