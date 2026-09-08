<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="!busy && (isOpen = false)"></div>

      <div class="bg-white rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Detail Perubahan</h3>
              <span v-if="adjustment" class="badge badge-sm font-medium" :class="statusBadgeClass(adjustment.status)">{{ statusLabel(adjustment.status) }}</span>
            </div>
            <p v-if="adjustment" class="text-xs text-neutral-500 mt-0.5">
              {{ adjustment.code }} · {{ adjustment.pointSubmission?.accountName }} · {{ adjustment.pointSubmission?.serviceName }}
            </p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div v-if="loading" class="flex justify-center py-10">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <div v-else-if="adjustment" class="p-6 overflow-y-auto flex-1 space-y-5">
          <!-- Old vs New -->
          <div class="grid grid-cols-2 rounded-lg border border-neutral-200 overflow-hidden">
            <div class="p-3 bg-neutral-50 border-r border-neutral-200">
              <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Nilai Lama</p>
              <p class="text-sm text-neutral-500">Nilai komisi</p>
              <p class="text-lg font-bold text-neutral-400 line-through decoration-neutral-300">Rp{{ formatNumber(adjustment.fromValue) }}</p>
              <p class="text-xs text-neutral-400">{{ formatNumber(adjustment.fromPoint) }} poin</p>
            </div>
            <div class="p-3 bg-neutral-50">
              <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Nilai Baru</p>
              <p class="text-sm text-neutral-500">Nilai komisi</p>
              <p class="text-lg font-bold text-red-600">Rp{{ formatNumber(adjustment.toValue) }}</p>
              <p class="text-xs text-neutral-400">{{ formatNumber(adjustment.toPoint) }} poin</p>
            </div>
          </div>

          <!-- Impact -->
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Dampak ke Saldo Referral</p>
            <div class="border border-dashed border-neutral-300 rounded-lg p-3 flex items-start gap-3">
              <span class="text-2xl font-bold text-primary shrink-0">{{ formatNumber(adjustment.toPoint) }}</span>
              <p class="text-sm text-neutral-600">
                poin masuk ke saldo <span class="font-semibold text-neutral-800">{{ adjustment.pointSubmission?.accountName }}</span> setelah disetujui di Input Poin —
                {{ pointDelta >= 0 ? '+' : '' }}{{ formatNumber(pointDelta) }} dari {{ formatNumber(adjustment.fromPoint) }} poin hasil rate.
                Ditandai <span class="font-semibold">Disesuaikan</span> di Laporan Rekap Poin Referral; nilai asli disimpan untuk rekonsiliasi.
              </p>
            </div>
          </div>

          <!-- Entry details -->
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Detail Entri</p>
            <div class="grid grid-cols-2 gap-y-2 text-sm">
              <span class="text-neutral-500">Kode</span>
              <span class="font-medium text-neutral-800">{{ adjustment.code }}</span>
              <span class="text-neutral-500">Referral</span>
              <span class="font-medium text-neutral-800">{{ adjustment.pointSubmission?.accountName }} <span class="text-neutral-400 font-normal">({{ adjustment.pointSubmission?.custId }})</span></span>
              <span class="text-neutral-500">Layanan</span>
              <span class="font-medium text-neutral-800 flex items-center gap-1.5">
                {{ adjustment.pointSubmission?.serviceName }}
                <span class="badge badge-sm bg-blue-50 text-blue-600 border-blue-200 font-medium">{{ adjustment.pointSubmission?.type }}</span>
              </span>
              <span class="text-neutral-500">Cabang</span>
              <span class="font-medium text-neutral-800">{{ adjustment.branchName || '-' }}</span>
              <span class="text-neutral-500">Pengaju</span>
              <span class="font-medium text-neutral-800">{{ adjustment.requestedBy?.name || '-' }}</span>
            </div>
          </div>

          <!-- Reason -->
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Alasan Penyesuaian</p>
            <p class="bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-sm text-neutral-700">{{ adjustment.reason }}</p>
          </div>

          <!-- SM note -->
          <div v-if="adjustment.reviewNote">
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5">Catatan Atasan</p>
            <p class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">{{ adjustment.reviewNote }}</p>
          </div>

          <!-- Audit trail -->
          <div>
            <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Jejak Audit</p>
            <div class="relative pl-6">
              <div class="absolute left-[9px] top-2 bottom-2 w-px bg-neutral-200"></div>
              <div v-for="h in adjustment.histories" :key="h.id" class="relative mb-4 last:mb-0">
                <div class="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full bg-primary border-2 border-white shadow-sm flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <p class="text-sm font-medium text-neutral-800">{{ actionLabel(h.action) }}</p>
                <p class="text-xs text-neutral-400 mt-0.5">{{ h.actor?.name || '-' }} · {{ formatDateTime(h.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Reviewer inline action: reject note -->
          <div v-if="mode === 'reject'" class="space-y-2">
            <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Catatan untuk pengaju <span class="text-red-500">*</span></span></label>
            <textarea v-model="reviewNoteInput" rows="3" placeholder="Jelaskan apa yang perlu diperbaiki..." class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 bg-white"></textarea>
          </div>

          <!-- Requester inline action: resubmit -->
          <div v-if="mode === 'edit'" class="space-y-3 border-t border-neutral-100 pt-4">
            <div>
              <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Nilai komisi baru <span class="text-red-500">*</span></span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">Rp</span>
                <input v-model.number="resubmitValue" type="number" min="0" step="1" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white pl-9" />
              </div>
              <p class="text-xs text-neutral-400 mt-1">Poin baru: {{ formatNumber(resubmitValue ? Math.floor(resubmitValue / 1000) : 0) }} poin</p>
            </div>
            <div>
              <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Alasan penyesuaian <span class="text-red-500">*</span></span></label>
              <textarea v-model="resubmitReason" rows="3" class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 bg-white"></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="adjustment" class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 shrink-0">
          <template v-if="mode === 'view'">
            <template v-if="canReview">
              <button @click="mode = 'reject'" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Kembalikan untuk Revisi</button>
              <button @click="doApprove" :disabled="busy" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
                <span v-if="busy" class="loading loading-spinner loading-xs"></span>
                Setujui
              </button>
            </template>
            <template v-else-if="canResubmit">
              <button @click="isOpen = false" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Tutup</button>
              <button @click="startEdit" class="btn btn-primary rounded-lg px-6 min-w-[120px]">Perbaiki &amp; Ajukan Ulang</button>
            </template>
            <button v-else @click="isOpen = false" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Tutup</button>
          </template>

          <template v-else-if="mode === 'reject'">
            <button @click="mode = 'view'" :disabled="busy" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Batal</button>
            <button @click="doReject" :disabled="busy || !reviewNoteInput.trim()" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
              <span v-if="busy" class="loading loading-spinner loading-xs"></span>
              Kirim Pengembalian
            </button>
          </template>

          <template v-else-if="mode === 'edit'">
            <button @click="mode = 'view'" :disabled="busy" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Batal</button>
            <button @click="doResubmit" :disabled="busy || !resubmitValue || !resubmitReason.trim()" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
              <span v-if="busy" class="loading loading-spinner loading-xs"></span>
              Kirim Ulang
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { formatNumber } from '~/utils/string'
import { formatDateTime } from '~/utils/date'
import { pointAdjustmentService } from '~/services/point-adjustment-service'
import type { PointAdjustment, PointAdjustmentStatus, PointAdjustmentAction } from '~/types/point-adjustment'

const props = defineProps<{ adjustmentId?: number | null }>()
const emit = defineEmits<{ changed: [] }>()

const isOpen = defineModel<boolean>({ default: false })

const { state } = useAuth()
const toast = useToast()

const adjustment = ref<PointAdjustment | null>(null)
const loading = ref(false)
const busy = ref(false)
const mode = ref<'view' | 'reject' | 'edit'>('view')
const reviewNoteInput = ref('')
const resubmitValue = ref<number | null>(null)
const resubmitReason = ref('')

const pointDelta = computed(() => (adjustment.value ? adjustment.value.toPoint - adjustment.value.fromPoint : 0))

const currentEmployeeId = computed(() => state.user?.id ?? null)
const canReview = computed(() =>
  adjustment.value?.status === 'pending_approval' && adjustment.value?.approver?.id === currentEmployeeId.value
)
const canResubmit = computed(() =>
  adjustment.value?.status === 'needs_revision' && adjustment.value?.requestedBy?.id === currentEmployeeId.value
)

const statusLabel = (status: PointAdjustmentStatus) => ({
  pending_approval: 'Menunggu SM',
  needs_revision: 'Perlu Revisi',
  approved_pending_credit: 'Menunggu Credit',
  completed: 'Sudah Credit',
}[status])

const statusBadgeClass = (status: PointAdjustmentStatus) => ({
  pending_approval: 'bg-amber-50 text-amber-600 border-amber-200',
  needs_revision: 'bg-blue-50 text-blue-600 border-blue-200',
  approved_pending_credit: 'bg-purple-50 text-purple-600 border-purple-200',
  completed: 'bg-success/10 text-success border-success/20',
}[status])

const actionLabel = (action: PointAdjustmentAction) => ({
  submitted: 'Diajukan',
  returned_for_revision: 'Dikembalikan untuk Revisi',
  resubmitted: 'Diajukan Ulang',
  approved: 'Disetujui Atasan',
  credited: 'Credit ke Saldo Referral',
}[action])

const fetchDetail = async (id: number) => {
  loading.value = true
  mode.value = 'view'
  try {
    const res = await pointAdjustmentService.getById(id)
    if (res.success) adjustment.value = res.data
  } finally {
    loading.value = false
  }
}

watch([isOpen, () => props.adjustmentId], ([open, id]) => {
  if (open && id) fetchDetail(id)
  if (!open) adjustment.value = null
})

const startEdit = () => {
  if (!adjustment.value) return
  resubmitValue.value = adjustment.value.toValue
  resubmitReason.value = adjustment.value.reason
  mode.value = 'edit'
}

const doApprove = async () => {
  if (!adjustment.value) return
  busy.value = true
  try {
    const res = await pointAdjustmentService.review(adjustment.value.id, 'approve')
    if (res.success) {
      toast.success('Pengajuan penyesuaian poin disetujui')
      adjustment.value = res.data
      emit('changed')
    } else {
      toast.error(res.message || 'Gagal menyetujui pengajuan')
    }
  } finally {
    busy.value = false
  }
}

const doReject = async () => {
  if (!adjustment.value || !reviewNoteInput.value.trim()) return
  busy.value = true
  try {
    const res = await pointAdjustmentService.review(adjustment.value.id, 'reject', reviewNoteInput.value.trim())
    if (res.success) {
      toast.success('Pengajuan dikembalikan untuk revisi')
      adjustment.value = res.data
      mode.value = 'view'
      emit('changed')
    } else {
      toast.error(res.message || 'Gagal mengembalikan pengajuan')
    }
  } finally {
    busy.value = false
  }
}

const doResubmit = async () => {
  if (!adjustment.value || !resubmitValue.value || !resubmitReason.value.trim()) return
  busy.value = true
  try {
    const res = await pointAdjustmentService.resubmit(adjustment.value.id, { toValue: resubmitValue.value, reason: resubmitReason.value.trim() })
    if (res.success) {
      toast.success('Pengajuan berhasil diajukan ulang')
      adjustment.value = res.data
      mode.value = 'view'
      emit('changed')
    } else {
      toast.error(res.message || 'Gagal mengajukan ulang')
    }
  } finally {
    busy.value = false
  }
}
</script>
