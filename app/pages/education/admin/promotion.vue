<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Promosi Layanan</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Edukasi / Promosi
            </p>
          </div>
        </div>
      </div>
        <template #right>
          <button 
            v-if="canCreate('education')"
            @click="openCreateModal" 
            class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
          >
            Tambah Promosi
          </button>
        </template>
    </AppToolbar>

    <div class="flex flex-col gap-4 w-full">
      <DataTable 
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && promotions.length === 0"
        :total-from="meta?.from || 0"
        :total-to="meta?.to || 0"
        :total-entries="meta?.total || 0"
        :current-page="meta?.currentPage || 1"
        :last-page="meta?.lastPage || 1"
        :current-sort="currentSort"
        :current-order="currentOrder"
        v-model:search-query="searchQuery"
        search-placeholder="Cari judul promosi..."
        @update:page="handlePageChange"
        @update:sort="handleSort"
        @update:order="handleOrderChange"
      >

        <!-- Body Slot -->
        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in promotions" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <!-- Banner Column -->
              <td v-show="isColumnVisible('image')" class="border-r border-base-200 w-24 text-center">
                <div class="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 mx-auto border border-base-200 flex items-center justify-center">
                  <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-300">
                    <BookOpen class="w-4.5 h-4.5" />
                  </div>
                </div>
              </td>
              <!-- Title Column -->
              <td v-show="isColumnVisible('title')" class="border-r border-base-200 max-w-xs md:max-w-sm">
                <span class="font-medium text-neutral-800 block truncate" :title="item.title">{{ item.title }}</span>
                <span class="text-xs text-neutral-400 font-medium block truncate max-w-md mt-0.5" :title="item.description">{{ item.description }}</span>
              </td>
              <!-- Service Column -->
              <td v-show="isColumnVisible('service')" class="border-r border-base-200 w-44">
                <span v-if="item.service" class="badge bg-primary/10 border-none text-primary font-medium text-xs rounded-md" :title="item.service.code">
                  {{ item.service.name }}
                </span>
                <span v-else class="text-neutral-400">-</span>
              </td>
              <!-- Period Column -->
              <td v-show="isColumnVisible('period')" class="border-r border-base-200 w-48 whitespace-nowrap">
                <span class="font-medium text-neutral-700">{{ formatDateShort(item.startPeriod) }} - {{ formatDateShort(item.endPeriod) }}</span>
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
                <div class="flex items-center justify-center gap-0">
                  <button v-if="canEdit('education')" @click="openEditModal(item)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Edit">
                    <SquarePen class="w-4.5 h-4.5" />
                  </button>
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
    <ModalPromotionForm 
      v-model="isOpenFormModal" 
      :promotion="formPromotion" 
      :services="services"
      :loading="submitting" 
      @submit="handleFormSubmit" 
    />
    
    <ModalConfirmDelete 
      v-model="isOpenDeleteModal" 
      title="Hapus Promosi Layanan" 
      :message="`Apakah Anda yakin ingin menghapus promosi '${promotionToDelete?.title}'? Tindakan ini tidak dapat dibatalkan.`" 
      :loading="deleting" 
      @confirm="handleDelete" 
    />
  </div>
</template>

<script setup lang="ts">
import { BookOpen, CircleHelp, Plus, SquarePen, Trash2 } from 'lucide-vue-next'
import { serviceService } from '~/services/service-service'
import { additionalService } from '~/services/additional-service'
import { formatDate, formatDateShort } from '~/utils/date'
import type { Promotion } from '~/types/service'
import type { PaginationMeta } from '~/types/service'
import type { AdditionalItem } from '~/types/additional'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Promosi Layanan',
})

const columns = [
  { label: 'Poster', key: 'image', sortable: false },
  { label: 'Judul Promosi', key: 'title', sortable: true },
  { label: 'Layanan Terkait', key: 'service', sortable: false },
  { label: 'Periode Aktif', key: 'period', sortable: false },
  { label: 'Status', key: 'isActive', sortable: true },
  { label: 'Aksi', key: 'actions', sortable: false },
]

const promotions = ref<Promotion[]>([])
const services = ref<AdditionalItem[]>([])
const loading = ref(true)
const searchQuery = ref('')
const meta = ref<PaginationMeta | null>(null)
const currentSort = ref('id')
const currentOrder = ref<'asc' | 'desc'>('desc')

// Modal state
const isOpenFormModal = ref(false)
const submitting = ref(false)
const formPromotion = ref<Promotion | null>(null)

const isOpenDeleteModal = ref(false)
const promotionToDelete = ref<Promotion | null>(null)
const deleting = ref(false)

const toast = useToast()
const { canCreate, canEdit, canDelete } = usePermission()

const fetchPromotions = async (queryParams: { page?: number } = {}) => {
  loading.value = true
  try {
    const params = {
      q: searchQuery.value || undefined,
      page: queryParams.page || 1,
      limit: 10
    }
    const response = await serviceService.getPromotions(params)
    if (response.success) {
      promotions.value = response.data
      meta.value = response.meta
    }
  } catch (error) {
    toast.error('Gagal mengambil daftar promosi')
  } finally {
    loading.value = false
  }
}

const fetchServices = async () => {
  try {
    const response = await additionalService.getServices()
    if (response.success) {
      services.value = response.data
    }
  } catch (error) {
    // Silently handle service dropdown load error
  }
}

let searchTimeout: any = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchPromotions({ page: 1 })
  }, 500)
})

const handlePageChange = (page: number) => {
  fetchPromotions({ page })
}

const handleSort = (key: string) => {
  currentSort.value = key
  promotions.value = [...promotions.value].sort((a: any, b: any) => {
    const valA = key === 'service' ? a.service?.name : a[key]
    const valB = key === 'service' ? b.service?.name : b[key]
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
  formPromotion.value = null
  isOpenFormModal.value = true
}

const openEditModal = (promotion: Promotion) => {
  formPromotion.value = promotion
  isOpenFormModal.value = true
}

const handleFormSubmit = async (formData: FormData) => {
  submitting.value = true
  try {
    let response
    const id = formPromotion.value?.id
    if (id) {
      response = await serviceService.updatePromotion(id, formData)
      if (response.success) {
        toast.success('Promosi berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui promosi')
      }
    } else {
      response = await serviceService.createPromotion(formData)
      if (response.success) {
        toast.success('Promosi berhasil ditambahkan')
      } else {
        toast.error(response.message || 'Gagal menambahkan promosi')
      }
    }
    isOpenFormModal.value = false
    fetchPromotions({ page: meta.value?.currentPage || 1 })
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan promosi')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (promotion: Promotion) => {
  promotionToDelete.value = promotion
  isOpenDeleteModal.value = true
}

const handleDelete = async () => {
  if (!promotionToDelete.value) return
  
  deleting.value = true
  try {
    const response = await serviceService.deletePromotion(promotionToDelete.value.id)
    if (response.success) {
      toast.success('Promosi berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchPromotions({ page: 1 })
    } else {
      toast.error(response.message || 'Gagal menghapus promosi')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menghapus promosi')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchPromotions()
  fetchServices()
})
</script>
