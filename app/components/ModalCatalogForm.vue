<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">
              {{ catalog?.id ? 'Edit Item Katalog' : 'Tambah Item Katalog Baru' }}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">Kelola item produk atau voucher</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Nama Item -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Item <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Masukkan nama item..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.name }"
              :disabled="loading"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          </div>

          <!-- Kategori & Tipe -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Kategori <span class="text-red-500">*</span></span>
              </label>
              <select 
                v-model="form.categoryId" 
                class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium"
                :class="{ 'border-red-500': errors.categoryId }"
                :disabled="loading"
              >
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <p v-if="errors.categoryId" class="text-xs text-red-500 mt-1">{{ errors.categoryId }}</p>
            </div>

            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Tipe <span class="text-red-500">*</span></span>
              </label>
              <div class="flex items-center gap-4 mt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.type" 
                    value="product" 
                    class="radio radio-primary radio-sm"
                    :disabled="loading"
                  />
                  <span class="text-sm text-neutral-600">Product</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.type" 
                    value="voucher" 
                    class="radio radio-primary radio-sm"
                    :disabled="loading"
                  />
                  <span class="text-sm text-neutral-600">Voucher</span>
                </label>
              </div>
              <p v-if="errors.type" class="text-xs text-red-500 mt-1">{{ errors.type }}</p>
            </div>
          </div>

          <!-- Poin & Tanggal Kedaluwarsa -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Poin <span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model.number="form.point" 
                type="number" 
                min="0"
                placeholder="0" 
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
                :class="{ 'border-red-500': errors.point }"
                :disabled="loading"
              />
              <p v-if="errors.point" class="text-xs text-red-500 mt-1">{{ errors.point }}</p>
            </div>

            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Tanggal Kedaluwarsa</span>
              </label>
              <input 
                v-model="form.expiredDate" 
                type="date" 
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
                :class="{ 'border-red-500': errors.expiredDate }"
                :disabled="loading"
              />
              <p v-if="errors.expiredDate" class="text-xs text-red-500 mt-1">{{ errors.expiredDate }}</p>
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Deskripsi</span>
            </label>
            <textarea 
              v-model="form.description" 
              placeholder="Masukkan deskripsi item..." 
              rows="3"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.description }"
              :disabled="loading"
            ></textarea>
            <p v-if="errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
          </div>

          <!-- Gambar -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Gambar Item</span>
            </label>
            
            <div 
              class="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-4 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer relative group min-h-[140px]"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <input 
                type="file" 
                accept="image/*" 
                class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                @change="handleFileChange" 
                :disabled="loading"
              />
              <template v-if="previewUrl">
                <img :src="previewUrl" class="max-h-40 rounded-lg object-contain w-full" />
                <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ubah Gambar</span>
              </template>
              <template v-else>
                <Upload class="w-8 h-8 text-neutral-400 mb-2 group-hover:text-primary transition-colors" />
                <span class="text-xs font-semibold text-neutral-600">Pilih / Drag & Drop Gambar</span>
                <span class="text-[10px] text-neutral-400 mt-0.5">Format JPG/PNG, maks. 2MB</span>
              </template>
            </div>
            <p v-if="errors.image" class="text-xs text-red-500 mt-1">{{ errors.image }}</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6 shrink-0">
            <button 
              type="button"
              @click="isOpen = false"
              :disabled="loading"
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6"
            >
              Batal
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="btn btn-primary rounded-lg px-6 min-w-[120px]"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Upload } from 'lucide-vue-next'
import { z } from 'zod'
import type { CatalogItem, CatalogCategory } from '~/types/catalog'

const props = defineProps<{
  catalog?: CatalogItem | null
  categories: CatalogCategory[]
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const form = ref({
  name: '',
  categoryId: '' as string | number,
  type: 'product' as 'product' | 'voucher',
  point: 0,
  description: '',
  expiredDate: ''
})

const imageFile = ref<File | null>(null)
const previewUrl = ref('')
const errors = ref<Record<string, string>>({})

const catalogSchema = z.object({
  name: z.string().trim().min(1, 'Nama item tidak boleh kosong'),
  categoryId: z.union([z.number(), z.string()]).refine(val => !!val, { message: 'Kategori wajib dipilih' }),
  type: z.enum(['product', 'voucher']),
  point: z.number({ invalid_type_error: 'Poin harus berupa angka' }).min(0, 'Poin minimal adalah 0'),
  description: z.string().optional(),
  expiredDate: z.string().optional()
})

const toast = useToast()

watch(isOpen, (val) => {
  errors.value = {}
  imageFile.value = null
  previewUrl.value = ''
  
  if (val) {
    if (props.catalog) {
      form.value = {
        name: props.catalog.name || '',
        categoryId: props.catalog.categoryId || '',
        type: (props.catalog.type as 'product' | 'voucher') || 'product',
        point: props.catalog.point || 0,
        description: props.catalog.description || '',
        expiredDate: props.catalog.expiredDate || ''
      }
      previewUrl.value = props.catalog.image || ''
    } else {
      form.value = {
        name: '',
        categoryId: '',
        type: 'product',
        point: 0,
        description: '',
        expiredDate: ''
      }
    }
    
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const handleFile = (file: File) => {
  if (file.size > 2 * 1024 * 1024) {
    toast.warning('Ukuran file maksimal adalah 2MB')
    return
  }
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleSubmit = () => {
  errors.value = {}
  
  const result = catalogSchema.safeParse(form.value)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  // Submit back with file
  emit('submit', {
    ...form.value,
    image: imageFile.value
  })
}
</script>
