<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BookOpen class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Template Dokumen</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Edukasi / Template
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
        :is-empty="!loading && templates.length === 0"
        :total-from="meta?.from || 0"
        :total-to="meta?.to || 0"
        :total-entries="meta?.total || 0"
        :current-page="meta?.currentPage || 1"
        :last-page="meta?.lastPage || 1"
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
          <button 
            @click="openCreateModal" 
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Tambah Template
          </button>
        </template>

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in templates" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Thumbnail Column -->
              <td v-show="isColumnVisible('thumbnail')" class="border-r border-base-200 w-24 text-center">
                <div class="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 mx-auto border border-base-200 flex items-center justify-center">
                  <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
                    <FileText class="w-5 h-5" />
                  </div>
                </div>
              </td>
              <!-- Name Column -->
              <td v-show="isColumnVisible('name')" class="border-r border-base-200 max-w-xs md:max-w-sm">
                <span class="font-medium text-neutral-800 block truncate" :title="item.name">{{ item.name }}</span>
                <span class="text-xs text-neutral-400 font-medium block truncate max-w-md mt-0.5" :title="item.description">{{ item.description }}</span>
              </td>
              <!-- Available Files Column -->
              <td v-show="isColumnVisible('files')" class="border-r border-base-200 w-48">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <template v-if="item.png || item.jpg || item.psd || item.mp4">
                    <!-- PNG -->
                    <a 
                      v-if="item.png" 
                      :href="templateService.getDownloadUrl(item.id, 'png')" 
                      target="_blank"
                      download
                      class="badge badge-sm border border-blue-200/50 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded cursor-pointer transition-all p-2 flex items-center gap-1 hover:scale-105 active:scale-95"
                      title="Unduh PNG"
                    >
                      <Download class="w-3 h-3" /> PNG
                    </a>

                    <!-- JPG -->
                    <a 
                      v-if="item.jpg" 
                      :href="templateService.getDownloadUrl(item.id, 'jpg')" 
                      target="_blank"
                      download
                      class="badge badge-sm border border-green-200/50 bg-green-50 text-green-600 hover:bg-green-100 font-bold rounded cursor-pointer transition-all p-2 flex items-center gap-1 hover:scale-105 active:scale-95"
                      title="Unduh JPG"
                    >
                      <Download class="w-3 h-3" /> JPG
                    </a>

                    <!-- PSD -->
                    <a 
                      v-if="item.psd" 
                      :href="templateService.getDownloadUrl(item.id, 'psd')" 
                      target="_blank"
                      download
                      class="badge badge-sm border border-indigo-200/50 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded cursor-pointer transition-all p-2 flex items-center gap-1 hover:scale-105 active:scale-95"
                      title="Unduh PSD"
                    >
                      <Download class="w-3 h-3" /> PSD
                    </a>

                    <!-- MP4 -->
                    <a 
                      v-if="item.mp4" 
                      :href="templateService.getDownloadUrl(item.id, 'mp4')" 
                      target="_blank"
                      download
                      class="badge badge-sm border border-red-200/50 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded cursor-pointer transition-all p-2 flex items-center gap-1 hover:scale-105 active:scale-95"
                      title="Unduh MP4"
                    >
                      <Download class="w-3 h-3" /> MP4
                    </a>
                  </template>
                  <span v-else class="text-neutral-400 font-medium">-</span>
                </div>
              </td>
              <!-- Status Column -->
              <td v-show="isColumnVisible('isActive')" class="border-r border-base-200 text-center w-28">
                <span 
                  class="badge text-xs font-semibold rounded-md border-none px-2.5 py-1"
                  :class="item.isActive ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'"
                >
                  {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </span>
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
    <ModalTemplateForm 
      v-model="isOpenFormModal" 
      :template="formTemplate" 
      :loading="submitting" 
      @submit="handleFormSubmit" 
    />
    
    <ModalConfirmDelete 
      v-model="isOpenDeleteModal" 
      title="Hapus Template" 
      :message="`Apakah Anda yakin ingin menghapus template '${templateToDelete?.name}'? Tindakan ini tidak dapat dibatalkan.`" 
      :loading="deleting" 
      @confirm="handleDelete" 
    />
  </div>
</template>

<script setup lang="ts">
import { BookOpen, CircleHelp, Plus, Edit2, Trash2, FileText, Download } from 'lucide-vue-next'
import { templateService } from '~/services/template-service'
import type { MarketingTemplate } from '~/types/template'
import type { PaginationMeta } from '~/types/service'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Template Pemasaran',
})

const columns = [
  { label: 'Thumbnail', key: 'thumbnail', sortable: false },
  { label: 'Nama Template', key: 'name', sortable: true },
  { label: 'File Aset', key: 'files', sortable: false },
  { label: 'Status', key: 'isActive', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const templates = ref<MarketingTemplate[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('id')
const currentOrder = ref<'asc' | 'desc'>('desc')

// Modal state
const isOpenFormModal = ref(false)
const submitting = ref(false)
const formTemplate = ref<MarketingTemplate | null>(null)

const isOpenDeleteModal = ref(false)
const templateToDelete = ref<MarketingTemplate | null>(null)
const deleting = ref(false)

const toast = useToast()

const fetchTemplates = async (queryParams: { page?: number } = {}) => {
  loading.value = true
  try {
    const params = {
      q: searchQuery.value || undefined,
      page: queryParams.page || 1,
      limit: 10
    }
    const response = await templateService.getTemplates(params)
    if (response.success) {
      templates.value = response.data
      meta.value = response.meta
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar template')
  } finally {
    loading.value = false
  }
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchTemplates({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchTemplates({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  // Standard local sort implementation for UI responsiveness or trigger API call if backend supports sorting.
  // We sort local page contents if needed, or call API. Let's do both to be safe.
  templates.value = [...templates.value].sort((a: any, b: any) => {
    const valA = a[key]
    const valB = b[key]
    const order = currentOrder.value === 'asc' ? 1 : -1
    if (typeof valA === 'string') {
      return valA.localeCompare(valB) * order
    }
    if (typeof valA === 'boolean') {
      return (valA === valB ? 0 : valA ? 1 : -1) * order
    }
    return ((valA || 0) - (valB || 0)) * order
  })
}

const handleOrderChange = (order: 'asc' | 'desc') => {
  currentOrder.value = order
  handleSort(currentSort.value)
}

const openCreateModal = () => {
  formTemplate.value = null
  isOpenFormModal.value = true
}

const openEditModal = (template: MarketingTemplate) => {
  formTemplate.value = template
  isOpenFormModal.value = true
}

const handleFormSubmit = async (formData: FormData) => {
  submitting.value = true
  try {
    let response
    const id = formTemplate.value?.id
    if (id) {
      response = await templateService.updateTemplate(id, formData)
      if (response.success) {
        toast.success('Template berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui template')
      }
    } else {
      response = await templateService.createTemplate(formData)
      if (response.success) {
        toast.success('Template berhasil ditambahkan')
      } else {
        toast.error(response.message || 'Gagal menambahkan template')
      }
    }
    isOpenFormModal.value = false
    fetchTemplates({ page: meta.value?.currentPage || 1 })
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan template')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (template: MarketingTemplate) => {
  templateToDelete.value = template
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!templateToDelete.value) return
  
  deleting.value = true
  try {
    const response = await templateService.deleteTemplate(templateToDelete.value.id)
    if (response.success) {
      toast.success('Template berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchTemplates({ page: 1 })
    } else {
      toast.error(response.message || 'Gagal menghapus template')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus template')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>
