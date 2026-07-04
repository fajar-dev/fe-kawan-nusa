<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Riwayat Perubahan Status</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Catatan perubahan status oleh admin</p>
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
            <p class="text-neutral-400 text-sm">Belum ada riwayat perubahan status</p>
          </div>

          <div v-else class="relative pl-6">
            <div class="absolute left-[9px] top-2 bottom-2 w-px bg-neutral-200"></div>
            
            <div v-for="history in histories" :key="history.id" class="relative mb-6 last:mb-0">
              <div class="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                :class="dotColor(history.toStatus)"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>

              <div class="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span v-if="history.fromStatus" class="badge badge-sm font-medium rounded-md" :class="badgeColor(history.fromStatus)">{{ statusLabel(history.fromStatus) }}</span>
                  <span v-if="history.fromStatus" class="text-neutral-400 text-xs">→</span>
                  <span class="badge badge-sm font-medium rounded-md" :class="badgeColor(history.toStatus)">{{ statusLabel(history.toStatus) }}</span>
                </div>
                <p v-if="history.note" class="text-sm text-neutral-600 mt-1.5">{{ history.note }}</p>
                <div class="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                  <span v-if="history.changedBy">oleh <span class="font-medium text-neutral-500">{{ history.changedBy.name }}</span></span>
                  <span>·</span>
                  <span>{{ formatDateTime(history.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, History } from 'lucide-vue-next'
import { redemptionService } from '~/services/redemption-service'
import { formatDateTime } from '~/utils/date'
import type { RedemptionStatusHistory } from '~/types/redemption'

const props = defineProps<{
  redemptionId: number | null
}>()

const isOpen = defineModel<boolean>({ default: false })

const histories = ref<RedemptionStatusHistory[]>([])
const loading = ref(false)

const fetchHistories = async (id: number) => {
  loading.value = true
  try {
    const res = await redemptionService.getStatusHistories(id)
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
    if (props.redemptionId) fetchHistories(props.redemptionId)
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

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    expired: 'Kadaluarsa',
  }
  return labels[status] || status
}

const dotColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-blue-500',
    processing: 'bg-amber-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-red-500',
    expired: 'bg-neutral-400',
  }
  return map[status] || 'bg-neutral-400'
}

const badgeColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    expired: 'bg-neutral-100 text-neutral-600',
  }
  return map[status] || 'bg-neutral-100 text-neutral-600'
}
</script>
