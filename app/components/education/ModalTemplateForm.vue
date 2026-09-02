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
              {{ template?.id ? 'Edit Template Dokumen' : 'Tambah Template Baru' }}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">Kelola data template pemasaran dan aset file unduhan</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Nama Template -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Template <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Masukkan nama template..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.name }"
              :disabled="loading"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Deskripsi <span class="text-red-500">*</span></span>
            </label>
            <textarea 
              v-model="form.description" 
              placeholder="Masukkan deskripsi detail..." 
              rows="3"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.description }"
              :disabled="loading"
            ></textarea>
            <p v-if="errors.description" class="text-xs text-red-500 mt-1">{{ errors.description }}</p>
          </div>

          <!-- Status Aktif -->
          <div class="flex items-center gap-2 py-2">
            <input 
              v-model="form.isActive" 
              type="checkbox" 
              class="checkbox checkbox-primary checkbox-sm rounded" 
              id="isActiveToggle"
              :disabled="loading"
            />
            <label for="isActiveToggle" class="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Aktif (Dapat dilihat oleh user)
            </label>
          </div>

          <!-- File Uploads Section -->
          <div class="border-t border-neutral-100 pt-4">
            <h4 class="text-sm font-semibold text-neutral-800 mb-3">Aset & File Lampiran</h4>
            
            <div class="flex flex-col gap-4">
              <!-- Thumbnail -->
              <div>
                <label class="label pb-1">
                  <span class="label-text text-xs font-semibold text-gray-700">
                    Thumbnail Image <span v-if="!template?.id" class="text-red-500">*</span>
                  </span>
                </label>
                <div 
                  class="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-4 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer relative group min-h-[140px]"
                  @dragover.prevent
                  @drop.prevent="handleThumbnailDrop"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    @change="handleThumbnailChange" 
                    :disabled="loading"
                  />
                  <template v-if="thumbnailPreview">
                    <img :src="thumbnailPreview" class="max-h-40 rounded-lg object-contain w-full" />
                    <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ubah Gambar Thumbnail</span>
                  </template>
                  <template v-else-if="template?.thumbnail">
                    <img :src="template.thumbnail" class="max-h-40 rounded-lg object-contain w-full" />
                    <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ganti Gambar Thumbnail</span>
                  </template>
                  <template v-else>
                    <Upload class="w-8 h-8 text-neutral-400 mb-2 group-hover:text-primary transition-colors" />
                    <span class="text-xs font-semibold text-neutral-600 text-center">Pilih / Drag & Drop Thumbnail</span>
                    <span class="text-xs text-neutral-400 mt-0.5 text-center">Format JPG/PNG/WebP, maks. 2MB</span>
                  </template>
                </div>
                <p v-if="errors.thumbnail" class="text-xs text-red-500 mt-1">{{ errors.thumbnail }}</p>
              </div>

              <!-- PNG File -->
              <div>
                <label class="label pb-0.5">
                  <span class="label-text text-xs font-semibold text-gray-600">Aset PNG</span>
                </label>
                <div class="flex flex-col gap-2">
                  <!-- Case 1: Newly selected PNG file -->
                  <div v-if="assetFiles.png" class="relative flex items-center justify-between border border-emerald-200 rounded-xl p-3 bg-emerald-50/15 text-xs shadow-sm">
                    <div class="flex items-center gap-2.5 truncate">
                      <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-emerald-800 truncate">{{ assetFiles.png.name }}</p>
                        <p class="text-xs text-emerald-600 font-medium">Baru • {{ (assetFiles.png.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeAssetFile('png')" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg z-20 transition-colors">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                  
                  <!-- Case 2: PNG file already exists in server -->
                  <div v-else-if="template?.png" class="relative flex items-center justify-between border border-blue-200 rounded-xl p-3 bg-blue-50/15 text-xs shadow-sm hover:border-primary/50 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/png" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'png')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2.5 truncate">
                      <FileImage class="w-5 h-5 text-blue-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-neutral-800 truncate">Aset PNG Tersedia</p>
                        <p class="text-xs text-blue-500 font-medium">Klik untuk ganti file</p>
                      </div>
                    </div>
                    <span class="badge badge-sm border-none bg-blue-100/70 text-blue-700 font-bold px-2 py-0.5 rounded">Tersedia</span>
                  </div>
                  
                  <!-- Case 3: Empty state -->
                  <div v-else class="relative flex items-center justify-between border border-dashed border-neutral-200 rounded-xl p-3 bg-white hover:bg-neutral-50/50 hover:border-primary/40 transition-all cursor-pointer text-xs">
                    <input 
                      type="file" 
                      accept="image/png" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'png')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2 text-neutral-500">
                      <Upload class="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                      <span class="font-medium">Pilih file PNG...</span>
                    </div>
                    <span class="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">Maks. 5MB</span>
                  </div>
                  <p v-if="errors.png" class="text-[11px] text-red-500">{{ errors.png }}</p>
                </div>
              </div>

              <!-- JPG File -->
              <div>
                <label class="label pb-0.5">
                  <span class="label-text text-xs font-semibold text-gray-600">Aset JPG</span>
                </label>
                <div class="flex flex-col gap-2">
                  <!-- Case 1: Newly selected JPG file -->
                  <div v-if="assetFiles.jpg" class="relative flex items-center justify-between border border-emerald-200 rounded-xl p-3 bg-emerald-50/15 text-xs shadow-sm">
                    <div class="flex items-center gap-2.5 truncate">
                      <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-emerald-800 truncate">{{ assetFiles.jpg.name }}</p>
                        <p class="text-xs text-emerald-600 font-medium">Baru • {{ (assetFiles.jpg.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeAssetFile('jpg')" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg z-20 transition-colors">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                  
                  <!-- Case 2: JPG file already exists in server -->
                  <div v-else-if="template?.jpg" class="relative flex items-center justify-between border border-blue-200 rounded-xl p-3 bg-blue-50/15 text-xs shadow-sm hover:border-primary/50 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'jpg')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2.5 truncate">
                      <FileImage class="w-5 h-5 text-green-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-neutral-800 truncate">Aset JPG Tersedia</p>
                        <p class="text-xs text-blue-500 font-medium">Klik untuk ganti file</p>
                      </div>
                    </div>
                    <span class="badge badge-sm border-none bg-blue-100/70 text-blue-700 font-bold px-2 py-0.5 rounded">Tersedia</span>
                  </div>
                  
                  <!-- Case 3: Empty state -->
                  <div v-else class="relative flex items-center justify-between border border-dashed border-neutral-200 rounded-xl p-3 bg-white hover:bg-neutral-50/50 hover:border-primary/40 transition-all cursor-pointer text-xs">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/jpg" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'jpg')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2 text-neutral-500">
                      <Upload class="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                      <span class="font-medium">Pilih file JPG...</span>
                    </div>
                    <span class="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">Maks. 5MB</span>
                  </div>
                  <p v-if="errors.jpg" class="text-[11px] text-red-500">{{ errors.jpg }}</p>
                </div>
              </div>

              <!-- PSD File -->
              <div>
                <label class="label pb-0.5">
                  <span class="label-text text-xs font-semibold text-gray-600">Aset PSD (Photoshop)</span>
                </label>
                <div class="flex flex-col gap-2">
                  <!-- Case 1: Newly selected PSD file -->
                  <div v-if="assetFiles.psd" class="relative flex items-center justify-between border border-emerald-200 rounded-xl p-3 bg-emerald-50/15 text-xs shadow-sm">
                    <div class="flex items-center gap-2.5 truncate">
                      <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-emerald-800 truncate">{{ assetFiles.psd.name }}</p>
                        <p class="text-xs text-emerald-600 font-medium">Baru • {{ (assetFiles.psd.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeAssetFile('psd')" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg z-20 transition-colors">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                  
                  <!-- Case 2: PSD file already exists in server -->
                  <div v-else-if="template?.psd" class="relative flex items-center justify-between border border-blue-200 rounded-xl p-3 bg-blue-50/15 text-xs shadow-sm hover:border-primary/50 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept=".psd,image/vnd.adobe.photoshop" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'psd')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2.5 truncate">
                      <FileBox class="w-5 h-5 text-indigo-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-neutral-800 truncate">Aset PSD Tersedia</p>
                        <p class="text-xs text-blue-500 font-medium">Klik untuk ganti file</p>
                      </div>
                    </div>
                    <span class="badge badge-sm border-none bg-blue-100/70 text-blue-700 font-bold px-2 py-0.5 rounded">Tersedia</span>
                  </div>
                  
                  <!-- Case 3: Empty state -->
                  <div v-else class="relative flex items-center justify-between border border-dashed border-neutral-200 rounded-xl p-3 bg-white hover:bg-neutral-50/50 hover:border-primary/40 transition-all cursor-pointer text-xs">
                    <input 
                      type="file" 
                      accept=".psd,image/vnd.adobe.photoshop" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'psd')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2 text-neutral-500">
                      <Upload class="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                      <span class="font-medium">Pilih file PSD...</span>
                    </div>
                    <span class="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">Maks. 50MB</span>
                  </div>
                  <p v-if="errors.psd" class="text-[11px] text-red-500">{{ errors.psd }}</p>
                </div>
              </div>

              <!-- MP4 File -->
              <div>
                <label class="label pb-0.5">
                  <span class="label-text text-xs font-semibold text-gray-600">Aset Video MP4</span>
                </label>
                <div class="flex flex-col gap-2">
                  <!-- Case 1: Newly selected MP4 file -->
                  <div v-if="assetFiles.mp4" class="relative flex items-center justify-between border border-emerald-200 rounded-xl p-3 bg-emerald-50/15 text-xs shadow-sm">
                    <div class="flex items-center gap-2.5 truncate">
                      <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-emerald-800 truncate">{{ assetFiles.mp4.name }}</p>
                        <p class="text-xs text-emerald-600 font-medium">Baru • {{ (assetFiles.mp4.size / 1024 / 1024).toFixed(2) }} MB</p>
                      </div>
                    </div>
                    <button type="button" @click.stop="removeAssetFile('mp4')" class="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg z-20 transition-colors">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                  
                  <!-- Case 2: MP4 file already exists in server -->
                  <div v-else-if="template?.mp4" class="relative flex items-center justify-between border border-blue-200 rounded-xl p-3 bg-blue-50/15 text-xs shadow-sm hover:border-primary/50 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/mp4" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'mp4')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2.5 truncate">
                      <FileVideo class="w-5 h-5 text-red-500 shrink-0" />
                      <div class="truncate">
                        <p class="font-semibold text-neutral-800 truncate">Aset Video MP4 Tersedia</p>
                        <p class="text-xs text-blue-500 font-medium">Klik untuk ganti file</p>
                      </div>
                    </div>
                    <span class="badge badge-sm border-none bg-blue-100/70 text-blue-700 font-bold px-2 py-0.5 rounded">Tersedia</span>
                  </div>
                  
                  <!-- Case 3: Empty state -->
                  <div v-else class="relative flex items-center justify-between border border-dashed border-neutral-200 rounded-xl p-3 bg-white hover:bg-neutral-50/50 hover:border-primary/40 transition-all cursor-pointer text-xs">
                    <input 
                      type="file" 
                      accept="video/mp4" 
                      class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      @change="(e) => handleAssetFile(e, 'mp4')"
                      :disabled="loading"
                    />
                    <div class="flex items-center gap-2 text-neutral-500">
                      <Upload class="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                      <span class="font-medium">Pilih file MP4...</span>
                    </div>
                    <span class="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">Maks. 50MB</span>
                  </div>
                  <p v-if="errors.mp4" class="text-[11px] text-red-500">{{ errors.mp4 }}</p>
                </div>
              </div>
            </div>
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
import { X, Upload, Trash2, FileImage, FileBox, FileVideo, CheckCircle2 } from 'lucide-vue-next'
import { z } from 'zod'
import type { MarketingTemplate } from '~/types/template'

const props = defineProps<{
  template?: MarketingTemplate | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const form = ref({
  name: '',
  description: '',
  isActive: true
})

const thumbnailFile = ref<File | null>(null)
const thumbnailPreview = ref('')
const assetFiles = ref<Record<'png' | 'jpg' | 'psd' | 'mp4', File | null>>({
  png: null,
  jpg: null,
  psd: null,
  mp4: null
})

const errors = ref<Record<string, string>>({})
const toast = useToast()

const templateSchema = z.object({
  name: z.string().trim().min(1, 'Nama template tidak boleh kosong'),
  description: z.string().trim().min(1, 'Deskripsi tidak boleh kosong'),
  isActive: z.boolean()
})

watch(isOpen, (val) => {
  errors.value = {}
  thumbnailFile.value = null
  thumbnailPreview.value = ''
  assetFiles.value = {
    png: null,
    jpg: null,
    psd: null,
    mp4: null
  }
  
  if (val) {
    if (props.template) {
      form.value = {
        name: props.template.name || '',
        description: props.template.description || '',
        isActive: props.template.isActive ?? true
      }
    } else {
      form.value = {
        name: '',
        description: '',
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

// Thumbnail logic
const handleThumbnail = (file: File) => {
  if (file.size > 2 * 1024 * 1024) {
    toast.warning('Ukuran thumbnail maksimal adalah 2MB')
    return
  }
  thumbnailFile.value = file
  thumbnailPreview.value = URL.createObjectURL(file)
}

const handleThumbnailChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleThumbnail(file)
  }
}

const handleThumbnailDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    handleThumbnail(file)
  }
}

// Asset Files logic
const handleAssetFile = (e: Event, type: 'png' | 'jpg' | 'psd' | 'mp4') => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Size limit validation: 5MB for png/jpg, 50MB for psd/mp4
  const sizeLimit = (type === 'png' || type === 'jpg') ? 5 * 1024 * 1024 : 50 * 1024 * 1024
  if (file.size > sizeLimit) {
    toast.warning(`Ukuran file ${type.toUpperCase()} maksimal adalah ${type === 'png' || type === 'jpg' ? '5MB' : '50MB'}`)
    return
  }

  assetFiles.value[type] = file
}

const removeAssetFile = (type: 'png' | 'jpg' | 'psd' | 'mp4') => {
  assetFiles.value[type] = null
}

const handleSubmit = () => {
  errors.value = {}
  
  const result = templateSchema.safeParse(form.value)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  // Validate thumbnail is uploaded for new template
  if (!props.template?.id && !thumbnailFile.value) {
    errors.value.thumbnail = 'Thumbnail wajib diunggah untuk template baru'
    return
  }

  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('description', form.value.description)
  // Backend expects string/boolean representation
  formData.append('isActive', form.value.isActive ? '1' : '0')
  
  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }
  
  if (assetFiles.value.png) {
    formData.append('png', assetFiles.value.png)
  }
  if (assetFiles.value.jpg) {
    formData.append('jpg', assetFiles.value.jpg)
  }
  if (assetFiles.value.psd) {
    formData.append('psd', assetFiles.value.psd)
  }
  if (assetFiles.value.mp4) {
    formData.append('mp4', assetFiles.value.mp4)
  }

  emit('submit', formData)
}
</script>
