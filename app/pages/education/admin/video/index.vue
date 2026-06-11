<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BookOpen class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Video Edukasi</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Edukasi / Video
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <DataTable 
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && videos.length === 0"
        :total-from="meta?.from"
        :total-to="meta?.to"
        :total-entries="meta?.total"
        :current-page="meta?.currentPage"
        :last-page="meta?.lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari judul atau penulis..."
        @update:page="handlePageChange"
        @update:sort="handleSort"
        @update:order="handleOrderChange"
      >
        <!-- Filters Slot -->
        <template #filters>
          <DataFilter 
            :is-filter-active="isFilterActive"
            @apply="applyFilters"
            @reset="resetFilters"
            @cancel="cancelFilters"
          >
            <!-- Category Filter -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Kategori</span>
                <span @click="filterCategoryId = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="filterCategoryId" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium">
                <option value="">Semua Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </DataFilter>
          <NuxtLink 
            to="/education/admin/video/create" 
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Tambah Video
          </NuxtLink>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in videos" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Thumbnail Column -->
              <td v-show="isColumnVisible('thumbnail')" class="border-r border-base-200 w-28 text-center">
                <div class="relative w-20 h-12 rounded-lg overflow-hidden bg-neutral-100 mx-auto border border-base-200">
                  <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
                    <Video class="w-5 h-5" />
                  </div>
                  <div class="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                    <Play class="w-4 h-4 text-white" />
                  </div>
                </div>
              </td>
              <!-- Title Column -->
              <td v-show="isColumnVisible('title')" class="border-r border-base-200 max-w-xs truncate" :title="item.title">
                <span class="font-medium text-neutral-800">{{ item.title }}</span>
              </td>
              <!-- Video URL Column -->
              <td v-show="isColumnVisible('url')" class="border-r border-base-200 max-w-[200px] truncate" :title="item.url">
                <a :href="item.url" target="_blank" class="text-primary hover:underline font-mono text-xs flex items-center gap-1">
                  <ExternalLink class="w-3.5 h-3.5 shrink-0" />
                  Link Video
                </a>
              </td>
              <!-- Category Column -->
              <td v-show="isColumnVisible('category')" class="border-r border-base-200">
                <span class="badge bg-primary/10 border-none text-primary font-medium text-xs rounded-md">
                  {{ item.category?.name || '-' }}
                </span>
              </td>
              <!-- Author Column -->
              <td v-show="isColumnVisible('author')" class="border-r border-base-200 text-neutral-600">
                {{ item.author || '-' }}
              </td>
              <!-- Created Date Column -->
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateShort(item.createdAt) }}
              </td>
              <!-- Action Column -->
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div class="flex items-center justify-center gap-2">
                  <NuxtLink :to="`/education/admin/video/${item.id}`" class="btn btn-ghost btn-xs text-primary hover:bg-primary/10 rounded" title="Edit">
                    <Edit2 class="w-4 h-4" />
                  </NuxtLink>
                  <button @click="openDeleteModal(item)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hapus">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>

    <!-- Modals -->
    <ModalConfirmDelete
      v-model="isOpenDeleteModal"
      title="Hapus Video"
      :message="`Apakah Anda yakin ingin menghapus video '${videoToDelete?.title}'?`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { BookOpen, CircleHelp, Plus, Edit2, Trash2, Video, Play, ExternalLink } from 'lucide-vue-next'
import { educationService } from '~/services/education-service'
import { formatDateShort } from '~/utils/date'
import type { EducationVideo, EducationCategory } from '~/types/education'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Daftar Video Edukasi',
})

const columns = [
  { label: 'Thumbnail', key: 'thumbnail', sortable: false },
  { label: 'Judul', key: 'title', sortable: true },
  { label: 'URL Video', key: 'url', sortable: false },
  { label: 'Kategori', key: 'category', sortable: false },
  { label: 'Penulis', key: 'author', sortable: true },
  { label: 'Tanggal Dibuat', key: 'createdAt', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const videos = ref<EducationVideo[]>([])
const categories = ref<EducationCategory[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')

const filterCategoryId = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  categoryId: ''
})

const isOpenDeleteModal = ref(false)
const videoToDelete = ref<EducationVideo | null>(null)
const deleting = ref(false)

const toast = useToast()

const fetchCategories = async () => {
  try {
    const res = await educationService.getCategories()
    if (res.success) {
      categories.value = res.data
    }
  } catch (error) {
    // Silently ignore category list error
  }
}

const fetchVideos = async (queryParams: { page?: number } = {}) => {
  loading.value = true
  try {
    const params: any = {
      sort: currentSort.value,
      order: currentOrder.value,
      q: searchQuery.value || undefined,
      page: queryParams.page || 1,
      limit: 10
    }
    
    if (appliedFilters.value.categoryId) {
      params.categoryId = Number(appliedFilters.value.categoryId)
    }

    const response = await educationService.getVideos(params)
    if (response.success) {
      videos.value = response.data
      meta.value = response.meta as any
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar video')
  } finally {
    loading.value = false
  }
}

const cancelFilters = () => {
  filterCategoryId.value = appliedFilters.value.categoryId
}

const applyFilters = () => {
  appliedFilters.value = {
    categoryId: filterCategoryId.value
  }
  isFilterActive.value = appliedFilters.value.categoryId !== ''
  fetchVideos({ page: 1 })
}

const resetFilters = () => {
  filterCategoryId.value = ''
  applyFilters()
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchVideos({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchVideos({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchVideos({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchVideos({ page: 1 })
}

const openDeleteModal = (video: EducationVideo) => {
  videoToDelete.value = video
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!videoToDelete.value) return
  
  deleting.value = true
  try {
    const response = await educationService.deleteVideo(videoToDelete.value.id)
    if (response.success) {
      toast.success('Video berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchVideos({ page: 1 })
    } else {
      toast.error(response.message || 'Gagal menghapus video')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus video')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchVideos()
})
</script>
