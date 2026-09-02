<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>

      <div class="bg-white rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Riwayat Perubahan Komisi Bulanan</h3>
            <p class="text-xs text-neutral-500 mt-0.5">{{ schedule?.user?.name || '-' }} · {{ schedule?.nisData?.accountName || '-' }}</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="loading" class="flex justify-center py-8">
            <span class="loading loading-spinner loading-md text-primary"></span>
          </div>

          <div v-else-if="histories.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <History class="w-5 h-5 text-neutral-400" />
            </div>
            <p class="text-neutral-400 text-sm">Belum ada riwayat perubahan</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="text-neutral-400 text-xs font-medium border-b border-base-200">
                  <th class="font-medium">Tanggal</th>
                  <th class="font-medium">Komisi</th>
                  <th class="font-medium">Jadwal</th>
                  <th class="font-medium">Diubah Oleh</th>
                </tr>
              </thead>
              <tbody class="text-sm text-neutral-600">
                <tr v-for="h in histories" :key="h.id" class="border-b border-base-100 last:border-0">
                  <td class="whitespace-nowrap">{{ formatDateTime(h.createdAt) }}</td>
                  <td class="whitespace-nowrap">
                    <template v-if="h.fromPrice !== h.toPrice">
                      <span class="text-neutral-400">Rp {{ h.fromPrice.toLocaleString('id-ID') }}</span>
                      <span class="mx-1 text-neutral-300">→</span>
                      <span class="font-medium text-neutral-800">Rp {{ h.toPrice.toLocaleString('id-ID') }}</span>
                    </template>
                    <span v-else class="text-neutral-400">Rp {{ h.toPrice.toLocaleString('id-ID') }}</span>
                  </td>
                  <td class="whitespace-nowrap">
                    <template v-if="h.fromAnchorDay !== h.toAnchorDay">
                      <span class="text-neutral-400">Tgl {{ h.fromAnchorDay }}</span>
                      <span class="mx-1 text-neutral-300">→</span>
                      <span class="font-medium text-neutral-800">Tgl {{ h.toAnchorDay }}</span>
                    </template>
                    <span v-else class="text-neutral-400">Tgl {{ h.toAnchorDay }}</span>
                  </td>
                  <td class="whitespace-nowrap">{{ h.changedBy?.name || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, History } from 'lucide-vue-next'
import { pointSubmissionService } from '~/services/point-submission-service'
import { formatDateTime } from '~/utils/date'
import type { PointSubmissionSchedule, PointSubmissionScheduleHistory } from '~/types/point-submission'

const props = defineProps<{
  schedule?: PointSubmissionSchedule | null
}>()

const isOpen = defineModel<boolean>({ default: false })

const histories = ref<PointSubmissionScheduleHistory[]>([])
const loading = ref(false)

const fetchHistories = async (id: number) => {
  loading.value = true
  try {
    const res = await pointSubmissionService.getScheduleHistory(id)
    if (res.success) {
      histories.value = res.data
    }
  } catch (error) {
    // Silently ignore
  } finally {
    loading.value = false
  }
}

watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
    if (props.schedule?.id) fetchHistories(props.schedule.id)
  } else {
    document.body.style.overflow = ''
    histories.value = []
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
