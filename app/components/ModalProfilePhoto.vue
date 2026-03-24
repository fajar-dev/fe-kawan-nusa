<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop click to close -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-base-200">
          <h3 class="text-lg font-semibold text-neutral-800">Ubah Foto Profil</h3>
          <button @click="isOpen = false" class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">

          <!-- Current Photo Section -->
          <div class="">
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 lg:w-28 lg:h-28 rounded-full border border-base-300 shadow-sm overflow-hidden bg-base-100 shrink-0">
                <img v-if="previewUrl || profile?.photo" :src="previewUrl ? previewUrl : `${useRuntimeConfig().public.apiUrl}${profile?.photo}`" alt="Avatar" class="w-full h-full object-cover" />
                <div v-else class="bg-primary text-white flex items-center justify-center font-bold text-4xl h-full w-full uppercase">
                  {{ profile?.firstName?.[0] }}{{ profile?.lastName?.[0] }}
                </div>
              </div>
              
              <div class="flex-1 space-y-3">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-neutral-800">Unggah foto profil baru</p>
                    <div class="space-y-0.5">
                        <p class="text-xs text-neutral-400">JPG, PNG or GIF. Maks ukuran 5MB.</p>
                        <p class="text-xs text-neutral-400">Rekomendasi: 400x400px</p>
                    </div>
                </div>
                <button @click="fileInput?.click()" class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white btn-sm rounded-lg gap-2">
                  <Upload class="w-4 h-4" />
                  Unggah
                </button>
              </div>
            </div>
          </div>
          <input 
            ref="fileInput"
            type="file" 
            class="hidden" 
            accept="image/jpeg,image/png,image/gif"
            @change="handleFileChange"
          />
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 border-t border-base-200 flex items-center justify-end gap-3">
          <button 
            @click="isOpen = false"
            :disabled="isLoading"
            class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg font-semibold"
          >
            Batalkan
          </button>
          <button 
            @click="handleSave"
            :disabled="isLoading || !selectedFile"
            class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Camera, Upload } from 'lucide-vue-next'
import { profileService } from '~/services/profile-service'
import type { User } from '~/types/auth'

const isOpen = defineModel<boolean>({ default: false })
const props = defineProps<{
  profile: User | null
}>()

const emit = defineEmits(['success'])
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isLoading = ref(false)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSave = async () => {
  if (!selectedFile.value) return
  
  isLoading.value = true
  try {
    const response = await profileService.updatePhoto(selectedFile.value)
    if (response.success) {
      toast.success({ message: response.message || 'Foto profil berhasil diperbarui' })
      emit('success')
      isOpen.value = false
    }
  } finally {
    isLoading.value = false
  }
}

watch(isOpen, (val) => {
    if (!val) {
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value)
        }
        previewUrl.value = null
        selectedFile.value = null
    }
})
</script>
