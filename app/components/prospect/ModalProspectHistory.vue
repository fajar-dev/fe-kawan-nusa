<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>

      <div class="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">Riwayat Revisi dan Persetujuan</h3>
            <p class="text-xs text-neutral-500 mt-0.5">{{ prospect?.name || '-' }}</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="steps.length === 0" class="text-center py-8">
            <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <History class="w-5 h-5 text-neutral-400" />
            </div>
            <p class="text-neutral-400 text-sm">Belum ada riwayat perubahan</p>
          </div>

          <div v-else class="relative pl-6">
            <div class="absolute left-[9px] top-2 bottom-2 w-px bg-neutral-200"></div>

            <div v-for="(step, idx) in steps" :key="idx" class="relative mb-5 last:mb-0">
              <div
                class="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                :class="step.done ? 'bg-primary' : 'bg-amber-500'"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>

              <div class="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span class="badge badge-sm font-medium rounded-md" :class="step.done ? 'bg-primary/10 text-primary' : 'bg-amber-50 text-amber-600'">
                    {{ step.done ? 'Selesai' : 'Diproses' }}
                  </span>
                  <span class="text-sm font-medium text-neutral-800">{{ step.title }}</span>
                </div>
                <p v-if="step.note" class="text-sm text-neutral-600 mt-1">{{ step.note }}</p>
                <div class="flex items-center gap-2 mt-1.5 text-xs text-neutral-400">
                  <span>oleh <span class="font-medium text-neutral-500">{{ step.actor }}</span></span>
                  <span>&middot;</span>
                  <span>{{ step.datetime }}</span>
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
import { formatDateTime } from '~/utils/date'
import type { Prospect } from '~/types/prospect'

const props = defineProps<{
  prospect?: Prospect | null
}>()

const isOpen = defineModel<boolean>({ default: false })

interface TimelineStep {
  title: string
  datetime: string
  note?: string
  actor: string
  done: boolean
}

// Dummy timeline — derived from the prospect's own registration date/status so each row
// shows slightly different (but deterministic) content until this is wired to real data.
const steps = computed<TimelineStep[]>(() => {
  const p = props.prospect
  if (!p) return []

  const registDate = new Date(p.registDate)
  const plusHours = (h: number) => new Date(registDate.getTime() + h * 60 * 60 * 1000)

  return [
    {
      title: 'Anda mengajukan pendaftaran calon customer',
      datetime: formatDateTime(registDate.toISOString()),
      actor: 'Anda',
      done: true,
    },
    {
      title: 'Tim Account Manager memverifikasi data pengajuan',
      datetime: formatDateTime(plusHours(5).toISOString()),
      note: 'Data KTP dan alamat sudah sesuai, diteruskan ke Sales Manager.',
      actor: 'Hendra Saputra (AM)',
      done: true,
    },
    {
      title: 'Sales Manager sedang meninjau pengajuan',
      datetime: formatDateTime(plusHours(24).toISOString()),
      note: 'Menunggu konfirmasi ketersediaan jaringan di lokasi pelanggan.',
      actor: `${p.salesPic || 'Sales Manager'}`,
      done: false,
    },
  ]
})
</script>
