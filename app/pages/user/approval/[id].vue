<template>
  <div class="flex flex-col w-full min-h-screen">
    <!-- Header / Toolbar -->
    <AppToolbar>
      <div class="flex items-start gap-3 w-full">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-medium text-neutral-800">{{ user?.firstName }} {{ user?.lastName }}</h1>
            <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors shrink-0" />
          </div>
          <p class="text-xs text-neutral-400 font-medium mt-0.5">
            <NuxtLink to="/" class="text-primary hover:underline">Beranda</NuxtLink> / 
            <NuxtLink to="/user" class="text-primary hover:underline">Referal</NuxtLink> / 
            <NuxtLink to="/user/approval" class="text-primary hover:underline">Persetujuan Registrasi</NuxtLink> / 
            <span class="text-neutral-500">{{ user?.firstName }} {{ user?.lastName }}</span>
          </p>
        </div>
      </div>
    </AppToolbar>

    <!-- Main Content -->
    <div class="flex-1 flex justify-left">
      <!-- Loading State -->
      <div v-if="!user" class="w-full max-w-4xl">
        <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
          <div class="px-4 md:px-8 py-6 space-y-4 animate-pulse">
            <div v-for="i in 8" :key="i" class="h-10 bg-base-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div v-else class="w-full max-w-4xl space-y-4">
        <!-- Status Note Banner (if revision/reject) -->
        <div v-if="user.statusNote && (user.status === 'revision' || user.status === 'reject')" 
          :class="[
            'flex items-start gap-3 rounded-xl p-4 border',
            user.status === 'reject' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
          ]"
        >
          <AlertCircle :class="['w-5 h-5 shrink-0 mt-0.5', user.status === 'reject' ? 'text-red-500' : 'text-amber-500']" />
          <div>
            <p :class="['text-sm font-semibold', user.status === 'reject' ? 'text-red-700' : 'text-amber-700']">
              {{ user.status === 'reject' ? 'Pendaftaran Ditolak' : 'Perlu Direvisi' }}
            </p>
            <p :class="['text-xs mt-0.5', user.status === 'reject' ? 'text-red-600' : 'text-amber-600']">
              {{ user.statusNote }}
            </p>
            <p v-if="user.statusUpdatedAt" :class="['text-xs mt-1 opacity-70', user.status === 'reject' ? 'text-red-500' : 'text-amber-500']">
              {{ formatDateTime(user.statusUpdatedAt) }}
            </p>
          </div>
        </div>

        <!-- Form Card -->
        <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
          <!-- Informasi Pribadi -->
          <div class="px-4 md:px-8 py-6">
            <h3 class="text-base font-semibold text-neutral-800 mb-5">Informasi Pribadi</h3>

            <div class="space-y-4">
              <!-- Foto KTP -->
              <div v-if="user.identityPath" class="w-full max-w-xs">
                <label class="label mb-1.5 p-0">
                  <span class="text-xs text-neutral-800 font-medium">Foto KTP<span class="text-red-500">*</span></span>
                </label>
                <div class="w-48 h-28 rounded-lg border border-base-200 overflow-hidden bg-base-100 cursor-pointer" @click="previewImage(user.identityPath!)">
                  <img :src="user.identityPath" alt="Foto KTP" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- Nama Depan & Belakang -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Nama Depan<span class="text-red-500">*</span></span>
                  </label>
                  <input type="text" :value="user.firstName || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                </div>
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Nama Belakang<span class="text-red-500">*</span></span>
                  </label>
                  <input type="text" :value="user.lastName || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                </div>
              </div>

              <!-- Tempat Tanggal Lahir & NIK -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Tempat dan Tanggal Lahir<span class="text-red-500">*</span></span>
                  </label>
                  <div class="flex items-center border border-base-200 rounded-lg h-10 overflow-hidden bg-base-50">
                    <span class="flex-1 h-full px-3 text-sm flex items-center text-neutral-700">{{ user.birthPlace || '-' }}</span>
                    <div class="w-px h-5 bg-base-200"></div>
                    <span class="flex-1 h-full px-3 text-sm flex items-center text-neutral-700">{{ user.birthDate ? formatDate(user.birthDate) : '-' }}</span>
                  </div>
                </div>
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">NIK<span class="text-red-500">*</span></span>
                  </label>
                  <input type="text" :value="user.identityNumber || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                </div>
              </div>

              <!-- Email & Nomor Handphone -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Alamat Email<span class="text-red-500">*</span></span>
                  </label>
                  <div class="relative">
                    <input type="text" :value="user.email || '-'" readonly class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Nomor Handphone<span class="text-red-500">*</span></span>
                  </label>
                  <div class="flex items-center gap-3">
                    <div class="relative flex-1">
                      <input type="text" :value="user.phone || '-'" readonly class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                    <label class="label cursor-pointer gap-2 p-0 shrink-0">
                      <input type="checkbox" :checked="user.hasWhatsapp" disabled class="checkbox checkbox-sm checkbox-primary border-base-300 rounded" />
                      <span class="label-text text-sm text-neutral-600">Whatsapp</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Alamat Rumah -->
              <div class="form-control w-full">
                <div class="flex items-center justify-between mb-1.5">
                  <label class="label p-0">
                    <span class="text-xs text-neutral-800 font-medium">Alamat Rumah<span class="text-red-500">*</span></span>
                  </label>
                  <span class="text-xs text-neutral-400">{{ (user.address || '').length }}/110</span>
                </div>
                <textarea :value="user.address || '-'" readonly rows="3" class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm bg-base-50 cursor-default resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Informasi Bank -->
          <div class="px-4 md:px-8 py-6 border-t border-base-200">
            <h3 class="text-base font-semibold text-neutral-800 mb-5">Informasi Bank</h3>

            <div class="space-y-4">
              <!-- Rekening Bank & Atas Nama -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Rekening Bank<span class="text-red-500">*</span></span>
                  </label>
                  <div class="flex items-center border border-base-200 rounded-lg h-10 overflow-hidden bg-base-50">
                    <span class="h-full px-3 text-sm flex items-center text-neutral-700 shrink-0">{{ user.bankDetails?.name || '-' }}</span>
                    <div class="w-px h-5 bg-base-200"></div>
                    <span class="flex-1 h-full px-3 text-sm flex items-center text-neutral-700">{{ user.bankDetails?.number || '-' }}</span>
                  </div>
                </div>
                <div class="form-control w-full">
                  <label class="label mb-1.5 p-0">
                    <span class="text-xs text-neutral-800 font-medium">Atas Nama<span class="text-red-500">*</span></span>
                  </label>
                  <input type="text" :value="user.bankDetails?.holderName || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                </div>
              </div>

              <!-- Foto Buku Rekening -->
              <div v-if="user.bankDetails?.accountPath" class="w-full max-w-xs">
                <label class="label mb-1.5 p-0">
                  <span class="text-xs text-neutral-800 font-medium">Foto Bagian Depan Buku Rekening<span class="text-red-500">*</span></span>
                </label>
                <div class="w-48 h-28 rounded-lg border border-base-200 overflow-hidden bg-base-100 cursor-pointer" @click="previewImage(user.bankDetails!.accountPath!)">
                  <img :src="user.bankDetails.accountPath" alt="Foto Buku Rekening" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <!-- Informasi Perusahaan -->
          <template v-if="user.company || user.jobPosition || user.companyAddress">
            <div class="px-4 md:px-8 py-6 border-t border-base-200">
              <h3 class="text-base font-semibold text-neutral-800 mb-5">Informasi Perusahaan</h3>

              <div class="space-y-4">
                <!-- Nama Perusahaan & Jabatan -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="form-control w-full">
                    <label class="label mb-1.5 p-0">
                      <span class="text-xs text-neutral-800 font-medium">Nama Perusahaan<span class="text-red-500">*</span></span>
                    </label>
                    <input type="text" :value="user.company || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                  </div>
                  <div class="form-control w-full">
                    <label class="label mb-1.5 p-0">
                      <span class="text-xs text-neutral-800 font-medium">Jabatan<span class="text-red-500">*</span></span>
                    </label>
                    <input type="text" :value="user.jobPosition || '-'" readonly class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm bg-base-50 cursor-default" />
                  </div>
                </div>

                <!-- Alamat Perusahaan -->
                <div class="form-control w-full">
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="label p-0">
                      <span class="text-xs text-neutral-800 font-medium">Alamat Perusahaan<span class="text-red-500">*</span></span>
                    </label>
                    <span class="text-xs text-neutral-400">{{ (user.companyAddress || '').length }}/110</span>
                  </div>
                  <textarea :value="user.companyAddress || '-'" readonly rows="3" class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm bg-base-50 cursor-default resize-none"></textarea>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div v-if="user && canAction" class="sticky bottom-0 z-40 bg-white border-t border-base-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] -mx-4 md:-mx-6 lg:-mx-8">
      <div class="px-4 md:px-6 py-3 md:py-4 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
        <!-- Left: Tolak -->
        <button 
          @click="openRejectModal"
          class="text-error hover:text-error/80 font-semibold text-sm transition-colors text-center md:text-left"
        >
          Tolak Pendaftaran
        </button>

        <!-- Right: Kembali + Setujui -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <NuxtLink 
            to="/user/approval"
            class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg font-semibold flex-1 md:flex-none"
          >
            Kembali
          </NuxtLink>
          <button 
            @click="openApproveModal"
            class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold flex-1 md:flex-none"
          >
            Setujui Pendaftaran
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="user" class="sticky bottom-0 z-40 bg-white border-t border-base-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] -mx-4 md:-mx-6 lg:-mx-8">
      <div class="px-4 md:px-6 py-3 md:py-4 flex items-center justify-end">
        <NuxtLink 
          to="/user/approval"
          class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg font-semibold w-full md:w-auto"
        >
          Kembali
        </NuxtLink>
      </div>
    </div>

    <!-- Modals -->
    <ModalUserApproval
      :visible="showApproveModal"
      type="approve"
      :loading="actionLoading"
      @close="showApproveModal = false"
      @confirm="handleApprove"
    />
    <ModalUserApproval
      :visible="showRejectModal"
      type="reject"
      :loading="actionLoading"
      @close="showRejectModal = false"
      @confirm="handleReject"
    />

    <!-- Image Preview -->
    <ModalImagePreview
      :is-open="showImagePreview"
      :image-url="previewImageUrl"
      @close="showImagePreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, Mail, Phone, AlertCircle
} from 'lucide-vue-next'
import { userService } from '~/services/user-service'
import { formatDate, formatDateTime } from '~/utils/date'
import type { UserProfile } from '~/types/user'

definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Detail Persetujuan Registrasi',
})

const route = useRoute()
const toast = useToast()
const userId = route.params.id as string

// Fetch User Detail
const user = ref<UserProfile | null>(null)
const loading = ref(true)

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await userService.getUserById(userId)
    if (response.success) {
      user.value = response.data
    }
  } finally {
    loading.value = false
  }
}

// Can perform approve/reject actions
const canAction = computed(() => {
  return user.value?.status === 'pending' || user.value?.status === 'revision'
})

// Modal state
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const actionLoading = ref(false)

// Image preview
const showImagePreview = ref(false)
const previewImageUrl = ref('')

const previewImage = (url: string) => {
  previewImageUrl.value = url
  showImagePreview.value = true
}

const openApproveModal = () => {
  showApproveModal.value = true
}

const openRejectModal = () => {
  showRejectModal.value = true
}

const handleApprove = async (note: string, status: string) => {
  actionLoading.value = true
  try {
    await userService.updateUserStatus(userId, { status, note })
    toast.success('Pendaftaran berhasil disetujui')
    showApproveModal.value = false
    navigateTo('/user/approval')
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Gagal menyetujui pendaftaran')
  } finally {
    actionLoading.value = false
  }
}

const handleReject = async (note: string, status: string) => {
  actionLoading.value = true
  try {
    await userService.updateUserStatus(userId, { status, note })
    const msg = status === 'reject' ? 'Pendaftaran berhasil ditolak' : 'Permintaan revisi berhasil dikirim'
    toast.success(msg)
    showRejectModal.value = false
    navigateTo('/user/approval')
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Gagal memproses pendaftaran')
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchUser()
})
</script>
