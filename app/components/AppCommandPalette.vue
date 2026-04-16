<template>
  <div>
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
                v-if="currentView !== 'root'" 
                @click="currentView = 'root'; search = ''"
                class="btn btn-ghost btn-xs text-neutral-400 hover:text-primary transition-colors flex items-center gap-1"
              >
                <ChevronLeft class="w-3 h-3" />
                <span>Kembali</span>
              </button>
            </div>

            <Command.List class="max-h-[500px] overflow-y-auto p-2">
              <!-- Search View -->
              <div v-if="search" class="flex flex-col">
                <!-- Loading -->
                <div v-if="isLoadingResults" class="flex items-center justify-center p-8 gap-3 text-neutral-400">
                  <Loader2 class="w-5 h-5 animate-spin text-primary" />
                  <span class="text-sm">Mencari...</span>
                </div>

                <!-- Hasil (Using standard divs as identified for reliability) -->
                <div v-if="results.length > 0" class="flex flex-col">
                  <div class="text-neutral-800">
                    Hasil Pencarian
                  </div>
                  
                  <div 
                    v-for="res in results" 
                    :key="res.route"
                    @click="handlePathNavigate(res.route)"
                    class="mx-1 px-3 py-3 rounded-lg text-sm flex items-center justify-between text-neutral-600 cursor-pointer transition-colors hover:bg-primary/5 hover:text-primary group"
                  >
                    <div class="flex items-center gap-4">
                      <component :is="getModuleIcon(res.module)" class="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                      <p>{{ res.title }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <ChevronRight class="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-if="!isLoadingResults && results.length === 0" class="p-12 text-center">
                  <div class="bg-neutral-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-200 border border-neutral-100">
                    <Search class="w-6 h-6" />
                  </div>
                  <p class="text-sm text-neutral-400">
                    Tidak ada hasil ditemukan untuk <span class="font-bold text-neutral-700 italic">"{{ search }}"</span>
                  </p>
                </div>
              </div>

              <!-- Navigation View -->
              <div v-else class="flex flex-col">
                <!-- Root -->
                <div v-if="currentView === 'root'" class="flex flex-col">
                  <Command.Group heading="Navigasi">
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
                      <ChevronRight v-if="item.children" class="w-4 h-4 text-neutral-400" />
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator class="h-px bg-base-200 my-2" />

                  <Command.Group heading="Lainnya">
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
                </div>

                <!-- Points -->
                <div v-if="currentView === 'point-saya'" class="flex flex-col">
                  <Command.Group heading="Poin Saya">
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
                </div>
              </div>
            </Command.List>
          </Command>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Home, Users, Package, Coins, BookOpen, Settings, History, ArrowRightLeft, ChevronRight, ChevronLeft, Search, Loader2, Video, Newspaper, MessageSquareWarning } from 'lucide-vue-next'
import { Command } from 'vue-command-palette'
import { additionalService } from '~/services/additional-service'
import type { SearchResult } from '~/types/additional'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isOpen = ref(props.modelValue || false)
const currentView = ref('root')
const search = ref('')
const results = ref<SearchResult[]>([])
const isLoadingResults = ref(false)

watch(() => props.modelValue, (val) => {
  if (val !== undefined) isOpen.value = val
  if (val === false) {
    currentView.value = 'root'
    search.value = ''
    results.value = []
  }
})

watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

// Search Logic
let timeoutId: any = null
watch(search, (q) => {
  if (timeoutId) clearTimeout(timeoutId)
  if (!q) {
    results.value = []
    return
  }
  timeoutId = setTimeout(async () => {
    isLoadingResults.value = true
    try {
      const response = await additionalService.search(q)
      if (response.success) {
        results.value = [...response.data]
      }
    } finally {
      isLoadingResults.value = false
    }
  }, 400)
})

const getModuleIcon = (module: string) => {
  switch (module) {
    case 'customer': return Users
    case 'service': return Package
    case 'educationArticle': return Newspaper
    case 'educationVideo': return Video
    default: return Search
  }
}

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
  { label: 'Riwayat Feedback', value: 'feedback', path: '/feedback', icon: MessageSquareWarning },
]

const handleItemAction = (item: any) => {
  if (item.children) {
    currentView.value = item.value
    search.value = '' 
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
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
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
