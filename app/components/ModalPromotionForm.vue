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
              {{ promotion?.id ? 'Edit Promosi Layanan' : 'Tambah Promosi Baru' }}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">Kelola promosi layanan dan poster banner</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Judul Promosi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Judul Promosi <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="Masukkan judul promosi..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.title }"
              :disabled="loading"
            />
            <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Deskripsi <span class="text-red-500">*</span></span>
            </label>
            <textarea 
              v-model="form.description" 
              placeholder="Masukkan deskripsi promosi..." 
              rows="3"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.description }"
              :disabled="loading"
            ></textarea>
            <p v-if="errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
          </div>

          <!-- Layanan Terkait -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Layanan Terkait <span class="text-red-500">*</span></span>
            </label>
            <select 
              v-model="form.serviceCode" 
              class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium"
              :class="{ 'border-red-500': errors.serviceCode }"
              :disabled="loading"
            >
              <option value="" disabled>Pilih Layanan</option>
              <option v-for="srv in services" :key="srv.code" :value="srv.code">
                {{ srv.name }} ({{ srv.code }})
              </option>
            </select>
            <p v-if="errors.serviceCode" class="text-xs text-red-500 mt-1">{{ errors.serviceCode }}</p>
          </div>

          <!-- URL Target -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">URL Target <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.url" 
              type="text" 
              placeholder="https://example.com" 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.url }"
              :disabled="loading"
            />
            <p v-if="errors.url" class="text-xs text-red-500 mt-1">{{ errors.url }}</p>
          </div>

          <!-- Tanggal Mulai -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Tanggal Mulai <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.startPeriod" 
              type="date" 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.startPeriod }"
              :disabled="loading"
            />
            <p v-if="errors.startPeriod" class="text-xs text-red-500 mt-1">{{ errors.startPeriod }}</p>
          </div>

          <!-- Tanggal Selesai -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Tanggal Selesai <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.endPeriod" 
              type="date" 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.endPeriod }"
              :disabled="loading"
            />
            <p v-if="errors.endPeriod" class="text-xs text-red-500 mt-1">{{ errors.endPeriod }}</p>
          </div>

          <!-- Status Aktif -->
          <div class="flex items-center gap-2 py-2">
            <input 
              v-model="form.isActive" 
              type="checkbox" 
              class="checkbox checkbox-primary checkbox-sm rounded" 
              id="isActiveTogglePromo"
              :disabled="loading"
            />
            <label for="isActiveTogglePromo" class="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Aktif (Dapat dilihat oleh user)
            </label>
          </div>

          <!-- Poster Banner Image -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">
                Poster Banner <span v-if="!promotion?.id" class="text-red-500">*</span>
              </span>
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
                <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ubah Poster Banner</span>
              </template>
              <template v-else-if="promotion?.image">
                <img :src="promotion.image" class="max-h-40 rounded-lg object-contain w-full" />
                <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ganti Poster Banner</span>
              </template>
              <template v-else>
                <Upload class="w-8 h-8 text-neutral-400 mb-2 group-hover:text-primary transition-colors" />
                <span class="text-xs font-semibold text-neutral-600">Pilih / Drag & Drop Gambar Poster</span>
                <span class="text-xs text-neutral-400 mt-0.5">Format JPG/PNG/WebP, maks. 2MB</span>
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
import type { Promotion } from '~/types/service'
import type { AdditionalItem } from '~/types/additional'

const props = defineProps<{
  promotion?: Promotion | null
  services: AdditionalItem[]
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const form = ref({
  title: '',
  description: '',
  url: '',
  serviceCode: '',
  startPeriod: '',
  endPeriod: '',
  isActive: true
})

const imageFile = ref<File | null>(null)
const previewUrl = ref('')
const errors = ref<Record<string, string>>({})

const promotionSchema = z.object({
  title: z.string().trim().min(1, 'Judul promosi tidak boleh kosong'),
  description: z.string().trim().min(1, 'Deskripsi tidak boleh kosong'),
  url: z.string().trim().url('Format URL tidak valid (harus diawali http:// atau https://)'),
  serviceCode: z.string().min(1, 'Layanan terkait wajib dipilih'),
  startPeriod: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endPeriod: z.string().min(1, 'Tanggal selesai wajib diisi'),
  isActive: z.boolean()
})

const toast = useToast()

watch(isOpen, (val) => {
  errors.value = {}
  imageFile.value = null
  previewUrl.value = ''
  
  if (val) {
    if (props.promotion) {
      form.value = {
        title: props.promotion.title || '',
        description: props.promotion.description || '',
        url: props.promotion.url || '',
        serviceCode: props.promotion.service?.code || '',
        startPeriod: props.promotion.startPeriod ? props.promotion.startPeriod.split('T')[0] : '',
        endPeriod: props.promotion.endPeriod ? props.promotion.endPeriod.split('T')[0] : '',
        isActive: props.promotion.isActive ?? true
      }
    } else {
      form.value = {
        title: '',
        description: '',
        url: '',
        serviceCode: '',
        startPeriod: '',
        endPeriod: '',
        isActive: true
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
    toast.warning('Ukuran file poster maksimal adalah 2MB')
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
  
  const result = promotionSchema.safeParse(form.value)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  // Validate startPeriod vs endPeriod
  if (new Date(form.value.startPeriod) > new Date(form.value.endPeriod)) {
    errors.value.endPeriod = 'Tanggal selesai tidak boleh sebelum tanggal mulai'
    return
  }

  // Validate image is uploaded for new promotion
  if (!props.promotion?.id && !imageFile.value) {
    errors.value.image = 'Poster banner wajib diunggah untuk promosi baru'
    return
  }

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('url', form.value.url)
  formData.append('serviceCode', form.value.serviceCode)
  formData.append('startPeriod', form.value.startPeriod)
  formData.append('endPeriod', form.value.endPeriod)
  formData.append('isActive', form.value.isActive ? '1' : '0')
  
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  emit('submit', formData)
}
</script>
