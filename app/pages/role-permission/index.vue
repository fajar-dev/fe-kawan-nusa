<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-medium text-neutral-800">Pengaturan Akses</h1>
            <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
          </div>
          <p class="text-sm text-neutral-400 font-normal mt-0.5">
            Kelola peran dan izin akses halaman untuk setiap jabatan pengguna
          </p>
        </div>
      </div>
      <template #right>
        <button 
          v-if="canCreate('role')"
          @click="openCreateModal" 
          class="btn btn-primary btn-sm h-10 rounded-lg text-sm font-medium px-5 flex items-center gap-2"
        >
          Buat Peran
        </button>
      </template>
    </AppToolbar>

    <!-- Loading State -->
    <div v-if="loading" class="w-full">
      <div class="animate-pulse space-y-3">
        <div class="h-8 bg-neutral-200 rounded w-full"></div>
        <div v-for="n in 4" :key="n" class="h-14 bg-neutral-100 rounded w-full"></div>
      </div>
    </div>

    <!-- Permission Matrix -->
    <div v-else class="w-full">
      <!-- Section Title -->
      <div class="mb-3">
        <h2 class="text-sm font-semibold text-neutral-800">Tabel Izin Akses</h2>
        <p class="text-xs text-neutral-400 mt-0.5">Peran ditampilkan sebagai baris agar tetap nyaman saat jumlah jabatan bertambah. Izin bersifat berjenjang dan tersimpan otomatis.</p>
      </div>

      <div class="overflow-x-auto border border-neutral-200 rounded-lg bg-white">
        <table class="w-full min-w-max border-collapse text-sm">
          <thead>
            <!-- Row 1: Group Names -->
            <tr>
              <th 
                class="bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider border-r border-b border-neutral-200 min-w-[280px] sticky left-0 z-20 px-5 py-3 text-left align-bottom"
                :rowspan="3"
              >
                PERAN / JABATAN
              </th>
              <th 
                v-for="group in groupedModules" 
                :key="group.name"
                :colspan="group.modules.length * 4"
                class="text-center text-xs font-semibold border-r border-b border-neutral-200 px-3 py-2 bg-primary/5"
              >
                <div class="flex items-center justify-center gap-1.5">
                  <component :is="group.icon" class="w-3.5 h-3.5 text-primary" />
                  <span>{{ group.name }}</span>
                </div>
              </th>
            </tr>

            <!-- Row 2: Module Names -->
            <tr>
              <template v-for="group in groupedModules" :key="'mod-' + group.name">
                <th 
                  v-for="mod in group.modules" 
                  :key="mod.key"
                  :colspan="4"
                  class="text-center border-r border-neutral-200 px-2 py-1.5 bg-white"
                >
                  <div class="flex flex-col items-center">
                    <span class="text-xs font-semibold text-neutral-600">{{ mod.label }}</span>
                    <span v-if="mod.subtitle" class="text-[10px] font-light text-neutral-400">{{ mod.subtitle }}</span>
                  </div>
                </th>
              </template>
            </tr>

            <!-- Row 3: L T E H -->
            <tr class="border-b border-neutral-200">
              <template v-for="group in groupedModules" :key="'lteh-' + group.name">
                <template v-for="mod in group.modules" :key="'lteh-mod-' + mod.key">
                  <th 
                    v-for="(action, actionIdx) in actionLabels" 
                    :key="mod.key + '-' + action.key"
                    class="text-center text-[11px] font-medium text-neutral-400 border-b border-neutral-200 px-1 py-1.5 w-9"
                    :class="actionIdx === actionLabels.length - 1 ? 'border-r border-neutral-200' : ''"
                  >
                    {{ action.key }}
                  </th>
                </template>
              </template>
            </tr>
          </thead>

          <!-- Body: One row per role -->
          <tbody>
            <tr 
              v-for="role in roles" 
              :key="role.id"
              class="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
            >
              <!-- Sticky Role Info Column -->
              <td class="bg-white border-r border-neutral-200 sticky left-0 z-10 px-5 py-3">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <span 
                      class="w-2.5 h-2.5 rounded-full shrink-0"
                      :style="{ backgroundColor: role.color || '#9ca3af' }"
                    ></span>
                    <div class="min-w-0">
                      <span class="font-semibold text-sm text-neutral-800 block">{{ role.name }}</span>
                      <p class="text-xs text-neutral-400 truncate max-w-[180px]">
                        {{ role.description || '—' }} · {{ role.employeeCount }} pengguna
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center justify-center gap-0 shrink-0">
                    <button v-if="canEdit('role')" @click="openEditModal(role)" class="btn btn-ghost btn-xs hover:bg-primary/10 rounded" title="Edit">
                      <Pencil class="w-4.5 h-4.5" />
                    </button>
                    <button v-if="canDelete('role')" @click="openDeleteModal(role)" class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 rounded" title="Hapus">
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </td>

              <!-- Permission Checkboxes -->
              <template v-for="group in groupedModules" :key="'body-' + group.name + '-' + role.id">
                <template v-for="mod in group.modules" :key="role.id + '-' + mod.key">
                  <td 
                    v-for="(action, actionIdx) in actionLabels" 
                    :key="role.id + '-' + mod.key + '-' + action.key"
                    class="text-center px-0 py-2"
                    :class="actionIdx === actionLabels.length - 1 ? 'border-r border-neutral-200' : ''"
                  >
                    <template v-if="mod.actions.includes(action.key)">
                      <input 
                        type="checkbox" 
                        :checked="hasPermission(role, mod.key, action.key)"
                        @change="togglePermission(role, mod.key, action.key)"
                        class="checkbox checkbox-xs checkbox-success rounded cursor-pointer"
                        :disabled="updatingRoleId === role.id || !canEdit('role')"
                      />
                    </template>
                    <template v-else>
                      <span class="text-neutral-200">□</span>
                    </template>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty State -->
            <tr v-if="roles.length === 0">
              <td :colspan="totalColumns" class="text-center py-12">
                <div class="flex flex-col items-center gap-2">
                  <Shield class="w-10 h-10 text-neutral-300" />
                  <p class="text-neutral-400 text-sm">Belum ada peran yang dibuat</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Note -->
      <p class="text-xs text-neutral-400 mt-4 px-1">
        * Singkatan kolom Izin: <strong>L</strong> = Lihat, <strong>T</strong> = Tambah, <strong>E</strong> = Edit, <strong>H</strong> = Hapus. Dependensi izin diterapkan otomatis secara berjenjang.
      </p>
    </div>

    <!-- Modals -->
    <ModalRoleForm
      v-model="isOpenFormModal"
      :data="selectedRole"
      :loading="submitting"
      @submit="handleFormSubmit"
    />

    <ModalConfirmDelete
      v-model="isOpenDeleteModal"
      title="Hapus Peran"
      :message="`Apakah Anda yakin ingin menghapus peran '${roleToDelete?.name}'? Tindakan ini tidak dapat dibatalkan.`"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, SquarePen, Trash2, Shield, Home, UsersRound, Coins, Gift, PackageSearch, Shapes, UserCog, ShieldCheck, Pencil } from 'lucide-vue-next'
