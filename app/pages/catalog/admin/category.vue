<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Package class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Kategori Katalog</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Katalog / Kategori
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
        :is-empty="!loading && filteredCategories.length === 0"
        :total-from="filteredCategories.length > 0 ? 1 : 0"
        :total-to="filteredCategories.length"
        :total-entries="filteredCategories.length"
        :current-page="1"
        :last-page="1"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari kategori..."
        @update:sort="handleSort"
        @update:order="handleOrderChange"
      >
        <!-- Filters Slot -->
        <template #filters>
          <button 
            @click="openCreateModal" 
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Tambah Kategori
          </button>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in sortedCategories" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('id')" class="border-r border-base-200 text-center w-24 font-mono">{{ item.id }}</td>
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 font-medium text-neutral-800">{{ item.name }}</td>
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
    <ModalCatalogCategoryForm 
      v-model="isOpenFormModal" 
      :category="formCategory" 
      :loading="submitting" 
      @submit="handleFormSubmit" 
    />
    
    <ModalConfirmDelete 
      v-model="isOpenDeleteModal" 
      title="Hapus Kategori Katalog" 
      :message="`Apakah Anda yakin ingin menghapus kategori '${categoryToDelete?.name}'? Semua item katalog yang berada dalam kategori ini mungkin akan terpengaruh.`" 
      :loading="deleting" 
      @confirm="handleDelete" 
    />
  </div>
</template>

<script setup lang="ts">
import { Package, CircleHelp, Plus, Edit2, Trash2 } from 'lucide-vue-next'
import { catalogService } from '~/services/catalog-service'
import type { CatalogCategory } from '~/types/catalog'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Kategori Katalog',
})

const columns = [
  { label: 'ID', key: 'id', sortable: true },
  { label: 'Nama Kategori', key: 'name', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const categories = ref<CatalogCategory[]>([])
const loading = ref(true)
const searchQuery = ref('')

// Modal states
const isOpenFormModal = ref(false)
const submitting = ref(false)
const formCategory = ref<{ id: number | null, name: string } | null>(null)

const isOpenDeleteModal = ref(false)
const categoryToDelete = ref<CatalogCategory | null>(null)
const deleting = ref(false)

const toast = useToast()

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await catalogService.getCategories()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar kategori')
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(cat => cat.name.toLowerCase().includes(query))
})

const currentSort = ref('id')
const currentOrder = ref<'asc' | 'desc'>('asc')

const handleSort = (key: string) => {
  currentSort.value = key
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
}

const sortedCategories = computed(() => {
  const list = [...filteredCategories.value]
  const key = currentSort.value
  const order = currentOrder.value === 'asc' ? 1 : -1
  
  return list.sort((a: any, b: any) => {
    const valA = a[key]
    const valB = b[key]
    
    if (typeof valA === 'string') {
      return valA.localeCompare(valB) * order
    }
    return ((valA as number) - (valB as number)) * order
  })
})

const openCreateModal = () => {
  formCategory.value = {
    id: null,
    name: ''
  }
  isOpenFormModal.value = true
}

const openEditModal = (category: CatalogCategory) => {
  formCategory.value = {
    id: category.id,
    name: category.name
  }
  isOpenFormModal.value = true
}

const handleFormSubmit = async (name: string) => {
  submitting.value = true
  try {
    let response
    const id = formCategory.value?.id
    if (id) {
      response = await catalogService.updateCategory(id, name)
      if (response.success) {
        toast.success('Kategori berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui kategori')
      }
    } else {
      response = await catalogService.createCategory(name)
      if (response.success) {
        toast.success('Kategori berhasil ditambahkan')
      } else {
        toast.error(response.message || 'Gagal menambahkan kategori')
      }
    }
    isOpenFormModal.value = false
    fetchCategories()
  } catch (error) {
    toast.error('Terjadi kesalahan saat memproses data')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (category: CatalogCategory) => {
  categoryToDelete.value = category
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return
  
  deleting.value = true
  try {
    const response = await catalogService.deleteCategory(categoryToDelete.value.id)
    if (response.success) {
      toast.success('Kategori berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchCategories()
    } else {
      toast.error(response.message || 'Gagal menghapus kategori')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus kategori')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
