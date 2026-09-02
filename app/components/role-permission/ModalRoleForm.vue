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
              {{ data?.id ? 'Edit Peran' : 'Buat Peran' }}
            </h3>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Content -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Nama Peran -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Peran <span class="text-red-500">*</span></span>
            </label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Masukkan nama peran" 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
              :class="{ 'border-red-500': errors.name }"
              :disabled="loading"
            />
            <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Deskripsi</span>
            </label>
            <textarea 
              v-model="form.description" 
              placeholder="Masukkan deskripsi peran..." 
              rows="3"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white"
              :disabled="loading"
            ></textarea>
          </div>

          <!-- Warna -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Warna</span>
            </label>
            <div class="flex items-center gap-3 mt-1 flex-wrap">
              <button 
                v-for="color in colorOptions" 
                :key="color.value"
                type="button"
                class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 cursor-pointer"
                :style="{ backgroundColor: color.value }"
                :class="form.color === color.value ? 'border-neutral-800 ring-2 ring-offset-2 ring-neutral-300 scale-110' : 'border-transparent'"
                @click="form.color = form.color === color.value ? '' : color.value"
                :title="color.label"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Karyawan -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Karyawan</span>
            </label>
            <div v-if="loadingEmployees" class="flex items-center gap-2 py-2">
              <span class="loading loading-spinner loading-xs"></span>
              <span class="text-xs text-neutral-400">Memuat karyawan...</span>
            </div>
            <MultiSelect
              v-else
              v-model="form.employeeIds"
              :options="employeeOptions"
              placeholder="Pilih karyawan..."
              label-key="label"
              value-key="value"
            />
            <p class="text-xs text-neutral-400 mt-1">Pilih karyawan yang akan menggunakan peran ini</p>
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
import { X } from 'lucide-vue-next'
import { z } from 'zod'
import type { RoleItem, RoleEmployee } from '~/types/role'
import { roleService } from '~/services/role-service'

const props = defineProps<{
  data?: RoleItem | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const colorOptions = [
  { label: 'Hijau', value: '#22c55e' },
  { label: 'Biru', value: '#3b82f6' },
  { label: 'Kuning', value: '#eab308' },
  { label: 'Ungu', value: '#8b5cf6' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Oranye', value: '#f97316' },
  { label: 'Merah', value: '#ef4444' },
]

const form = ref({
  name: '',
  description: '',
  color: '',
  employeeIds: [] as number[],
})

const errors = ref<Record<string, string>>({})
const allEmployees = ref<RoleEmployee[]>([])
const loadingEmployees = ref(false)

const employeeOptions = computed(() => {
  return allEmployees.value.map(emp => ({
    label: `${emp.name} (${emp.email})`,
    value: emp.id,
  }))
})

const roleSchema = z.object({
  name: z.string().trim().min(1, 'Nama peran tidak boleh kosong'),
  description: z.string().optional(),
  color: z.string().optional(),
})

const fetchEmployees = async () => {
  loadingEmployees.value = true
  try {
    const res = await roleService.getEmployees()
    if (res.success) {
      allEmployees.value = res.data
    }
  } catch {
    // silent
  } finally {
    loadingEmployees.value = false
  }
}

watch(isOpen, async (val) => {
  errors.value = {}
  
  if (val) {
    // Fetch employees list
    await fetchEmployees()

    if (props.data) {
      form.value = {
        name: props.data.name || '',
        description: props.data.description || '',
        color: props.data.color || '',
        employeeIds: props.data.employees?.map(e => e.id) || [],
      }
    } else {
      form.value = {
        name: '',
        description: '',
        color: '',
        employeeIds: [],
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

const handleSubmit = () => {
  errors.value = {}
  
  const result = roleSchema.safeParse(form.value)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  emit('submit', {
    name: form.value.name,
    description: form.value.description || undefined,
    color: form.value.color || undefined,
    employeeIds: form.value.employeeIds,
  })
}
</script>
