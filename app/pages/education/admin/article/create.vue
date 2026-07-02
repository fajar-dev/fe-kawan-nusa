<template>
  <div class="flex flex-col w-full pb-12">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Tambah Artikel Baru</h1>
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / 
              <NuxtLink to="/education/admin/article" class="text-primary hover:underline">Konten Edukasi</NuxtLink> / 
              Tambah
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full ">
      <!-- Left Column (Title & Content) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card bg-white border border-base-200 shadow-xs p-6 rounded-xl space-y-4">
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Judul Artikel</span>
            </label>
            <input 
              v-model="form.title" 
              type="text" 
              placeholder="Masukkan judul artikel yang menarik..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.title }"
              :disabled="submitting"
            />
            <p v-if="errors.title" class="text-xs text-red-500 mt-1">{{ errors.title }}</p>
          </div>

          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Konten / Isi Artikel</span>
            </label>
            <!-- Quill Editor Container -->
            <div class="border border-base-300 rounded-lg overflow-hidden bg-white animate-in duration-300" :class="{ 'border-red-500': errors.content }">
              <QuillEditor 
                ref="quillEditor"
                v-model:content="form.content" 
                contentType="html" 
                theme="snow" 
                :options="editorOptions"
                placeholder="Tulis artikel Anda di sini..."
              />
            </div>
            <p v-if="errors.content" class="text-xs text-red-500 mt-1">{{ errors.content }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column (Metadata & Cover Image) -->
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
              <span class="label-text text-sm font-medium text-gray-700">Gambar Sampul</span>
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
                <span class="text-xs font-semibold text-neutral-600">Pilih Gambar Sampul</span>
                <span class="text-xs text-neutral-400 mt-0.5">Format JPG/PNG, maks. 2MB</span>
              </template>
            </div>
          </div>
          <div class="flex flex-row gap-4">
            <NuxtLink 
              to="/education/admin/article" 
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { z } from 'zod'
import { educationService } from '~/services/education-service'
import type { EducationCategory } from '~/types/education'

definePageMeta({
  role: 'admin',
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Tambah Artikel',
})

const categories = ref<EducationCategory[]>([])
const submitting = ref(false)

const form = ref({
  title: '',
  content: '',
  categoryId: '' as string | number
})

const errors = ref<Record<string, string>>({})
const coverFile = ref<File | null>(null)
const previewUrl = ref('')

const quillEditor = ref<any>(null)
const toast = useToast()

const articleSchema = z.object({
  title: z.string().trim().min(1, 'Judul artikel tidak boleh kosong'),
  categoryId: z.union([z.number(), z.string()]).refine(val => !!val, { message: 'Kategori artikel wajib dipilih' }),
  content: z.string().trim().min(1, 'Konten artikel tidak boleh kosong').refine(val => val !== '<p><br></p>', { message: 'Konten artikel tidak boleh kosong' }),
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
    coverFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

// Custom Image Upload handler for Quill
const imageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.warning('Ukuran gambar editor maksimal adalah 2MB')
      return
    }

    try {
      const res = await educationService.uploadArticleImage(file)
      if (res.success && res.data?.url) {
        const quill = quillEditor.value?.getQuill()
        if (quill) {
          const range = quill.getSelection()
          const index = range ? range.index : quill.getLength()
          quill.insertEmbed(index, 'image', res.data.url)
          quill.setSelection(index + 1)
        }
      } else {
        toast.error('Gagal mengunggah gambar ke editor')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengunggah gambar')
    }
  }
}

const editorOptions = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }
}

const handleSubmit = async () => {
  errors.value = {}
  
  const result = articleSchema.safeParse({
    title: form.value.title,
    categoryId: form.value.categoryId,
    content: form.value.content,
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
    formData.append('categoryId', String(form.value.categoryId))
    formData.append('content', form.value.content)
    
    if (coverFile.value) {
      formData.append('image', coverFile.value)
    }

    const res = await educationService.createArticle(formData)
    if (res.success) {
      toast.success('Artikel berhasil ditambahkan')
      navigateTo('/education/admin/article')
    } else {
      toast.error(res.message || 'Gagal menambahkan artikel')
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan artikel')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style>
.ql-toolbar.ql-snow {
  border-color: var(--color-base-300, #e5e7eb) !important;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: #f9fafb;
}

.ql-container.ql-snow {
  border-color: var(--color-base-300, #e5e7eb) !important;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  min-height: 320px;
  max-height: 600px;
  overflow-y: auto;
  font-family: inherit;
}

.ql-editor {
  font-size: 0.875rem; /* text-sm */
  line-height: 1.6;
}

.ql-editor.ql-blank::before {
  font-style: normal;
  color: #9ca3af;
}
</style>
