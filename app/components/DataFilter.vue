<template>
  <details :class="['dropdown dropdown-bottom', align === 'end' ? 'md:dropdown-end' : 'md:dropdown-start']" ref="detailsRef">
    <summary 
      class="btn btn-outline border-primary text-primary btn-md h-10 px-4 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors w-full md:w-auto list-none cursor-pointer appearance-none outline-none"
      :class="{ 'bg-primary/10': isFilterActive }"
    >
      <div class="indicator">
        <span v-if="isFilterActive" class="indicator-item badge bg-red-500 size-2 p-0 border-none"></span>
        <Filter class="w-4 h-4 text-primary" />
      </div>
      {{ label }}
    </summary>
    <div :class="['dropdown-content z-[999] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[500px] shadow-xl border border-base-200 mt-2', align === 'end' ? 'right-0' : 'left-0 md:left-auto']">
      <div class="card-body p-0">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-2 border-b border-base-200">
          <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
          <button @click="handleCancel" type="button" class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
        </div>
        
        <!-- Content -->
        <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
          <slot />
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-base-200 flex items-center justify-between">
          <button @click="handleReset" type="button" class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-md rounded-lg font-semibold">
            Atur Ulang
          </button>
          <button @click="handleApply" type="button" class="btn bg-primary/10 border-primary text-primary hover:bg-primary/90 btn-md rounded-lg font-semibold">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { Filter, X } from 'lucide-vue-next'

withDefaults(defineProps<{
  isFilterActive?: boolean
  label?: string
  align?: 'start' | 'end'
}>(), {
  isFilterActive: false,
  label: 'Filter',
  align: 'start'
})

const emit = defineEmits(['apply', 'reset', 'cancel'])

const detailsRef = ref<HTMLDetailsElement | null>(null)

const close = () => {
  detailsRef.value?.removeAttribute('open')
}

const handleApply = () => {
  emit('apply')
  close()
}

const handleReset = () => {
  emit('reset')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

defineExpose({ close })
</script>

<style scoped>
/* Hide the default details arrow across all browsers */
details summary::-webkit-details-marker {
  display: none;
}
</style>
