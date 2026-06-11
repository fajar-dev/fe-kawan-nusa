<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-semibold text-neutral-800 leading-tight">
              {{ category?.id ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">Kelola kategori untuk konten edukasi</p>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Content Area -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Kategori</span>
            </label>
            <input 
              v-model="name" 
              type="text" 
              placeholder="Masukkan nama kategori..." 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.name }"
              :disabled="loading"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          </div>
          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6">
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
import { X, Loader2 } from 'lucide-vue-next'
import { z } from 'zod'

const props = defineProps<{
  category?: { id: number | null, name: string } | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const name = ref('')
const errors = ref<Record<string, string>>({})

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nama kategori tidak boleh kosong')
})

watch(isOpen, (val) => {
  errors.value = {}
  if (val) {
    name.value = props.category?.name || ''
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

const handleSubmit = () => {
  errors.value = {}
  const result = categorySchema.safeParse({ name: name.value })
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }
  emit('submit', name.value.trim())
}
</script>
