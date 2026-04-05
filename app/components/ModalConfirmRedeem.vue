<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Konfirmasi Penukaran</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Pastikan detail reward Anda sudah benar</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="relative min-h-[300px]">
          <!-- Loading Overlay -->
          <div v-if="isLoading" class="absolute inset-0 z-20 bg-white/80 flex items-center justify-center">
            <Loader2 class="w-8 h-8 animate-spin text-primary" />
          </div>

          <!-- Reward Info -->
          <div class="p-6 space-y-5">
            <!-- Reward Image -->
            <div class="h-48 w-full rounded-xl overflow-hidden bg-neutral-100">
              <img :src="reward?.image" :alt="reward?.name" class="w-full h-full object-cover" />
            </div>

            <!-- Reward Info -->
            <div class="space-y-1">
              <h4 class="text-neutral-800 font-semibold">{{ reward?.name }}</h4>
              <p class="text-xs text-neutral-500 line-clamp-2">
                {{ reward?.description }}
              </p>
            </div>

            <!-- Points Breakdown -->
            <div class="border border-neutral-100 rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between text-sm">
                  <span class="text-neutral-500">Poin Anda saat ini</span>
                  <span class="text-neutral-800 font-medium">{{ userPoints.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                  <span class="text-neutral-500">Poin yang ditukarkan</span>
                  <div class="flex items-center gap-1.5 text-purple-600 font-medium font-semibold">
                      <Coins class="w-4 h-4" />
                      <span>{{ (reward?.point || 0).toLocaleString('id-ID') }}</span>
                  </div>
              </div>
              <div class="border-t border-dashed border-neutral-200 pt-3 flex items-center justify-between">
                  <span class="font-semibold text-neutral-800">Sisa Poin</span>
                  <span class="font-semibold text-neutral-900 border-neutral-100">{{ (userPoints - (reward?.point || 0)).toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-neutral-100">
          <button 
            @click="isOpen = false"
            class="btn btn-outline border-primary rounded-lg font-medium"
            :disabled="isLoading"
          >
            Batal
          </button>
          <button 
            @click="$emit('confirm')"
            class="btn btn-primary rounded-lg font-medium"
            :disabled="isLoading || (userPoints < (reward?.point || 0))"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Coins, Loader2 } from 'lucide-vue-next'
import { watch, onUnmounted, computed } from 'vue'
import { catalogService } from '~/services/catalog-service'
import { pointService } from '~/services/point-service'

const props = defineProps<{
  rewardId: number | null
}>()

const isOpen = defineModel<boolean>({ default: false })

defineEmits(['confirm'])

// Reset and Fetch data when modal is open and has a rewardId
const { data: catalogItemResponse, pending: isLoadingCatalog, refresh: refreshCatalog } = await useAsyncData(
  () => `catalog-detail-${props.rewardId}`,
  () => {
    if (!props.rewardId) return Promise.resolve(null)
    return catalogService.getCatalogById(props.rewardId)
  },
  { immediate: false, watch: [() => props.rewardId] }
)

const { data: pointResponse, pending: isLoadingPoint, refresh: refreshPoint } = await useAsyncData(
  'modal-user-points',
  () => pointService.getPoint(),
  { immediate: false }
)

const reward = computed(() => catalogItemResponse.value?.data || null)
const userPoints = computed(() => pointResponse.value?.data?.value ?? 0)
const isLoading = computed(() => isLoadingCatalog.value || isLoadingPoint.value)

watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
    refreshCatalog()
    refreshPoint()
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
