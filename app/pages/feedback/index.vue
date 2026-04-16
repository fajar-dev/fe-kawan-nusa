<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
            <MessageSquareWarning class="w-9 h-9 mt-1 text-neutral-800" />
            <div>
                <div class="flex items-center gap-2">
                <h1 class="text-xl font-medium text-neutral-800">Riwayat Feedback</h1>
                </div>
                <p class="text-xs text-neutral-400 font-medium mt-0.5">
                <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Riwayat Feedback
                </p>
            </div>
            </div>
        </div>
        </AppToolbar>

        <!-- Feedback Table -->
        <DataTable 
        flat 
            :columns="currentColumns"
            :loading="isLoading"
            :is-empty="!isLoading && feedbacks.length === 0"
            v-model:search-query="searchQuery"
            :total-from="1"
            :total-to="feedbacks.length"
            :total-entries="feedbacks.length"
            :current-page="page"
            :last-page="totalPages"
            :current-sort="sort"
            :current-order="order"
            @update:page="page = $event"
            @update:sort="sort = $event"
            @update:order="order = $event"
        >
        <template #filters>
            <DataFilter 
              :is-filter-active="isFilterActive"
              @apply="applyFilters"
              @reset="resetFilters"
              @cancel="cancelFilters"
            >
              <div class="space-y-4">
                <!-- Kategori -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-neutral-400 text-xs font-medium">Kategori</span>
                    <span @click="tempCategories = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                  </div>
                  <MultiSelect 
                    v-model="tempCategories"
                    :options="categoryOptions"
                    labelKey="label"
                    valueKey="value"
                    placeholder="Semua Kategori"
                  />
                </div>

                <!-- Tanggapan -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-neutral-400 text-xs font-medium">Tanggapan</span>
                    <span @click="tempReply = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                  </div>
                  <select
                    v-model="tempReply"
                    class="select select-bordered w-full text-sm min-h-10 h-10"
                  >
                    <option value="">Semua Status</option>
                    <option v-for="opt in replyOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
              </div>
            </DataFilter>
        </template>

        <template #body="{ isColumnVisible }">
            <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in paginatedFeedbacks" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
                <!-- Waktu -->
                <td v-show="isColumnVisible('timestamp')" class="border-r border-base-200 whitespace-nowrap align-top">
                {{ item.timestamp ? formatDateTime(item.timestamp) : '-' }}
                </td>
                
                <!-- Kategori / Tipe -->
                <td v-show="isColumnVisible('category')" class="border-r border-base-200 align-top">
                    <div class="flex flex-col gap-1">
                        <span class="text-sm text-neutral-800 capitalize">{{ item.category || '-' }}</span>
                    </div>
                </td>

                <!-- Pesan -->
                <td v-show="isColumnVisible('message')" class="border-r border-base-200 min-w-[200px] max-w-sm align-top">
                    <span class="font-semibold text-sm text-neutral-800 flex items-center gap-1 mb-2"> {{ item.url }} </span>
                    <p class="whitespace-normal break-words text-neutral-500 text-xs">{{ item.message }}</p>
                </td>

                <!-- Gambar -->
                <td v-show="isColumnVisible('images')" class="border-r border-base-200 align-top">
                <div v-if="item.images && item.images.length > 0" class="flex flex-wrap gap-2">
                    <button 
                    v-for="(img, idx) in item.images" 
                    :key="idx"
                    @click="openPreview(img)"
                    class="relative group block w-12 h-12 rounded bg-base-200 overflow-hidden shrink-0 border border-base-200 cursor-pointer"
                    >
                    <img :src="img" class="w-full h-full object-cover" alt="Feedback image" loading="lazy" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 class="w-4 h-4 text-white" />
                    </div>
                    </button>
                </div>
                <span v-else class="text-neutral-400 text-xs">-</span>
                </td>

                <!-- Tanggapan -->
                <td v-show="isColumnVisible('reply')" class="border-r border-base-200 min-w-[150px] align-top">
                    <span class="font-semibold text-sm text-neutral-800 flex items-center gap-1 mb-2"> {{ item.type }} </span>
                    <p class="whitespace-normal break-words text-neutral-500 text-xs">{{ item.reply || 'Belum ada tanggapan' }}</p>
                </td>
            </tr>
            </tbody>
        </template>
        </DataTable>

        <!-- Image Preview Modal -->
        <ModalImagePreview 
          :is-open="!!previewImage" 
          :image-url="previewImage" 
          @close="closePreview" 
        />
    </div>