import { roleService } from '~/services/role-service'
import type { RoleItem, PermissionModule } from '~/types/role'
import type { Component } from 'vue'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Pengaturan Akses',
})

const actionLabels = [
  { key: 'L', label: 'Lihat' },
  { key: 'T', label: 'Tambah' },
  { key: 'E', label: 'Edit' },
  { key: 'H', label: 'Hapus' },
]

// Group config: color + icon
const groupConfig: Record<string, { icon: Component }> = {
  'Beranda': { icon: Home },
  'Referral': { icon: UsersRound },
  'Input Poin Referral': { icon: Coins },
  'Tukar Poin': { icon: Gift },
  'Katalog Reward': { icon: PackageSearch },
  'Konten Edukasi': { icon: Shapes },
  'Manajemen Karyawan': { icon: UserCog },
  'Pengaturan Akses': { icon: ShieldCheck },
}

// Subtitle mapping for modules
const moduleSubtitles: Record<string, string> = {
  'user.approval': 'Registration Approval',
}

const roles = ref<RoleItem[]>([])
const modules = ref<PermissionModule[]>([])
const loading = ref(true)
const updatingRoleId = ref<number | null>(null)

// Modal states
const isOpenFormModal = ref(false)
const selectedRole = ref<RoleItem | null>(null)
const submitting = ref(false)

const isOpenDeleteModal = ref(false)
const roleToDelete = ref<RoleItem | null>(null)
const deleting = ref(false)

const toast = useToast()
const { canCreate, canEdit, canDelete } = usePermission()

