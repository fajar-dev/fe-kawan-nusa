<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop click to close -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <h3 class="text-xl font-semibold text-neutral-800">Penarikan Poin</h3>
          <button @click="isOpen = false" class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-neutral-800">Jumlah Poin ditarik</label>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer" />
            </div>
            <input 
              v-model="withdrawAmount"
              type="number" 
              class="input input-bordered w-full rounded-xl h-12 text-lg focus:border-primary border-base-200 bg-white"
              placeholder="0"
            />
          </div>

          <div class="bg-neutral-50/50 border border-base-200 rounded-2xl p-5 space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-neutral-600">Jumlah poin yang ditarik x Rp. 1.000</span>
              <span class="text-neutral-800 font-medium">Rp. {{ (withdrawAmount * 1000).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-neutral-600">PPH 2,5% (dibulatkan)</span>
              <span class="text-neutral-800 font-medium">Rp. {{ (withdrawAmount * 1000 * 0.025).toLocaleString('id-ID') }}</span>
            </div>
            <div class="border-t border-base-200 pt-3 flex items-center justify-between">
              <span class="font-semibold text-neutral-800">Total withdraw</span>
              <span class="font-semibold text-neutral-900">Rp.{{ (withdrawAmount * 1000 * 0.975).toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200">
          <button 
            @click="isOpen = false"
            class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
          >
            Batal
          </button>
          <button 
            @click="handleTarikPoin"
            class="btn btn-primary rounded-lg px-6"
          >
            Tarik Poin
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CircleHelp } from 'lucide-vue-next'

const isOpen = defineModel<boolean>({ default: false })
const withdrawAmount = ref(500)

const emit = defineEmits(['withdraw'])

const handleTarikPoin = () => {
  emit('withdraw', withdrawAmount.value)
  isOpen.value = false
}

// Prevent background scrolling when modal is open
watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
