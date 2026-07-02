<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="$emit('close')"></div>
      
      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 leading-tight">
            {{ type === 'approve' ? 'Setujui Pendaftaran' : 'Tolak Pendaftaran' }}
          </h3>
          <button @click="$emit('close')" class="text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Info box -->
          <div class="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Info class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p class="text-xs text-blue-700 font-medium">
              <template v-if="type === 'approve'">
                Calon Referal akan menerima konfirmasi persetujuan pendaftaran dengan deskripsi yang anda isikan di bawah ini.
              </template>
              <template v-else>
                Calon Referal akan menerima konfirmasi {{ selectedRejectStatus === 'reject' ? 'penolakan' : 'permintaan revisi' }} pendaftaran dengan deskripsi yang anda isikan di bawah ini.
              </template>
            </p>
          </div>

          <!-- Reject Status Selection -->
          <div v-if="type === 'reject'" class="mt-4">
            <label class="text-sm font-medium text-gray-700 mb-2 block">Tindakan<span class="text-red-500">*</span></label>
            <div class="flex gap-3">
              <label 
                :class="[
                  'flex-1 flex items-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer transition-all',
                  selectedRejectStatus === 'revision' 
                    ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-400' 
                    : 'border-base-200 hover:border-base-300'
                ]"
              >
                <input type="radio" v-model="selectedRejectStatus" value="revision" class="radio radio-sm radio-primary" />
                <span class="text-sm font-medium text-neutral-700">Minta Revisi</span>
              </label>
              <label 
                :class="[
                  'flex-1 flex items-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer transition-all',
                  selectedRejectStatus === 'reject' 
                    ? 'border-red-400 bg-red-50 ring-1 ring-red-400' 
                    : 'border-base-200 hover:border-base-300'
                ]"
              >
                <input type="radio" v-model="selectedRejectStatus" value="reject" class="radio radio-sm radio-error" />
                <span class="text-sm font-medium text-neutral-700">Tolak</span>
              </label>
            </div>
          </div>

          <!-- Deskripsi -->
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <label class="flex items-center gap-1">
                <span class="text-sm font-medium text-gray-700">{{ descriptionLabel }}<span class="text-red-500">*</span></span>
                <div class="tooltip tooltip-right" data-tip="Deskripsi ini akan terlihat oleh calon referral sebagai keterangan.">
                  <Info class="w-3.5 h-3.5 text-gray-400 cursor-help" />
                </div>
              </label>
              <span class="text-xs" :class="note.length > maxLength ? 'text-red-500' : 'text-gray-400'">{{ note.length }}/{{ maxLength }}</span>
            </div>
            <textarea 
              v-model="note" 
              :placeholder="descriptionPlaceholder" 
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
              @click="$emit('close')"
              :disabled="loading"
              class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg px-6"
            >
              Batal
            </button>
            <button 
              type="button"
              @click="handleConfirm"
              :disabled="loading || !note.trim() || note.length > maxLength"
              :class="confirmButtonClass"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else>{{ confirmButtonText }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Info } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  visible: boolean
  type: 'approve' | 'reject'
  loading?: boolean
}>(), {
  loading: false
})

const emit = defineEmits<{
  close: []
  confirm: [note: string, status: string]
}>()

const note = ref('')
const error = ref('')
const selectedRejectStatus = ref<'reject' | 'revision'>('revision')
const maxLength = 110

const descriptionLabel = computed(() => {
  if (props.type === 'approve') return 'Deskripsi Persetujuan'
  return selectedRejectStatus.value === 'reject' ? 'Alasan Penolakan' : 'Catatan Revisi'
})

const descriptionPlaceholder = computed(() => {
  if (props.type === 'approve') return 'Isi deskripsi persetujuan'
  return selectedRejectStatus.value === 'reject' ? 'Isi alasan penolakan' : 'Isi catatan yang perlu direvisi'
})

const confirmButtonText = computed(() => {
  if (props.type === 'approve') return 'Setujui Pendaftaran'
  return selectedRejectStatus.value === 'reject' ? 'Tolak Pendaftaran' : 'Minta Revisi'
})

const confirmButtonClass = computed(() => {
  const base = 'btn rounded-lg px-6 min-w-[160px]'
  if (props.type === 'approve') return `${base} btn-primary`
  if (selectedRejectStatus.value === 'reject') return `${base} bg-error hover:bg-error/80 border-error hover:border-error/80 text-white`
  return `${base} bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white`
})

watch(() => props.visible, (val) => {
  if (val) {
    note.value = ''
    error.value = ''
    selectedRejectStatus.value = 'revision'
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
  if (!note.value.trim()) {
    error.value = 'Deskripsi wajib diisi'
    return
  }
  if (note.value.length > maxLength) {
    error.value = `Deskripsi tidak boleh lebih dari ${maxLength} karakter`
    return
  }
  error.value = ''
  const status = props.type === 'approve' ? 'active' : selectedRejectStatus.value
  emit('confirm', note.value, status)
}
</script>
