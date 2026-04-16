<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <div class="absolute inset-0" @click="closeModal"></div>
      
      <div id="feedback-modal-screenshot" class="bg-white rounded-xl w-full max-w-xl shadow-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h3 class="text-lg font-medium text-neutral-800">Beri Feedback</h3>
            <p class="text-xs text-neutral-400">Masukan Anda sangat berharga bagi kami</p>
          </div>
          <button @click="closeModal" class="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-800 transition-all">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto max-h-[80vh]">
          <div class="space-y-3">
            <div class="mb-2">
              <p class="text-xs">Kami meningkatkan Sistem Informasi agar berfungsi dengan baik untuk kita semua. Terima kasih atas tanggapan Anda.</p>
              <span class="text-blue-500 font-medium underline text-sm">{{ props.formState.url }}</span>
            </div>
            <!-- Type Selection -->
            <div class="space-y-3">
              <label class="text-xs text-neutral-500">Jenis Feedback</label>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  v-for="item in typeOptions" 
                  :key="item.value"
                  @click="state.type = item.value"
                  type="button"
                  class="flex flex-col items-center justify-center py-2 rounded-lg border transition-all gap-2 group relative"
                  :class="[
                    state.type === item.value 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-neutral-100 bg-neutral-50/50 hover:border-primary/50'
                  ]"
                >
                  <component 
                    :is="item.icon" 
                    class="w-4 h-4 transition-colors"
                    :class="[state.type === item.value ? 'text-primary' : 'text-neutral-400 group-hover:text-primary/70']"
                  />
                  <span class="text-xs font-medium" :class="[state.type === item.value ? 'text-primary' : 'text-neutral-500']">
                    {{ item.label }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Message -->
            <div class="space-y-2">
              <label class="text-xs text-neutral-500">Pesan Anda</label>
              <textarea 
                v-model="state.message"
                class="textarea textarea-bordered w-full h-18 text-xs focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all bg-neutral-50/30"
                placeholder="Tuliskan keluhan, saran, atau pujian Anda di sini..."
              ></textarea>
              <p v-if="errors.message" class="text-xs text-red-500 font-medium italic">{{ errors.message }}</p>
            </div>

            <!-- Images / Screenshot -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs text-neutral-500">Lampiran (Screenshot)</label>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-neutral-400 bg-neutral-100 px-2 rounded-full">{{ state.images.length }}/3</span>
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <div 
                  v-for="(image, index) in state.images" 
                  :key="index"
                  class="relative aspect-square rounded-xl border border-neutral-100 overflow-hidden bg-neutral-100 group shadow-sm"
                >
                  <img :src="getImageUrl(image)" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        @click="removeImage(index)"
                        class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                  </div>
                </div>

                <button 
                  v-if="state.images.length < 3"
                  @click="triggerFileInput"
                  type="button"
                  class="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-primary/50 hover:text-primary/70 hover:bg-primary/5 transition-all group"
                >
                  <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform" />
                  <span class="text-xs font-medium">Tambah</span>
                </button>
              </div>
              <p v-if="errors.images" class="text-xs text-red-500 font-medium italic">{{ errors.images }}</p>
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                multiple 
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
          </div>
        </div>

        <div class="px-6 pb-4 text-center">
            <span class="text-sm font-medium text-neutral-500 italic">- Feedback is a gift -</span>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
          <NuxtLink to="/feedback" @click="closeModal" class="text-primary text-sm font-medium flex items-center gap-2">
            <History class="w-5 h-5" />
            <span class="md:block hidden" >Riwayat Feedback</span>
          </NuxtLink>
          
          <div class="flex gap-3">
            <button 
              @click="closeModal"
              class="btn btn-outline rounded-lg font-medium border-primary text-primary"
              :disabled="isSaving"
            >
              Batal
            </button>
            <button 
              @click="onSubmit"
              class="btn btn-primary rounded-lg font-medium"
              :disabled="isSaving"
            >
              <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
              <span v-else>Kirim Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Plus, History, Loader2, MessageSquareWarning, Megaphone, Heart, Trash2 } from 'lucide-vue-next'
import * as z from 'zod'
import { feedbackService } from '~/services/feedback-service'

const props = defineProps<{
  formState: {
    type: string
    message: string
    images: File[]
    url: string
  }
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['created'])

const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const toast = useToast()

const typeOptions = [
  { label: 'Keluhan', value: 'keluhan', icon: MessageSquareWarning },
  { label: 'Saran', value: 'saran', icon: Megaphone },
  { label: 'Pujian', value: 'pujian', icon: Heart }
] as const

const schema = z.object({
  type: z.enum(['keluhan', 'saran', 'pujian']),
  message: z.string().min(1, 'Pesan wajib diisi'),
  images: z.array(z.instanceof(File)).min(1, 'Minimal 1 gambar terlampir').max(3, 'Maksimal 3 gambar'),
  url: z.string().optional()
})

const state = reactive({
  type: (['keluhan', 'saran', 'pujian'].includes(props.formState.type) ? props.formState.type : 'keluhan') as 'keluhan' | 'saran' | 'pujian',
  message: props.formState.message || (props.formState as any).description || '',
  images: [...props.formState.images],
  url: props.formState.url
})

const errors = reactive({
    message: '',
    images: ''
})

watch(() => props.formState, (v) => {
    state.type = (['keluhan', 'saran', 'pujian'].includes(v.type) ? v.type : 'keluhan') as 'keluhan' | 'saran' | 'pujian'
    state.message = v.message || (v as any).description || ''
    state.images = [...v.images]
    state.url = v.url
}, { deep: true })

const imageUrlCache = new Map<File, string>()

const getImageUrl = (file: File) => {
    if (imageUrlCache.has(file)) {
        return imageUrlCache.get(file)!
    }
    const url = URL.createObjectURL(file)
    imageUrlCache.set(file, url)
    return url
}

// Cleanup URLs when images are removed or component is unmounted
watch(() => state.images, (newImages) => {
    // Identify URLs to revoke
    for (const [file, url] of imageUrlCache.entries()) {
        if (!newImages.includes(file)) {
            URL.revokeObjectURL(url)
            imageUrlCache.delete(file)
        }
    }
}, { deep: true })

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
        const newFiles = Array.from(target.files)
        const totalFiles = [...state.images, ...newFiles].slice(0, 3)
        state.images = totalFiles
    }
}

const removeImage = (index: number) => {
    state.images.splice(index, 1)
}

const closeModal = () => {
    isOpen.value = false
}

const onSubmit = async () => {
    errors.message = ''
    errors.images = ''
    
    const result = schema.safeParse(state)
    if (!result.success) {
        result.error.issues.forEach(issue => {
            if (issue.path[0] === 'message') errors.message = issue.message
            if (issue.path[0] === 'images') errors.images = issue.message
        })
        return
    }

    isSaving.value = true
    try {
        const response = await feedbackService.createFeedback(state)
        if (response.success) {
            toast.success({
                message: response.message || 'Terima kasih atas feedback Anda!'
            })
            emit('created')
            closeModal()
            // Reset local state if needed
            state.message = ''
            state.images = []
        } else {
            toast.error({
                message: response.message || 'Gagal mengirim feedback'
            })
        }
    } catch (error) {
        toast.error({
            message: 'Terjadi kesalahan saat mengirim feedback'
        })
    } finally {
        isSaving.value = false
    }
}

// Handle overflow
watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
  // Cleanup blob URLs
  imageUrlCache.forEach(url => URL.revokeObjectURL(url))
  imageUrlCache.clear()
})
</script>
