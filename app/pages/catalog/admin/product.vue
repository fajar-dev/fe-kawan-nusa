<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Package class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Manajemen Produk & Voucher</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Katalog / Produk
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
        :is-empty="!loading && catalogs.length === 0"
        :total-from="totalFrom"
        :total-to="totalTo"
        :total-entries="totalEntries"
        :current-page="page"
        :last-page="lastPage"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari nama atau deskripsi..."
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
                <span @click="filterCategoryIds = []" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <MultiSelect 
                v-model="filterCategoryIds" 
                :options="categories" 
                labelKey="name"
                valueKey="id"
                placeholder="Semua Kategori" 
                searchable
              />
            </div>
            <!-- Type Filter -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-neutral-400 text-xs font-medium">Tipe</span>
                <span @click="filterType = ''" class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
              </div>
              <select v-model="filterType" class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium">
                <option value="">Semua Tipe</option>
                <option value="product">Product</option>
                <option value="voucher">Voucher</option>
              </select>
            </div>
          </DataFilter>
          <button 
            @click="openCreateModal" 
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Tambah Item Baru
          </button>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in catalogs" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Image Column -->
              <td v-show="isColumnVisible('image')" class="border-r border-base-200 w-24 text-center">
                <div class="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 mx-auto border border-base-200 flex items-center justify-center">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  <Package v-else class="w-5 h-5 text-neutral-300" />
                </div>
              </td>
              <!-- Name Column -->
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 font-medium text-neutral-800 max-w-xs truncate" :title="item.name">
                {{ item.name }}
              </td>
              <!-- Category Column -->
              <td v-show="isColumnVisible('category')" class="border-r border-base-200">
                <span class="badge bg-primary/10 border-none text-primary font-medium text-xs rounded-md">
                  {{ item.category?.name || '-' }}
                </span>
              </td>
              <!-- Type Column -->
              <td v-show="isColumnVisible('type')" class="border-r border-base-200 text-center w-28">
                <span 
                  class="badge border font-medium text-[10px] rounded-md uppercase tracking-wider"
                  :class="item.type === 'voucher' ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-blue-50 text-blue-600 border-blue-200/50'"
                >
                  {{ item.type }}
                </span>
              </td>
              <!-- Points Cost Column -->
              <td v-show="isColumnVisible('point')" class="border-r border-base-200 font-semibold text-purple-600 whitespace-nowrap">
                {{ (item.point || 0).toLocaleString('id-ID') }} Poin
              </td>
              <!-- Expired Date Column -->
              <td v-show="isColumnVisible('expiredDate')" class="border-r border-base-200 text-neutral-500 whitespace-nowrap text-center">
                {{ item.expiredDate ? item.expiredDate : '-' }}
              </td>
              <!-- Action Column -->
              <td v-show="isColumnVisible('actions')" class="text-center px-4 w-32">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(item)" class="btn btn-ghost btn-xs text-primary hover:bg-primary/10 rounded" title="Edit">
                    <Edit2 class="w-4 h-4" />
                  </button>
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
    <ModalCatalogForm
      v-model="isOpenFormModal"
      :catalog="selectedCatalog"
      :categories="categories"
      :loading="submitting"
      @submit="handleFormSubmit"
    />

    <ModalConfirmDelete
      v-model="isOpenDeleteModal"
      title="Hapus Item Katalog"
      :message="`Apakah Anda yakin ingin menghapus '${catalogToDelete?.name}' dari katalog? Tindakan ini tidak dapat dibatalkan.`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { Package, CircleHelp, Plus, Edit2, Trash2, Search, Coins } from 'lucide-vue-next'
import { catalogService } from '~/services/catalog-service'
import type { CatalogItem, CatalogCategory, CatalogMeta } from '~/types/catalog'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Manajemen Katalog',
})

