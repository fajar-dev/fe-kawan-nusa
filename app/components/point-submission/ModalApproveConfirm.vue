<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Setujui Poin</h3>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Info box -->
            <div class="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Info class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p class="text-xs text-blue-700 font-medium">
                Poin akan langsung disetujui dan masuk ke Portal Referral. Referral dapat melihat poin di akun mereka.                       </p>
            </div>

          <!-- Deskripsi Persetujuan Poin -->
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <label class="flex items-center gap-1">
                <span class="text-sm font-medium text-gray-700">Deskripsi Persetujuan Poin<span class="text-red-500">*</span></span>
                <div class="tooltip tooltip-right" data-tip="Deskripsi ini akan terlihat oleh referral sebagai keterangan persetujuan poin.">
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </div>
              </label>
              <span class="text-xs" :class="notes.length > maxLength ? 'text-red-500' : 'text-gray-400'">{{ notes.length }}/{{ maxLength }}</span>
            </div>
            <textarea 
              v-model="notes" 
              placeholder="Isi deskripsi persetujuan" 
              rows="3"
              :maxlength="maxLength"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white resize-none"
              :class="{ 'border-red-500': error }"
            ></textarea>
            <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6">
            <button 
              type="button"
              @click="isOpen = false"
              :disabled="loading"
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
            >
              Batal
            </button>
            <button 
              type="button"
              @click="handleConfirm"
              :disabled="loading || !notes.trim()"
              class="btn btn-primary rounded-lg px-6 min-w-[120px]"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else>Setujui</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Info } from 'lucide-vue-next'

withDefaults(defineProps<{
  count?: number
  loading?: boolean
}>(), {
  count: 0,
  loading: false
})

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['confirm'])

const notes = ref('')
const error = ref('')
const maxLength = 110

watch(isOpen, (val) => {
  if (val) {
    notes.value = ''
    error.value = ''
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const handleConfirm = () => {
  if (!notes.value.trim()) {
    error.value = 'Deskripsi persetujuan wajib diisi'
    return
  }
  error.value = ''
  emit('confirm', { notes: notes.value })
}
</script>
