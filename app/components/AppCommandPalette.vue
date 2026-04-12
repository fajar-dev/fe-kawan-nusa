<template>
  <div>
    <!-- Command Palette Trigger (Optional, or moved to parent) -->
    <!-- For this component, we'll just handle the modal and keyboard shortcut -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[999] bg-black/40 backdrop-blur-xs flex items-start justify-center pt-10 px-4" 
        @click.self="closePalette"
      >
        <div class="w-full max-w-2xl animate-in fade-in zoom-in duration-200">
          <Command 
            theme="custom" 
            class="bg-white border border-base-300 rounded-xl overflow-hidden shadow-2xl w-full max-w-2xl flex flex-col"
          >
            <div class="flex items-center border-b border-base-200 px-4">
              <Search class="w-5 h-5 text-neutral-400 mr-3" />
              <Command.Input 
                v-model:value="search"
                placeholder="Cari fitur, menu, atau informasi..." 
                class="w-full outline-none text-base placeholder:text-neutral-400 bg-transparent py-5" 
              />
              <button 
                v-if="currentView !== 'root' && !search" 
                @click="currentView = 'root'"
                class="btn btn-ghost btn-xs text-neutral-400 hover:text-primary transition-colors flex items-center gap-1"
              >
                <ChevronLeft class="w-3 h-3" />
                <span>Kembali</span>
              </button>
            </div>

            <Command.List class="max-h-[450px] overflow-y-auto p-2">
              <Command.Empty class="p-8 text-center text-sm text-neutral-400">
                Tidak ada hasil yang ditemukan.
              </Command.Empty>

              <!-- NAVIGASI GROUP -->
              <Command.Group 
                v-if="search || currentView === 'root'"
                heading="Navigasi" 
                class="[&_[data-command-palette-group-heading]]:px-3 [&_[data-command-palette-group-heading]]:py-2 [&_[data-command-palette-group-heading]]:text-xs [&_[data-command-palette-group-heading]]:font-bold [&_[data-command-palette-group-heading]]:text-neutral-400 [&_[data-command-palette-group-heading]]:uppercase [&_[data-command-palette-group-heading]]:tracking-widest"
              >
                <Command.Item 
                  v-for="item in rootNavigationItems" 
                  :key="item.value"
                  :value="item.label" 
                  @select="handleItemAction(item)"
                  class="px-3 py-2.5 rounded-lg text-sm flex items-center justify-between text-neutral-600 cursor-pointer transition-colors aria-selected:bg-primary/10 aria-selected:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                >
                  <div class="flex items-center gap-3">
                      <component :is="item.icon" class="w-4 h-4 mr-2" />
                      {{ item.label }}
                  </div>
                  <ChevronRight v-if="item.children && !search" class="w-4 h-4 text-neutral-400" />
                </Command.Item>
              </Command.Group>
              
              <!-- POIN SAYA GROUP -->
              <Command.Group 
                v-if="search || currentView === 'point-saya'"
                heading="Poin Saya" 
                class="[&_[data-command-palette-group-heading]]:px-3 [&_[data-command-palette-group-heading]]:py-2 [&_[data-command-palette-group-heading]]:text-xs [&_[data-command-palette-group-heading]]:font-bold [&_[data-command-palette-group-heading]]:text-neutral-400 [&_[data-command-palette-group-heading]]:uppercase [&_[data-command-palette-group-heading]]:tracking-widest"
              >
                <Command.Item 
                  v-for="item in pointItems" 
                  :key="item.value"
                  :value="item.label" 
                  @select="handlePathNavigate(item.path)"
                  class="px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 text-neutral-600 cursor-pointer transition-colors aria-selected:bg-primary/10 aria-selected:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                >
                  <component :is="item.icon" class="w-4 h-4 mr-2" />
                  {{ item.label }}
                </Command.Item>
              </Command.Group>
              
              <Command.Separator v-if="search || currentView === 'root'" class="h-px bg-base-200 my-2" />
              
              <!-- LAINNYA GROUP -->
              <Command.Group 
                v-if="search || currentView === 'root'"
                heading="Lainnya" 
                class="[&_[data-command-palette-group-heading]]:px-3 [&_[data-command-palette-group-heading]]:py-2 [&_[data-command-palette-group-heading]]:text-xs [&_[data-command-palette-group-heading]]:font-bold [&_[data-command-palette-group-heading]]:text-neutral-400 [&_[data-command-palette-group-heading]]:uppercase [&_[data-command-palette-group-heading]]:tracking-widest"
              >
                <Command.Item 
                  v-for="item in otherItems" 
                  :key="item.value"
                  :value="item.label" 
                  @select="handlePathNavigate(item.path)"
                  class="px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 text-neutral-600 cursor-pointer transition-colors aria-selected:bg-primary/10 aria-selected:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                >
                  <component :is="item.icon" class="w-4 h-4 mr-2" />
                  {{ item.label }}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { 
  Home, Users, Package, Coins, 
  BookOpen, Settings, History, 
  ArrowRightLeft, ChevronRight, ChevronLeft, Search,
  MessageSquare
} from 'lucide-vue-next'
import { Command } from 'vue-command-palette'
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue || false)
const currentView = ref('root')
const search = ref('')

watch(() => props.modelValue, (val) => {
  if (val !== undefined) isOpen.value = val
  if (val === false) {
    currentView.value = 'root'
    search.value = ''
  }
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const rootNavigationItems = [
  { label: 'Beranda', value: 'home', path: '/', icon: Home },
  { label: 'Customer Saya', value: 'customer', path: '/customer', icon: Users },
  { label: 'Produk dan Layanan', value: 'service', path: '/service', icon: Package },
  { label: 'Poin Saya', value: 'point-saya', icon: Coins, children: true },
]

const pointItems = [
  { label: 'Aktivitas Poin', value: 'point-activity', path: '/point/activity/reward', icon: History },
  { label: 'Tukar Poin', value: 'point-redeem', path: '/point/reedem', icon: ArrowRightLeft },
]

const otherItems = [
  { label: 'Edukasi', value: 'education', path: '/education', icon: BookOpen },
  { label: 'Pengaturan', value: 'setting', path: '/setting', icon: Settings },
  { label: 'Feedback Saya', value: 'feedback', path: '/feedback', icon: MessageSquare },
]

const handleItemAction = (item: any) => {
    if (item.children) {
        currentView.value = item.value
        search.value = '' // Clear search when entering sub-view
    } else if (item.path) {
        handlePathNavigate(item.path)
    }
}

const handlePathNavigate = (path: string) => {
    isOpen.value = false
    navigateTo(path)
}

const closePalette = () => {
    isOpen.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        isOpen.value = !isOpen.value
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

defineExpose({
  open: () => isOpen.value = true,
  close: () => isOpen.value = false,
  toggle: () => isOpen.value = !isOpen.value
})
</script>