const columns = [
  { label: 'Gambar', key: 'image', sortable: false },
  { label: 'Nama Item', key: 'name', sortable: true },
  { label: 'Kategori', key: 'category', sortable: true },
  { label: 'Tipe', key: 'type', sortable: true },
  { label: 'Biaya Poin', key: 'point', sortable: true },
  { label: 'Expired Date', key: 'expiredDate', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const catalogs = ref<CatalogItem[]>([])
const categories = ref<CatalogCategory[]>([])
const loading = ref(true)

// Filter & Search states
const searchQuery = ref('')
const filterCategoryIds = ref<number[]>([])
const filterType = ref('')
const isFilterActive = ref(false)
const appliedFilters = ref({
  categoryIds: [] as number[],
  type: ''
})

const page = ref(1)
const lastPage = ref(1)
const meta = ref<CatalogMeta | null>(null)

// Derived states for pagination
const totalEntries = computed(() => meta.value?.total ?? 0)
const totalFrom = computed(() => meta.value?.from ?? 0)
const totalTo = computed(() => meta.value?.to ?? 0)

// Modal states
const isOpenFormModal = ref(false)
const selectedCatalog = ref<CatalogItem | null>(null)
const submitting = ref(false)

const isOpenDeleteModal = ref(false)
const catalogToDelete = ref<CatalogItem | null>(null)
const deleting = ref(false)

const currentSort = ref('name')
const currentOrder = ref<'asc' | 'desc'>('asc')

const toast = useToast()

const fetchCategories = async () => {
  try {
    const res = await catalogService.getCategories()
    if (res.success) {
      categories.value = res.data
    }
  } catch (error) {
    // Silently ignore or fallback
  }
}

const fetchCatalogs = async () => {
  loading.value = true
  try {
    const res = await catalogService.getCatalogs({
      page: page.value,
      limit: 10,
      categoryId: appliedFilters.value.categoryIds.length > 0 ? appliedFilters.value.categoryIds : undefined,
      type: appliedFilters.value.type || undefined,
      q: searchQuery.value || undefined,
      sort: currentSort.value,
      order: currentOrder.value
    })
    
    if (res.success && res.data) {
      catalogs.value = res.data
      meta.value = res.meta
      lastPage.value = res.meta.lastPage
    } else {
      catalogs.value = []
      meta.value = null
      lastPage.value = 1
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar catalog')
    catalogs.value = []
    meta.value = null
    lastPage.value = 1
  } finally {
    loading.value = false
  }
}

// Watchers for filtering and searching
let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchCatalogs()
  }, 500)
})

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchCatalogs()
}

const handleSort = (key: string) => {
  currentSort.value = key
  page.value = 1
  fetchCatalogs()
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  page.value = 1
  fetchCatalogs()
}

// DataFilter triggers
const applyFilters = () => {
  appliedFilters.value = {
    categoryIds: [...filterCategoryIds.value],
    type: filterType.value
  }
  isFilterActive.value = appliedFilters.value.categoryIds.length > 0 || appliedFilters.value.type !== ''
  page.value = 1
  fetchCatalogs()
}

const cancelFilters = () => {
  filterCategoryIds.value = [...appliedFilters.value.categoryIds]
  filterType.value = appliedFilters.value.type
}

const resetFilters = () => {
  filterCategoryIds.value = []
  filterType.value = ''
  applyFilters()
}

// Dialog open helpers
const openCreateModal = () => {
  selectedCatalog.value = null
  isOpenFormModal.value = true
}

const openEditModal = (item: CatalogItem) => {
  selectedCatalog.value = item
  isOpenFormModal.value = true
}

const handleFormSubmit = async (formDataFields: any) => {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('name', formDataFields.name)
    formData.append('categoryId', String(formDataFields.categoryId))
    formData.append('type', formDataFields.type)
    formData.append('point', String(formDataFields.point))
    
    if (formDataFields.description) {
      formData.append('description', formDataFields.description)
    }
    
    if (formDataFields.expiredDate) {
      formData.append('expiredDate', formDataFields.expiredDate)
    }
    
    if (formDataFields.image) {
      formData.append('image', formDataFields.image)
    }

    let response
    const id = selectedCatalog.value?.id
    if (id) {
      response = await catalogService.updateCatalog(id, formData)
      if (response.success) {
        toast.success('Item katalog berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui item katalog')
      }
    } else {
      response = await catalogService.createCatalog(formData)
      if (response.success) {
        toast.success('Item katalog berhasil ditambahkan')
      } else {
        toast.error(response.message || 'Gagal menambahkan item katalog')
      }
    }
    isOpenFormModal.value = false
    fetchCatalogs()
  } catch (error) {
    toast.error('Terjadi kesalahan saat memproses data')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (item: CatalogItem) => {
  catalogToDelete.value = item
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!catalogToDelete.value) return
  deleting.value = true
  try {
    const res = await catalogService.deleteCatalog(catalogToDelete.value.id)
    if (res.success) {
      toast.success('Item katalog berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchCatalogs()
    } else {
      toast.error(res.message || 'Gagal menghapus item katalog')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus item katalog')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchCatalogs()
})
</script>
