<template>
  <div class="flex flex-col w-full max-w-3xl">
    <NuxtLink to="/prospect" class="text-primary text-sm font-medium hover:underline flex items-center gap-2 mb-4 w-fit">
      <ArrowLeft class="w-4.5 h-4.5" />
      Kembali ke Prospek Saya
    </NuxtLink>

    <div v-if="!prospect" class="card bg-white border border-base-200">
      <div class="card-body p-10 text-center text-neutral-400 text-sm">
        Data prospek tidak ditemukan.
      </div>
    </div>

    <div v-else class="card bg-white border border-base-200">
      <div class="card-body p-6">
        <!-- Header -->
        <div class="flex items-center gap-4 pb-5 border-b border-base-100 mb-5">
          <div class="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold shrink-0 uppercase">
            {{ getInitials(prospect.name) }}
          </div>
          <div>
            <h1 class="text-xl font-semibold text-neutral-800">{{ prospect.name }}</h1>
            <span class="badge badge-sm font-medium mt-1.5" :class="statusBadgeClass(prospect.status)">{{ prospect.status }}</span>
          </div>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Kontak</p>
            <p class="text-sm text-neutral-800">{{ prospect.phone }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Alamat</p>
            <p class="text-sm text-neutral-800">{{ prospect.address }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Tanggal Regist</p>
            <p class="text-sm text-neutral-800">{{ formatDateShort(prospect.registDate) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Tanggal Disetujui</p>
            <p class="text-sm text-neutral-800">{{ prospect.approvedDate ? formatDateShort(prospect.approvedDate) : '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Sales PIC Verifikasi</p>
            <p class="text-sm text-neutral-800">{{ prospect.salesPic || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Layanan</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="service in prospect.services" :key="service" class="badge badge-sm bg-primary/10 text-primary border-none font-medium">
                {{ service }}
              </span>
            </div>
          </div>
          <div class="md:col-span-2">
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Catatan Sales</p>
            <p class="text-sm text-neutral-800">{{ prospect.notes || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { getInitials } from '~/utils/initials'
import { formatDateShort } from '~/utils/date'
import type { ProspectStatus } from '~/types/prospect'

definePageMeta({
  role: 'user',
})

useSeoMeta({
  title: 'Kawan Nusa | Detail Prospek',
})

const route = useRoute()
const { getProspectById } = useProspects()
const prospect = computed(() => getProspectById(Number(route.params.id)))

const statusBadgeClass = (status: ProspectStatus) => {
  if (status === 'Disetujui') return 'bg-success/10 text-success border-success/20'
  if (status === 'Ditolak') return 'bg-red-50 text-red-500 border-red-200'
  return 'bg-amber-50 text-amber-600 border-amber-200'
}
</script>