// Group modules by their group property
const groupedModules = computed(() => {
  const groups: { name: string; icon: Component; modules: (PermissionModule & { subtitle?: string })[] }[] = []
  const seen = new Map<string, (PermissionModule & { subtitle?: string })[]>()
  
  for (const mod of modules.value) {
    if (!seen.has(mod.group)) {
      seen.set(mod.group, [])
    }
    seen.get(mod.group)!.push({
      ...mod,
      subtitle: moduleSubtitles[mod.key],
    })
  }
  
  for (const [name, mods] of seen) {
    const config = groupConfig[name] || { icon: Shield }
    groups.push({
      name,
      icon: config.icon,
      modules: mods
    })
  }
  
  return groups
})

const totalColumns = computed(() => {
  let count = 1 // role column
  for (const group of groupedModules.value) {
    count += group.modules.length * 4
  }
  return count
})

// Check if a role has a specific permission
const hasPermission = (role: RoleItem, moduleKey: string, action: string): boolean => {
  return role.permissions?.[moduleKey]?.includes(action) || false
}

// Toggle permission and auto-save
const togglePermission = async (role: RoleItem, moduleKey: string, action: string) => {
  updatingRoleId.value = role.id
  
  // Clone permissions
  const newPermissions = { ...role.permissions }
  if (!newPermissions[moduleKey]) {
    newPermissions[moduleKey] = []
  } else {
    newPermissions[moduleKey] = [...newPermissions[moduleKey]]
  }

  // Toggle
  const idx = newPermissions[moduleKey].indexOf(action)
  if (idx >= 0) {
    newPermissions[moduleKey].splice(idx, 1)
    if (newPermissions[moduleKey].length === 0) {
      delete newPermissions[moduleKey]
    }
  } else {
    newPermissions[moduleKey].push(action)
  }

  try {
    const res = await roleService.updateRole(role.id, { permissions: newPermissions })
    if (res.success) {
      // Update local state
      role.permissions = newPermissions
      toast.success('Izin berhasil diperbarui')
    } else {
      toast.error(res.message || 'Gagal memperbarui izin')
    }
  } catch {
    toast.error('Gagal memperbarui izin')
  } finally {
    updatingRoleId.value = null
  }
}

// Fetch data
const fetchRoles = async () => {
  try {
    const res = await roleService.getRoles({ limit: 100 })
    if (res.success) {
      roles.value = res.data
    }
  } catch {
    // silent
  }
}

const fetchPermissionMatrix = async () => {
  try {
    const res = await roleService.getPermissionMatrix()
    if (res.success) {
      modules.value = res.data
    }
  } catch {
    // silent
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    await Promise.all([fetchRoles(), fetchPermissionMatrix()])
  } finally {
    loading.value = false
  }
}

// Modal helpers
const openCreateModal = () => {
  selectedRole.value = null
  isOpenFormModal.value = true
}

const openEditModal = async (role: RoleItem) => {
  // Fetch detail with employees
  try {
    const res = await roleService.getRoleById(role.id)
    if (res.success) {
      selectedRole.value = res.data
    } else {
      selectedRole.value = role
    }
  } catch {
    selectedRole.value = role
  }
  isOpenFormModal.value = true
}

const openDeleteModal = (role: RoleItem) => {
  roleToDelete.value = role
  isOpenDeleteModal.value = true
}

// Form submit
const handleFormSubmit = async (formData: { name: string; description?: string; color?: string; employeeIds?: number[] }) => {
  submitting.value = true
  try {
    let response
    const id = selectedRole.value?.id
    if (id) {
      response = await roleService.updateRole(id, formData)
      if (response.success) {
        toast.success('Peran berhasil diperbarui')
      } else {
        toast.error(response.message || 'Gagal memperbarui peran')
      }
    } else {
      response = await roleService.createRole({ ...formData, permissions: {} })
      if (response.success) {
        toast.success('Peran berhasil dibuat')
      } else {
        toast.error(response.message || 'Gagal membuat peran')
      }
    }
    isOpenFormModal.value = false
    fetchRoles()
  } finally {
    submitting.value = false
  }
}

// Delete
const handleDelete = async () => {
  if (!roleToDelete.value) return
  deleting.value = true
  try {
    const res = await roleService.deleteRole(roleToDelete.value.id)
    if (res.success) {
      toast.success('Peran berhasil dihapus')
      isOpenDeleteModal.value = false
      fetchRoles()
    } else {
      toast.error(res.message || 'Gagal menghapus peran')
    }
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
