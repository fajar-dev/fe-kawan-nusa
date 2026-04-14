<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800 line-clamp-1">{{ template?.name || 'Loading Template...' }}</h3>
          <button @click="isOpen = false" class="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-800 transition-all">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
            <!-- Preview Section -->
            <div class="space-y-2">
                <p class="text-sm text-neutral-800">Preview</p>
                <div class="relative group aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-neutral-50">
                        <Loader2 class="w-8 h-8 animate-spin text-primary" />
                    </div>
                    <img 
                        v-else-if="template?.thumbnail" 
                        :src="template.thumbnail" 
                        class="w-full h-full object-cover" 
                        :alt="template.name" 
                    />
                    <div v-else class="flex items-center justify-center h-full text-neutral-300">
                      <ImageIcon class="w-12 h-12 opacity-20" />
                    </div>
                </div>
            </div>

            <!-- Format Options -->
            <div class="mt-4 space-y-4">
                <div class="space-y-1">
                    <h4 class="font-medium text-neutral-800 text-sm">Download Template</h4>
                    <p class="text-xs text-neutral-800">Pilih format file yang ingin Anda download</p>
                </div>

                <div class="grid grid-cols-2 gap-3">
        <button 
            v-for="format in formatOptions" 
            :key="format.type"
            @click="selectedType = format.type"
            :disabled="!isFormatAvailable(format.type)"
            class="flex flex-col items-center justify-center gap-2 rounded-lg border text-center disabled:opacity-60 disabled:cursor-not-allowed p-4"
            :class="[
                selectedType === format.type 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'   
                    : 'border-neutral-200 hover:border-primary/50 hover:bg-neutral-50'
            ]"
        >
            <div class="w-full text-center">
                <p class="font-semibold text-sm" :class="selectedType === format.type ? 'text-primary' : 'text-neutral-700'">
                    {{ format.label }}
                </p>
                <p class="text-xs" :class="selectedType === format.type ? 'text-primary' : 'text-neutral-400'">
                    {{ format.desc }}
                </p>
            </div>
        </button>
    </div>
            </div>

            <!-- Tips Banner -->
            <div class="mt-4 p-4 bg-amber-50/80 border border-neutral-200 rounded-xl flex items-start gap-3">
                <Lightbulb class="min-w-4 min-h-4 " />
                <p class="text-xs">
                    Tips: Pilih format editable (PSD/AI) jika Anda ingin menyesuaikan desain. Pilih JPG/PNG untuk langsung digunakan.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 flex items-center justify-end gap-3 border-t border-neutral-100 bg-neutral-50/50">
          <button 
            @click="isOpen = false"
            class="btn btn-outline border-primary rounded-lg font-medium"
          >
            Batal
          </button>
          <button 
            @click="handleDownload"
            :disabled="!selectedType || isDownloading || !template"
            class="btn btn-primary rounded-lg font-medium"
          >
            <Download class="w-4 h-4" />
            Download {{ selectedType?.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Image as ImageIcon, FileText, Download, Lightbulb, Loader2, FileVideo } from 'lucide-vue-next'
import { templateService } from '~/services/template-service'
import type { MarketingTemplate } from '~/types/template'

const props = defineProps<{
    templateId: number | null
}>()

const isOpen = defineModel<boolean>({ default: false })
const template = ref<MarketingTemplate | null>(null)
const selectedType = ref<string | null>(null)
const isLoading = ref(false)
const isDownloading = ref(false)

const formatOptions = [
    { type: 'jpg', label: 'JPG', desc: 'Siap Pakai', icon: ImageIcon },
    { type: 'png', label: 'PNG', desc: 'Siap Pakai', icon: ImageIcon },
    { type: 'psd', label: 'PSD', desc: 'Editable', icon: FileText },
    { type: 'mp4', label: 'MP4', desc: 'Siap Pakai', icon: FileVideo },
]

const isFormatAvailable = (type: string) => {
    if (!template.value) return false
    return !!(template.value as any)[type]
}

const fetchTemplate = async (id: number) => {
    isLoading.value = true
    try {
        const response = await templateService.getTemplateDetail(id)
        if (response.success) {
            template.value = response.data
            // Auto select first available type
            const firstAvailable = formatOptions.find(opt => isFormatAvailable(opt.type))
            if (firstAvailable) selectedType.value = firstAvailable.type
        }
    } catch (error) {
        console.error('Failed to fetch template detail:', error)
    } finally {
        isLoading.value = false
    }
}

const handleDownload = () => {
    if (!props.templateId || !selectedType.value) return
    const url = templateService.getDownloadUrl(props.templateId, selectedType.value)
    
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

watch(() => props.templateId, (newId) => {
    if (newId && isOpen.value) {
        fetchTemplate(newId)
    }
}, { immediate: true })

watch(isOpen, (val) => {
  if (!val) {
      template.value = null
      selectedType.value = null
  } else if (props.templateId) {
      fetchTemplate(props.templateId)
  }

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
})
</script>
