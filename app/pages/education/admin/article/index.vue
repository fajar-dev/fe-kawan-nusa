<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Artikel Edukasi</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Edukasi / Artikel
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <NuxtLink 
          v-if="canCreate('education')"
          to="/education/admin/article/create" 
          class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
        >
          Tambah Artikel
        </NuxtLink>
      </template>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <DataTable 
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && articles.length === 0"
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

            <!-- Date Range -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tanggal Dibuat</span>
                <span @click="filterStartDate = ''; filterEndDate = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <div class="flex items-center gap-2">
                <input v-model="filterStartDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
                <span class="text-neutral-400 text-sm shrink-0">s/d</span>
                <input v-model="filterEndDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
              </div>
            </div>
          </DataFilter>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in articles" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Image Column -->
              <td v-show="isColumnVisible('image')" class="border-r border-base-200 w-24 text-center">
                <div class="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 mx-auto border border-base-200">
                  <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
                    <BookOpen class="w-4.5 h-4.5" />
                  </div>
                </div>
              </td>
              <!-- Title Column -->
              <td v-show="isColumnVisible('title')" class="border-r border-base-200 max-w-xs md:max-w-sm truncate" :title="item.title">
                <span class="font-medium text-neutral-800">{{ item.title }}</span>
              </td>
              <!-- Category Column -->
              <td v-show="isColumnVisible('category')" class="border-r border-base-200">
                <span class="badge bg-primary/10 border-none text-primary font-medium text-xs rounded-md">
                  {{ item.category?.name || '-' }}
                </span>
              </td>
              <!-- Author Column -->
              <td v-show="isColumnVisible('author')" class="border-r border-base-200 text-neutral-600">
                {{ item.author?.name || '-' }}
              </td>
              <!-- Created Date Column -->
              <td v-show="isColumnVisible('createdAt')" class="border-r border-base-200 whitespace-nowrap">
                {{ formatDateShort(item.createdAt) }}
              </td>
              <!-- Action Column -->
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div class="flex items-center justify-center gap-0">
                  <NuxtLink v-if="canEdit('education')" :to="`/education/admin/article/${item.id}`" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Edit">
                    <SquarePen class="w-4.5 h-4.5" />
                  </NuxtLink>
                  <button v-if="canDelete('education')" @click="openDeleteModal(item)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hapus">
                    <Trash2 class="w-4.5 h-4.5" />
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
      title="Hapus Artikel"
      :message="`Apakah Anda yakin ingin menghapus artikel '${articleToDelete?.title}'?`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { BookOpen, CircleHelp, Plus, SquarePen, Trash2 } from 'lucide-vue-next'
import { educationService } from '~/services/education-service'
import { formatDateShort } from '~/utils/date'
import type { EducationArticle, EducationCategory } from '~/types/education'
import type { PaginationMeta } from '~/types/customer'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Daftar Artikel Edukasi',
})

const columns = [
  { label: 'Gambar', key: 'image', sortable: false },
  { label: 'Judul', key: 'title', sortable: true },
  { label: 'Kategori', key: 'category', sortable: false },
  { label: 'Penulis', key: 'author', sortable: true },
  { label: 'Tanggal Dibuat', key: 'createdAt', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const articles = ref<EducationArticle[]>([])
const categories = ref<EducationCategory[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('createdAt')
const currentOrder = ref<'asc' | 'desc'>('desc')

const filterCategoryId = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  categoryId: '',
  startDate: '',
  endDate: ''
})

const isOpenDeleteModal = ref(false)
const articleToDelete = ref<EducationArticle | null>(null)
const deleting = ref(false)

const toast = useToast()
const { canCreate, canEdit, canDelete } = usePermission()

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

const fetchArticles = async (queryParams: { page?: number } = {}) => {
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
    if (appliedFilters.value.startDate) {
      params.startDate = appliedFilters.value.startDate
    }
    if (appliedFilters.value.endDate) {
      params.endDate = appliedFilters.value.endDate
    }

    const response = await educationService.getArticles(params)
    if (response.success) {
      articles.value = response.data
      meta.value = response.meta as any
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar artikel')
  } finally {
    loading.value = false
  }
}

const cancelFilters = () => {
  filterCategoryId.value = appliedFilters.value.categoryId
  filterStartDate.value = appliedFilters.value.startDate
  filterEndDate.value = appliedFilters.value.endDate
}

const applyFilters = () => {
  appliedFilters.value = {
    categoryId: filterCategoryId.value,
    startDate: filterStartDate.value,
    endDate: filterEndDate.value
  }
  isFilterActive.value = appliedFilters.value.categoryId !== '' || appliedFilters.value.startDate !== '' || appliedFilters.value.endDate !== ''
  fetchArticles({ page: 1 })
}

const resetFilters = () => {
  filterCategoryId.value = ''
  filterStartDate.value = ''
  filterEndDate.value = ''
  applyFilters()
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchArticles({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchArticles({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  fetchArticles({ page: 1 })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  fetchArticles({ page: 1 })
}

const openDeleteModal = (article: EducationArticle) => {
  articleToDelete.value = article
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!articleToDelete.value) return
  
  deleting.value = true
  try {
    const response = await educationService.deleteArticle(articleToDelete.value.id)
    if (response.success) {
      toast.success('Artikel berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchArticles({ page: 1 })
    } else {
      toast.error(response.message || 'Gagal menghapus artikel')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus artikel')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchArticles()
})
</script>