</template>

<script setup lang="ts">
import { Link, Maximize2, MessageSquareWarning } from 'lucide-vue-next'
import { feedbackService } from '~/services/feedback-service'
import { formatDateTime } from '~/utils/date'

definePageMeta({
  bgColor: 'bg-white'
})


useHead({
  title: 'Riwayat Ulasan',
})

const searchQuery = ref('')
const page = ref(1)
const sort = ref('timestamp')
const order = ref<'asc' | 'desc'>('desc')
const itemsPerPage = 10

const categoryOptions = [
  { label: 'Keluhan', value: 'keluhan' },
  { label: 'Saran', value: 'saran' },
  { label: 'Pujian', value: 'pujian' }
]

const replyOptions = [
  { label: 'Sudah Ditanggapi', value: 'replied' },
  { label: 'Belum Ditanggapi', value: 'not_replied' }
]

const tempCategories = ref<string[]>([])
const tempReply = ref<string>('')

const appliedFilters = ref({
  categories: [] as string[],
  reply: '' as string
})

const cancelFilters = () => {
  tempCategories.value = [...appliedFilters.value.categories]
  tempReply.value = appliedFilters.value.reply
}

const applyFilters = () => {
  appliedFilters.value = {
    categories: [...tempCategories.value],
    reply: tempReply.value
  }
  page.value = 1
}

const resetFilters = () => {
  tempCategories.value = []
  tempReply.value = ''
  applyFilters()
}

const isFilterActive = computed(() => {
  return appliedFilters.value.categories.length > 0 || !!appliedFilters.value.reply
})

const previewImage = ref('')

const openPreview = (img: string) => {
  previewImage.value = img
}

const closePreview = () => {
  previewImage.value = ''
}

const { data: response, status } = useAsyncData(
  'feedbacks',
  () => feedbackService.getFeedback()
)

const isLoading = computed(() => status.value === 'pending')
const feedbacks = computed(() => {
  let items = response.value?.data || []
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => 
      (i.message && i.message.toLowerCase().includes(q)) || 
      (i.category && i.category.toLowerCase().includes(q)) ||
      (i.type && i.type.toLowerCase().includes(q)) ||
      (i.reply && i.reply.toLowerCase().includes(q))
    )
  }

  if (appliedFilters.value.categories.length > 0) {
    items = items.filter(i => {
      const typeStr = (i.type || '').toLowerCase()
      const catStr = (i.category || '').toLowerCase()
      return appliedFilters.value.categories.some(c => typeStr.includes(c) || catStr.includes(c))
    })
  }

  if (appliedFilters.value.reply) {
    items = items.filter(i => {
      const hasReply = !!i.reply && i.reply.trim().length > 0
      if (appliedFilters.value.reply === 'replied' && hasReply) return true
      if (appliedFilters.value.reply === 'not_replied' && !hasReply) return true
      return false
    })
  }

  // Sort
  items = [...items].sort((a, b) => {
    let valA: string | number | undefined = a[sort.value as keyof typeof a] as string | undefined
    let valB: string | number | undefined = b[sort.value as keyof typeof b] as string | undefined
    
    if (sort.value === 'timestamp') {
      valA = new Date(a.timestamp).getTime()
      valB = new Date(b.timestamp).getTime()
    }

    if (valA === undefined) valA = ''
    if (valB === undefined) valB = ''

    if (valA < valB) return order.value === 'asc' ? -1 : 1
    if (valA > valB) return order.value === 'asc' ? 1 : -1
    return 0
  })

  return items
})

const paginatedFeedbacks = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return feedbacks.value.slice(start, end)
})

const currentColumns = [
  { label: 'Waktu', key: 'timestamp', sortable: true },
  { label: 'Kategori', key: 'category', sortable: true },
  { label: 'Pesan', key: 'message' },
  { label: 'Gambar', key: 'images' },
  { label: 'Tanggapan', key: 'reply' }
]

// To handle pagination properly using the local sorted array lengths
const totalPages = computed(() => Math.ceil(feedbacks.value.length / itemsPerPage))

</script>