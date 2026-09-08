<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="!submitting && (isOpen = false)"></div>

      <div class="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Ajukan Penyesuaian Poin</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Koreksi poin komisi entri yang masih Belum Disetujui.</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5">
          <!-- Entry select -->
          <div>
            <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Entri poin (Belum Disetujui) <span class="text-red-500">*</span></span></label>
            <select v-model="selectedId" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :disabled="loadingOptions || submitting">
              <option :value="null" disabled>{{ loadingOptions ? 'Memuat entri...' : 'Pilih entri poin' }}</option>
              <option v-for="opt in options" :key="opt.id" :value="opt.id">
                {{ opt.accountName }} · {{ opt.serviceName }} · {{ opt.custId }}
              </option>
            </select>
            <p class="text-xs text-neutral-400 mt-1">Hanya entri milikmu yang belum punya pengajuan terbuka yang muncul di sini.</p>
          </div>

          <template v-if="selected">
            <!-- Current value snapshot -->
            <div class="bg-neutral-50 rounded-lg border border-neutral-100 p-4 space-y-2.5">
              <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Nilai Saat Ini</p>
              <div class="grid grid-cols-2 gap-y-2 text-sm">
                <span class="text-neutral-500">Tipe komisi</span>
                <span><span class="badge badge-sm font-medium" :class="selected.type === 'Bulanan' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'">{{ selected.type }}</span></span>
                <span class="text-neutral-500">Cabang</span>
                <span class="font-semibold text-neutral-800">{{ selected.branchName || '-' }}</span>
                <span class="text-neutral-500">Nilai komisi saat ini</span>
                <span class="font-semibold text-neutral-800">Rp{{ formatNumber(selected.currentValue) }}</span>
                <span class="text-neutral-500">Poin terbit</span>
                <span class="font-semibold text-neutral-800">{{ formatNumber(selected.currentPoint) }} poin</span>
              </div>
            </div>

            <!-- New value -->
            <div>
              <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Nilai komisi baru <span class="text-red-500">*</span></span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">Rp</span>
                <input v-model.number="toValue" type="number" min="0" step="1" placeholder="0" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white pl-9" :disabled="submitting" />
              </div>
              <p class="text-xs text-neutral-400 mt-1">
                Poin dihitung ulang otomatis: <span class="font-semibold text-neutral-600">{{ formatNumber(newPoint) }} poin</span> · pembulatan ke bawah, 1 poin = Rp1.000.
              </p>
            </div>

            <div v-if="selected.type === 'Bulanan'" class="bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-lg p-3">
              <span class="font-semibold">Layanan bulanan:</span> nilai baru berlaku untuk bulan berjalan yang belum di-credit dan sisa bulan berikutnya. Bulan yang sudah masuk saldo tidak berubah.
            </div>

            <!-- Reason -->
            <div>
              <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Alasan penyesuaian <span class="text-red-500">*</span></span></label>
              <textarea v-model="reason" rows="3" placeholder="Jelaskan kenapa poin ini perlu disesuaikan..." class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 bg-white" :disabled="submitting"></textarea>
              <p class="text-xs text-neutral-400 mt-1">Alasan tampil ke atasan Anda dan tercatat di audit log serta laporan accounting.</p>
            </div>

            <div class="bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-lg p-3 flex items-start gap-2">
              <Lock class="w-4 h-4 mt-0.5 shrink-0" />
              <span>Setelah diajukan, entri ini dikunci di Input Poin sampai atasan Anda memutuskan.</span>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 shrink-0">
          <button @click="isOpen = false" :disabled="submitting" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Batal</button>
          <button @click="handleSubmit" :disabled="!canSubmit || submitting" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            Ajukan ke Atasan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Lock } from 'lucide-vue-next'
import { formatNumber } from '~/utils/string'
import { pointAdjustmentService } from '~/services/point-adjustment-service'
import type { EligiblePointSubmission } from '~/types/point-adjustment'

const emit = defineEmits<{
  submit: [payload: { pointSubmissionId: number; toValue: number; reason: string }]
}>()

const isOpen = defineModel<boolean>({ default: false })
const props = defineProps<{ submitting?: boolean; initialSubmissionId?: number | null }>()

const options = ref<EligiblePointSubmission[]>([])
const loadingOptions = ref(false)
const selectedId = ref<number | null>(null)
const toValue = ref<number | null>(null)
const reason = ref('')

const selected = computed(() => options.value.find(o => o.id === selectedId.value) || null)
const newPoint = computed(() => toValue.value ? Math.floor(toValue.value / 1000) : 0)
const canSubmit = computed(() => !!selectedId.value && !!toValue.value && toValue.value > 0 && reason.value.trim().length > 0)

const fetchOptions = async () => {
  loadingOptions.value = true
  try {
    const res = await pointAdjustmentService.getEligibleSubmissions()
    if (res.success) {
      options.value = res.data
      if (props.initialSubmissionId && res.data.some(o => o.id === props.initialSubmissionId)) {
        selectedId.value = props.initialSubmissionId
      }
    }
  } finally {
    loadingOptions.value = false
  }
}

const resetForm = () => {
  selectedId.value = null
  toValue.value = null
  reason.value = ''
}

watch(isOpen, (val) => {
  if (val) {
    resetForm()
    fetchOptions()
  }
})

const handleSubmit = () => {
  if (!canSubmit.value || !selectedId.value || !toValue.value) return
  emit('submit', { pointSubmissionId: selectedId.value, toValue: toValue.value, reason: reason.value.trim() })
}
</script>
