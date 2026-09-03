<template>
  <div>
    <button type="button" @click="show = !show" class="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
      <FlaskConical class="w-3.5 h-3.5" />
      Simulasi
      <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': show }" />
    </button>

    <div v-if="show" class="mt-2 bg-neutral-50 border border-dashed border-base-200 rounded-lg p-3 space-y-2">
      <div v-if="type === 'percentage'" class="flex items-center justify-between gap-3">
        <span class="text-xs text-neutral-500">Contoh pembayaran customer</span>
        <div class="relative w-36 shrink-0">
          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none font-medium z-10">Rp</span>
          <input
            v-model="displaySampleAmount"
            type="text"
            inputmode="numeric"
            placeholder="0"
            class="input input-bordered input-xs w-full h-7 pl-8 pr-2.5 text-xs font-medium bg-white rounded-md border-neutral-300 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-xs text-neutral-500">Komisi referral</span>
        <span class="text-sm font-semibold text-neutral-800">Rp {{ commission.toLocaleString('id-ID') }}</span>
      </div>
      <div class="border-t border-dashed border-base-200 pt-2 flex items-center justify-between">
        <span class="text-xs text-neutral-500">Poin masuk</span>
        <span class="text-base font-bold text-primary">{{ points.toLocaleString('id-ID') }} poin</span>
      </div>
      <p class="text-[10px] text-neutral-400">1 poin = Rp1.000 · pembulatan ke bawah</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FlaskConical, ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  type: 'percentage' | 'flat'
  value: number
}>()

const show = ref(false)
const sampleAmount = ref(3000000)

const displaySampleAmount = computed({
  get() {
    return sampleAmount.value ? sampleAmount.value.toLocaleString('id-ID') : ''
  },
  set(val: string) {
    const numeric = val.replace(/\D/g, '')
    sampleAmount.value = numeric ? parseInt(numeric, 10) : 0
  }
})

const commission = computed(() => {
  if (props.type === 'percentage') {
    return Math.round(((sampleAmount.value || 0) * (props.value || 0)) / 100)
  }
  return props.value || 0
})

const points = computed(() => Math.floor(commission.value / 1000))
</script>
