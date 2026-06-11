<template>
  <div class="flex flex-col w-full pb-12">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BookOpen class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Tambah Video Baru</h1>
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / 
              <NuxtLink to="/education/admin/video" class="text-primary hover:underline">Edukasi</NuxtLink> / 
              Tambah
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full ">
      <!-- Left Column (Title, URL, Description) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card bg-white border border-base-200 shadow-xs p-6 rounded-xl space-y-4">
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Judul Video</span>
            </label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="Masukkan judul video..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.title }"
              :disabled="submitting"
            />
            <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
          </div>

          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">URL Video</span>
            </label>
            <input 
              v-model="form.url" 
              type="url" 
              placeholder="Contoh: https://www.youtube.com/watch?v=..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-mono"
              :class="{ 'border-red-500': errors.url }"
              :disabled="submitting"
            />
            <span class="text-[11px] text-neutral-400 mt-1 block">Masukkan URL video yang valid (YouTube, Vimeo, dll)</span>
            <p v-if="errors.url" class="text-xs text-red-500 mt-1">{{ errors.url }}</p>
          </div>

          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Deskripsi</span>
            </label>
            <textarea 
              v-model="form.description" 
              rows="6"
              placeholder="Masukkan deskripsi singkat tentang isi video..." 
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white py-2"
              :disabled="submitting"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Right Column (Metadata & Thumbnail Image) -->
      <div class="space-y-6">
        <!-- Publish settings card -->
        <div class="card bg-white border border-base-200 shadow-xs p-6 rounded-xl space-y-5">
          <h3 class="font-bold text-neutral-800 text-sm border-b border-base-100 pb-3">Informasi Tambahan</h3>
          
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Kategori</span>
            </label>
            <select 
              v-model="form.categoryId" 
              class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium"
              :class="{ 'border-red-500': errors.categoryId }"
              :disabled="submitting"
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
              <span class="label-text text-sm font-medium text-gray-700">Thumbnail Video</span>
            </label>
            
            <div class="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-4 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*" 
                class="absolute inset-0 opacity-0 cursor-pointer z-10" 
                @change="handleFileChange" 
                :disabled="submitting"
              />
              <template v-if="previewUrl">
                <img :src="previewUrl" class="max-h-48 rounded-lg object-cover w-full" />
                <span class="text-xs text-neutral-500 mt-2 font-medium group-hover:text-primary transition-colors">Ubah Gambar</span>
              </template>
              <template v-else>
                <Upload class="w-8 h-8 text-neutral-400 mb-2 group-hover:text-primary transition-colors" />
                <span class="text-xs font-semibold text-neutral-600">Pilih Thumbnail</span>
                <span class="text-[10px] text-neutral-400 mt-0.5">Format JPG/PNG, maks. 2MB</span>
              </template>
            </div>
          </div>
          <div class="flex flex-row gap-4">
            <NuxtLink 
              to="/education/admin/video" 
              class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg btn-sm h-10 px-6 text-sm font-medium flex-1 flex items-center justify-center"
              :class="{ 'pointer-events-none opacity-50': submitting }"
            >
              Batalkan
            </NuxtLink>
            <button 
              type="submit" 
              class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-6 flex-1 flex items-center justify-center"
              :disabled="submitting"
            >
              <span v-if="submitting" class="loading loading-spinner loading-xs mr-1"></span>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Upload } from 'lucide-vue-next'
import { z } from 'zod'
import { educationService } from '~/services/education-service'
import type { EducationCategory } from '~/types/education'

definePageMeta({
  role: 'admin',
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Tambah Video',
})

const categories = ref<EducationCategory[]>([])
const submitting = ref(false)

const form = ref({
  title: '',
  url: '',
  description: '',
  categoryId: '' as string | number
})

const errors = ref<Record<string, string>>({})
const thumbnailFile = ref<File | null>(null)
const previewUrl = ref('')

const toast = useToast()

const videoSchema = z.object({
  title: z.string().trim().min(1, 'Judul video tidak boleh kosong'),
  url: z.string().trim().min(1, 'URL video tidak boleh kosong').url('Format URL video tidak valid'),
  categoryId: z.union([z.number(), z.string()]).refine(val => !!val, { message: 'Kategori video wajib dipilih' }),
  description: z.string().optional(),
})

const fetchCategories = async () => {
  try {
    const res = await educationService.getCategories()
    if (res.success) {
      categories.value = res.data
    }
  } catch (error) {
    toast.error('Gagal memuat kategori')
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Ukuran file maksimal adalah 2MB')
      return
    }
    thumbnailFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  errors.value = {}
  
  const result = videoSchema.safeParse({
    title: form.value.title,
    url: form.value.url,
    categoryId: form.value.categoryId,
    description: form.value.description,
  })

  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('url', form.value.url)
    formData.append('categoryId', String(form.value.categoryId))
    formData.append('description', form.value.description || '')
    
    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value)
    }

    const res = await educationService.createVideo(formData)
    if (res.success) {
      toast.success('Video berhasil ditambahkan')
      navigateTo('/education/admin/video')
    } else {
      toast.error(res.message || 'Gagal menambahkan video')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan video')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
