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
              {{ submission?.id ? 'Edit Poin Referral' : 'Input Poin Referral' }}
            </h3>
          </div>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors self-start mt-1">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <!-- Scrollable Content Area -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Nama Referral (autocomplete) -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Nama Referral <span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                v-model="userSearchQuery" 
                @input="onUserSearch"
                @focus="showUserDropdown = true"
                type="text" 
                placeholder="Cari nama referral..." 
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
                :class="{ 'border-red-500': errors.userId }"
                :disabled="loading"
                autocomplete="off"
              />
              <div v-if="showUserDropdown && userResults.length > 0" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                <div 
                  v-for="user in userResults" 
                  :key="user.id" 
                  @click="selectUser(user)" 
                  class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-neutral-700"
                >
                  {{ user.name }}
                </div>
              </div>
              <div v-if="showUserDropdown && userSearchQuery && userResults.length === 0 && !searchingUsers" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                <div class="px-3 py-2 text-sm text-neutral-400">Tidak ditemukan</div>
              </div>
            </div>
            <p v-if="errors.userId" class="text-xs text-red-500 mt-1">{{ errors.userId }}</p>
          </div>

          <!-- Tipe Komisi -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Tipe Komisi <span class="text-red-500">*</span></span>
            </label>
            <div class="flex items-center gap-4 mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  v-model="form.type" 
                  value="OTC" 
                  class="radio radio-primary radio-sm"
                  :disabled="loading"
                />
                <span class="text-sm text-neutral-600">OTC</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  v-model="form.type" 
                  value="Bulanan" 
                  class="radio radio-primary radio-sm"
                  :disabled="loading"
                />
                <span class="text-sm text-neutral-600">Bulanan</span>
              </label>
            </div>
            <p v-if="errors.type" class="text-xs text-red-500 mt-1">{{ errors.type }}</p>
          </div>

          <!-- Akun Layanan (autocomplete) -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Akun Layanan <span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                v-model="nisSearchQuery" 
                @input="onNisSearch"
                @focus="showNisDropdown = true"
                type="text" 
                placeholder="Cari akun layanan..." 
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white"
                :class="{ 'border-red-500': errors.nisData }"
                :disabled="loading"
                autocomplete="off"
              />
              <div v-if="showNisDropdown && nisResults.length > 0" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                <div 
                  v-for="account in nisResults" 
                  :key="account.custServId" 
                  @click="selectNisAccount(account)" 
                  class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-neutral-700"
                >
                  <div class="font-medium">{{ account.accountName }}</div>
                  <div class="text-xs text-neutral-400">{{ account.serviceName }} — {{ account.custId }}</div>
                </div>
              </div>
              <div v-if="showNisDropdown && nisSearchQuery && nisResults.length === 0 && !searchingNis" class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                <div class="px-3 py-2 text-sm text-neutral-400">Tidak ditemukan</div>
              </div>
            </div>
            <p v-if="errors.nisData" class="text-xs text-red-500 mt-1">{{ errors.nisData }}</p>
            <p v-else-if="accountWarning" class="text-xs text-amber-600 mt-1">⚠ {{ accountWarning }}</p>
          </div>

          <!-- Account Manager (readonly) -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Account Manager</span>
            </label>
            <input 
              :value="form.accountManager" 
              type="text" 
              placeholder="Otomatis terisi dari akun layanan" 
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-gray-50 text-neutral-500"
              readonly
              disabled
            />
          </div>

          <!-- Info box -->
          <div class="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Info class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p class="text-xs text-blue-700 font-medium">
              Masa berlaku poin referral adalah 1 tahun sejak disetujui.
            </p>
          </div>

          <!-- Besar Komisi & Poin (1 row, 2 col) -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Besar Komisi Referral <span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">Rp.</span>
                <input 
                  v-model.number="form.price" 
                  type="number" 
                  min="0"
                  placeholder="0" 
                  class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white pl-10"
                  :class="{ 'border-red-500': errors.price }"
                  :disabled="loading"
                />
              </div>
              <p v-if="errors.price" class="text-xs text-red-500 mt-1">{{ errors.price }}</p>
            </div>

            <div>
              <label class="label pb-1">
                <span class="label-text text-sm font-medium text-gray-700">Poin yang Diperoleh</span>
              </label>
              <input 
                :value="calculatedPoint" 
                type="number" 
                class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-gray-50 text-neutral-500"
                readonly
                disabled
              />
            </div>
          </div>

          <!-- Recurring info (Bulanan auto-generates a pending submission every month) -->
          <div v-if="form.type === 'Bulanan'" class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <Info class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p class="text-xs text-amber-700 font-medium">
              Setelah disetujui, sistem otomatis membuat submission baru setiap bulan yang perlu disetujui ulang. Jadwal berjalan tanpa batas sampai dihentikan.
            </p>
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
              <span v-else>{{ submission?.id ? 'Simpan' : 'Input Poin' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Info } from 'lucide-vue-next'
import { z } from 'zod'
import { pointSubmissionService } from '~/services/point-submission-service'
import { userService } from '~/services/user-service'
import type { PointSubmission, NisAccount } from '~/types/point-submission'
import type { UserListItem } from '~/types/user'

const props = defineProps<{
  submission?: PointSubmission | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits(['submit'])

const form = ref({
  userId: null as number | null,
  type: 'OTC' as 'OTC' | 'Bulanan',
  point: 0,
  price: 0,
  nisData: null as NisAccount | null,
  accountManager: '',
})

const errors = ref<Record<string, string>>({})

// User search
const userSearchQuery = ref('')
const userResults = ref<UserListItem[]>([])
const showUserDropdown = ref(false)
const searchingUsers = ref(false)
let userSearchTimeout: any = null

// NIS search
const nisSearchQuery = ref('')
const nisResults = ref<NisAccount[]>([])
const showNisDropdown = ref(false)
const searchingNis = ref(false)
let nisSearchTimeout: any = null

const calculatedPoint = computed(() => Math.floor((form.value.price || 0) / 100))

const submissionSchema = z.object({
  userId: z.number().min(1, 'Nama referral wajib dipilih'),
  type: z.enum(['OTC', 'Bulanan']),
  price: z.number().min(100, 'Komisi minimal adalah Rp 100'),
  nisData: z.any().refine(val => val !== null, { message: 'Akun layanan wajib dipilih' }),
})

const onUserSearch = () => {
  if (userSearchTimeout) clearTimeout(userSearchTimeout)
  showUserDropdown.value = true
  searchingUsers.value = true
  userSearchTimeout = setTimeout(async () => {
    if (!userSearchQuery.value.trim()) {
      userResults.value = []
      searchingUsers.value = false
      return
    }
    try {
      const res = await userService.getUsers({ q: userSearchQuery.value, limit: 10 })
      if (res.success && res.data) {
        userResults.value = res.data
      } else {
        userResults.value = []
      }
    } catch {
      userResults.value = []
    } finally {
      searchingUsers.value = false
    }
  }, 300)
}

const selectUser = (user: UserListItem) => {
  form.value.userId = user.id
  userSearchQuery.value = user.name
  showUserDropdown.value = false
  userResults.value = []
  runAccountCheck()
}

const onNisSearch = () => {
  if (nisSearchTimeout) clearTimeout(nisSearchTimeout)
  showNisDropdown.value = true
  searchingNis.value = true
  nisSearchTimeout = setTimeout(async () => {
    if (!nisSearchQuery.value.trim()) {
      nisResults.value = []
      searchingNis.value = false
      return
    }
    try {
      const res = await pointSubmissionService.searchNisAccounts(nisSearchQuery.value)
      if (res.success && res.data) {
        nisResults.value = res.data
      } else {
        nisResults.value = []
      }
    } catch {
      nisResults.value = []
    } finally {
      searchingNis.value = false
    }
  }, 300)
}

const accountWarning = ref('')

// Duplicate account submissions are ALLOWED — this only surfaces a non-blocking
// warning. Runs whenever both the referral and the account are chosen (in any order).
const runAccountCheck = async () => {
  accountWarning.value = ''
  if (!form.value.nisData || !form.value.userId) return
  const excludeId = props.submission?.id
  const result = await pointSubmissionService.checkAccount(form.value.nisData.custServId, form.value.userId, excludeId)
  if (result.existsForUser) {
    accountWarning.value = 'Referral ini sudah pernah menginput akun layanan yang sama'
  } else if (result.existsForOthers) {
    accountWarning.value = 'Akun layanan ini sudah diinput oleh referral lain'
  }
}

const selectNisAccount = async (account: NisAccount) => {
  form.value.nisData = account
  form.value.accountManager = account.accountManager || '-'
  nisSearchQuery.value = account.accountName
  showNisDropdown.value = false
  nisResults.value = []
  errors.value.nisData = ''
  await runAccountCheck()
}

// Close dropdowns on click outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserDropdown.value = false
    showNisDropdown.value = false
  }
}

watch(isOpen, (val) => {
  errors.value = {}

  if (val) {
    if (props.submission) {
      form.value = {
        userId: props.submission.user?.id || 0,
        type: props.submission.type,
        point: props.submission.point,
        price: props.submission.price,
        nisData: props.submission.nisData as any,
        accountManager: props.submission.nisData?.accountManager || '',
      }
      userSearchQuery.value = props.submission.user?.name || ''
      nisSearchQuery.value = props.submission.nisData?.accountName || ''
    } else {
      form.value = {
        userId: null,
        type: 'OTC',
        point: 0,
        price: 0,
        nisData: null,
        accountManager: '',
      }
      userSearchQuery.value = ''
      nisSearchQuery.value = ''
    }

    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('click', handleClickOutside)
    }
  } else {
    if (import.meta.client) {
      document.body.style.overflow = ''
      document.removeEventListener('click', handleClickOutside)
    }
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.removeEventListener('click', handleClickOutside)
  }
})

const handleSubmit = async () => {
  errors.value = {}
  
  const result = submissionSchema.safeParse(form.value)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
    return
  }

  emit('submit', {
    userId: form.value.userId,
    type: form.value.type,
    price: form.value.price,
    nisData: form.value.nisData,
  })
}
</script>
