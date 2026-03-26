<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Trigger -->
    <div 
      @click="toggle"
      class="flex items-center justify-between w-full px-3 h-10 bg-white border border-base-200 rounded-lg cursor-pointer hover:border-primary transition-all group overflow-hidden"
      :class="{ 'border-primary ring-1 ring-primary/20': isOpen }"
    >
      <div class="flex-1 truncate pr-2">
        <span v-if="modelValue.length === 0" class="text-neutral-400 text-sm font-normal">{{ placeholder }}</span>
        <span v-else class="text-neutral-800 text-sm font-medium">
          {{ displayText }}
        </span>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <div v-if="modelValue.length > 0" class="badge badge-primary badge-sm text-xs h-4 min-h-0 font-bold px-1.5 border-none">
          {{ modelValue.length }}
        </div>
        <ChevronDown 
          class="w-4 h-4 text-neutral-400 group-hover:text-primary transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Dropdown Panel (Teleported to avoid clipping in scrollable containers) -->
    <Teleport to="body">
      <div 
        v-if="isOpen"
        ref="dropdownPanel"
        :style="dropdownStyle"
        class="fixed z-[10000] bg-white border border-base-200 rounded-xl shadow-2xl py-2 flex flex-col min-w-[200px] animate-in fade-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Search Input -->
        <div v-if="isSearchable" class="px-2 pb-2 mb-1 border-b border-base-100">
           <input 
             v-model="search" 
             type="text" 
             placeholder="Cari..." 
             class="input input-sm w-full bg-neutral-50 border-none rounded-md text-xs focus:ring-1 focus:ring-primary h-8"
           />
        </div>

        <!-- Options List -->
        <div class="max-h-60 overflow-y-auto px-1 space-y-0.5 custom-scrollbar">
          <label 
            v-for="option in filteredOptions" 
            :key="option.value"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-all group"
          >
            <input 
              type="checkbox" 
              :checked="modelValue.includes(option.value)"
              @change="toggleOption(option.value)"
              class="checkbox checkbox-xs checkbox-primary rounded border-neutral-300 pointer-events-none"
            />
            <span class="text-xs text-neutral-600 group-hover:text-neutral-800 font-medium transition-colors">
              {{ option.label }}
            </span>
          </label>

          <div v-if="filteredOptions.length === 0" class="px-3 py-4 text-center text-xs text-neutral-400">
             Opsi tidak ditemukan
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: any[]
  options: any[]
  placeholder?: string
  labelKey?: string
  valueKey?: string
  searchable?: boolean
}>(), {
  placeholder: 'Pilih opsi...',
  labelKey: 'label',
  valueKey: 'value',
  searchable: undefined
})

const emit = defineEmits(['update:modelValue'])

const containerRef = ref<HTMLElement | null>(null)
const dropdownPanel = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const search = ref('')

const dropdownStyle = ref<Record<string, string>>({
  top: '0px',
  left: '0px',
  width: '0px'
})

const updatePosition = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    const estimatedHeight = 300 // typical max height of the dropdown
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // If space below is limited and there is more space above, flip it
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      dropdownStyle.value = {
        bottom: `${window.innerHeight - rect.top + 4}px`,
        top: 'auto',
        left: `${rect.left}px`,
        width: `${rect.width}px`
      }
    } else {
      dropdownStyle.value = {
        top: `${rect.bottom + 4}px`,
        bottom: 'auto',
        left: `${rect.left}px`,
        width: `${rect.width}px`
      }
    }
  }
}

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    document.addEventListener('click', handleOutsideClick)
  }
}

const close = () => {
  isOpen.value = false
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleOutsideClick)
  search.value = ''
}

const handleOutsideClick = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node) && 
      dropdownPanel.value && !dropdownPanel.value.contains(event.target as Node)) {
    close()
  }
}

onUnmounted(() => {
  close()
})

const isSearchable = computed(() => {
  if (props.searchable !== undefined) return props.searchable
  return props.options.length > 5
})

// Normalize and filter options
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt }
    }
    return {
      label: opt[props.labelKey],
      value: opt[props.valueKey]
    }
  })
})

const filteredOptions = computed(() => {
  if (!search.value) return normalizedOptions.value
  const s = search.value.toLowerCase()
  return normalizedOptions.value.filter(opt => opt.label.toLowerCase().includes(s))
})

const displayText = computed(() => {
  if (props.modelValue.length === 0) return ''
  
  const selectedItems = normalizedOptions.value
    .filter(opt => props.modelValue.includes(opt.value))
    .map(opt => opt.label)
  
  if (selectedItems.length <= 2) {
    return selectedItems.join(', ')
  }
  return `${selectedItems.slice(0, 2).join(', ')} dan ${selectedItems.length - 2} lainnya`
})

const toggleOption = (value: any) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)
  
  if (index === -1) {
    newValue.push(value)
  } else {
    newValue.splice(index, 1)
  }
  
  emit('update:modelValue', newValue)
}
</script>