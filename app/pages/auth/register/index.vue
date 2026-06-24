<template>
  <!-- Form Card -->
  <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
    <form @submit.prevent="handleSubmit">
      <!-- Informasi Pribadi -->
      <div class="px-4 md:px-8 py-6">
        <h3 class="text-base font-semibold text-neutral-800 mb-5">Informasi Pribadi</h3>

        <div class="space-y-4">
          <!-- Foto KTP -->
          <div class="w-full max-w-xs">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800 font-medium">Foto KTP<span class="text-red-500">*</span></span>
            </label>
            <div 
              v-if="!ktpPreview"
              @click="triggerKtpUpload"
              class="border-1 border-primary rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all w-fit"
            >
              <Upload class="w-4 h-4 text-primary" />
              <span class="text-sm text-primary font-medium">Unggah</span>
            </div>
            <div v-else class="relative w-fit mt-1">
              <img :src="ktpPreview" alt="KTP Preview" class="w-48 h-28 object-cover rounded-lg border border-base-200" />
              <button 
                type="button" 
                @click="removeKtp"
                class="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <input ref="ktpInput" type="file" accept="image/*" class="hidden" @change="handleKtpUpload" />
            <p v-if="errors.ktp" class="text-xs text-red-500 mt-1">{{ errors.ktp }}</p>
          </div>

          <!-- Nama Depan & Belakang -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Nama Depan<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.firstName"
                type="text" 
                placeholder="Masukkan Nama Depan"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">{{ errors.firstName }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Nama Belakang<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.lastName"
                type="text" 
                placeholder="Masukkan Nama Belakang"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- Tempat Tanggal Lahir & NIK -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Tempat dan Tanggal Lahir<span class="text-red-500">*</span></span>
              </label>
              <div 
                class="flex items-center border border-base-200 rounded-lg h-10 overflow-hidden transition-all"
                :class="{ 'border-red-500': errors.birthPlace || errors.birthDate }"
              >
                <input 
                  v-model="form.birthPlace"
                  type="text" 
                  placeholder="Tempat Lahir"
                  class="flex-1 h-full px-3 text-sm border-none outline-none bg-transparent"
                />
                <div class="w-px h-5 bg-base-200"></div>
                <input 
                  v-model="form.birthDate"
                  type="date"
                  class="flex-1 h-full px-3 text-sm border-none outline-none bg-transparent"
                />
              </div>
              <p v-if="errors.birthPlace" class="text-xs text-red-500 mt-1">{{ errors.birthPlace }}</p>
              <p v-if="errors.birthDate" class="text-xs text-red-500 mt-1">{{ errors.birthDate }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">NIK<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.identityNumber"
                type="text"
                inputmode="numeric"
                placeholder="Masukkan NIK"
                @input="form.identityNumber = ($event.target as HTMLInputElement).value.replace(/\D/g, '')"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                :class="{ 'border-red-500': errors.identityNumber }"
              />
              <p v-if="errors.identityNumber" class="text-xs text-red-500 mt-1">{{ errors.identityNumber }}</p>
            </div>
          </div>

          <!-- NPWP -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">NPWP<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.taxNumber"
                type="text"
                placeholder="Masukkan nomor NPWP"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                :class="{ 'border-red-500': errors.taxNumber }"
              />
              <p v-if="errors.taxNumber" class="text-xs text-red-500 mt-1">{{ errors.taxNumber }}</p>
            </div>
          </div>

          <!-- Email & Nomor Handphone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Alamat Email<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  v-model="form.email"
                  type="email" 
                  placeholder="Masukkan alamat email"
                  class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                  :class="{ 'border-red-500': errors.email }"
                />
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
              </div>
              <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Nomor Handphone<span class="text-red-500">*</span></span>
              </label>
              <div class="flex items-center gap-3">
                <div class="relative flex-1">
                  <input 
                    v-model="form.phone"
                    type="text"
                    inputmode="numeric"
                    placeholder="Masukkan No. Handphone Aktif"
                    @input="form.phone = ($event.target as HTMLInputElement).value.replace(/\D/g, '')"
                    class="input input-bordered w-full h-10 pl-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                    :class="{ 'border-red-500': errors.phone }"
                  />
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
                </div>
                <label class="label cursor-pointer gap-2 p-0 shrink-0">
                  <input type="checkbox" v-model="form.isWhatsapp" class="checkbox checkbox-sm checkbox-primary border-base-300 rounded" />
                  <span class="label-text text-sm text-neutral-600">Whatsapp</span>
                </label>
              </div>
              <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Alamat Rumah -->
          <div class="form-control w-full">
            <div class="flex items-center justify-between mb-1.5">
              <label class="label p-0">
                <span class="text-xs text-neutral-800 font-medium">Alamat Rumah<span class="text-red-500">*</span></span>
              </label>
              <span class="text-xs text-neutral-400">{{ form.address.length }}/110</span>
            </div>
            <textarea 
              v-model="form.address"
              placeholder="Isi Alamat Rumah"
              maxlength="110"
              rows="3"
              class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none resize-none"
              :class="{ 'border-red-500': errors.address }"
            ></textarea>
            <p v-if="errors.address" class="text-xs text-red-500 mt-1">{{ errors.address }}</p>
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
              <div 
                class="flex items-center border border-base-200 rounded-lg h-10 overflow-hidden transition-all"
                :class="{ 'border-red-500': errors.bankName || errors.accountNumber }"
              >
                <select 
                  v-model="form.bankName"
                  class="h-full px-3 text-sm border-none outline-none bg-transparent font-normal appearance-auto cursor-pointer"
                >
                  <option disabled value="">Pilih Bank</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BCA">BCA</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                </select>
                <div class="w-px h-5 bg-base-200"></div>
                <input 
                  v-model="form.accountNumber"
                  type="text"
                  inputmode="numeric"
                  placeholder="No Rekening"
                  @input="form.accountNumber = ($event.target as HTMLInputElement).value.replace(/\D/g, '')"
                  class="flex-1 h-full px-3 text-sm border-none outline-none bg-transparent"
                />
              </div>
              <p v-if="errors.bankName" class="text-xs text-red-500 mt-1">{{ errors.bankName }}</p>
              <p v-if="errors.accountNumber" class="text-xs text-red-500 mt-1">{{ errors.accountNumber }}</p>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800 font-medium">Atas Nama<span class="text-red-500">*</span></span>
              </label>
              <input 
                v-model="form.accountHolderName"
                type="text"
                placeholder="Atas Nama (Pemilik Rekening)"
                class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                :class="{ 'border-red-500': errors.accountHolderName }"
              />
              <p v-if="errors.accountHolderName" class="text-xs text-red-500 mt-1">{{ errors.accountHolderName }}</p>
            </div>
          </div>

          <!-- Foto Buku Rekening -->
          <div class="w-full max-w-xs">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800 font-medium">Foto Bagian Depan Buku Rekening<span class="text-red-500">*</span></span>
            </label>
            <div 
              v-if="!bankBookPreview"
              @click="triggerBankBookUpload"
              class="border-1 border-primary rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all w-fit"
            >
              <Upload class="w-4 h-4 text-primary" />
              <span class="text-sm text-primary font-medium">Unggah</span>
            </div>
            <div v-else class="relative w-fit mt-1">
              <img :src="bankBookPreview" alt="Bank Book Preview" class="w-48 h-28 object-cover rounded-lg border border-base-200" />
              <button 
                type="button" 
                @click="removeBankBook"
                class="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
            <input ref="bankBookInput" type="file" accept="image/*" class="hidden" @change="handleBankBookUpload" />
            <p v-if="errors.bankBook" class="text-xs text-red-500 mt-1">{{ errors.bankBook }}</p>
          </div>
        </div>
      </div>

      <!-- Perusahaan Toggle & Info -->
      <div class="px-4 md:px-8 py-6 border-t border-base-200">
        <div class="flex items-center gap-3 mb-5">
          <label class="label cursor-pointer gap-2 p-0">
            <input type="checkbox" v-model="hasCompany" class="checkbox checkbox-sm checkbox-primary border-base-300 rounded" />
            <span class="label-text text-sm font-medium text-neutral-800">Perusahaan</span>
          </label>
          <div class="tooltip" data-tip="Hapus centang apabila tidak ada data perusahaan">
            <Info class="w-4 h-4 text-neutral-400" />
          </div>
        </div>

        <div v-if="hasCompany">
          <h3 class="text-base font-semibold text-neutral-800 mb-5">Informasi Perusahaan</h3>

          <div class="space-y-4">
            <!-- Nama Perusahaan & Jabatan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div class="form-control w-full">
                <label class="label mb-1.5 p-0">
                  <span class="text-xs text-neutral-800 font-medium">Nama Perusahaan<span class="text-red-500">*</span></span>
                </label>
                <input 
                  v-model="form.company"
                  type="text"
                  placeholder="Nama Perusahaan"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                  :class="{ 'border-red-500': errors.company }"
                />
                <p v-if="errors.company" class="text-xs text-red-500 mt-1">{{ errors.company }}</p>
              </div>
              <div class="form-control w-full">
                <label class="label mb-1.5 p-0">
                  <span class="text-xs text-neutral-800 font-medium">Jabatan<span class="text-red-500">*</span></span>
                </label>
                <input 
                  v-model="form.jobPosition"
                  type="text"
                  placeholder="Jabatan di Perusahaan"
                  class="input input-bordered w-full h-10 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none"
                  :class="{ 'border-red-500': errors.jobPosition }"
                />
                <p v-if="errors.jobPosition" class="text-xs text-red-500 mt-1">{{ errors.jobPosition }}</p>
              </div>
            </div>

            <!-- Alamat Perusahaan -->
            <div class="form-control w-full">
              <div class="flex items-center justify-between mb-1.5">
                <label class="label p-0">
                  <span class="text-xs text-neutral-800 font-medium">Alamat Perusahaan<span class="text-red-500">*</span></span>
                </label>
                <span class="text-xs text-neutral-400">{{ form.companyAddress.length }}/110</span>
              </div>
              <textarea 
                v-model="form.companyAddress"
                placeholder="Isi Alamat Perusahaan"
                maxlength="110"
                rows="3"
                class="textarea textarea-bordered w-full border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none resize-none"
                :class="{ 'border-red-500': errors.companyAddress }"
              ></textarea>
              <p v-if="errors.companyAddress" class="text-xs text-red-500 mt-1">{{ errors.companyAddress }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 px-4 md:px-8 py-6 border-t border-base-200">
        <NuxtLink 
          to="/auth/sign-in"
          class="btn btn-outline border-primary text-primary hover:bg-primary hover:border-primary hover:text-white rounded-lg font-semibold"
        >
          Batalkan
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="btn bg-primary hover:bg-primary/80 border-none text-white rounded-lg font-semibold"
        >
          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <span v-else>Kirim Pendaftaran</span>
        </button>
      </div>
    </form>
  </div>
  <!-- Footer -->
  <div class="py-6">
    <p class="text-center text-sm text-gray-500">
      Butuh bantuan?
      <NuxtLink to="#" class="text-primary font-semibold hover:underline">Hubungi kami</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Upload, X, Mail, Phone, Info } from 'lucide-vue-next'
import { z } from 'zod'

definePageMeta({
  layout: 'onboarding',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Kawan Nusa | Daftar',
})

const toast = useToast()
const loading = ref(false)
const hasCompany = ref(true)
const errors = ref<Record<string, string>>({})

// File refs
const ktpInput = ref<HTMLInputElement | null>(null)
const bankBookInput = ref<HTMLInputElement | null>(null)
const ktpFile = ref<File | null>(null)
const bankBookFile = ref<File | null>(null)
const ktpPreview = ref<string | null>(null)
const bankBookPreview = ref<string | null>(null)

const form = reactive({
  firstName: '',
  lastName: '',
  birthPlace: '',
  birthDate: '',
  identityNumber: '',
  email: '',
  phone: '',
  isWhatsapp: true,
  address: '',
  bankName: '',
  accountNumber: '',
  accountHolderName: '',
  company: '',
  jobPosition: '',
  companyAddress: '',
  taxNumber: '',
})

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'Nama depan tidak boleh kosong'),
  lastName: z.string().min(1, 'Nama belakang tidak boleh kosong'),
  birthPlace: z.string().min(1, 'Tempat lahir tidak boleh kosong'),
  birthDate: z.string().min(1, 'Tanggal lahir tidak boleh kosong'),
  identityNumber: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  taxNumber: z.string().min(1, 'NPWP tidak boleh kosong'),
  email: z.string().min(1, 'Email tidak boleh kosong').email('Format email tidak valid'),
  phone: z.string().min(1, 'Nomor handphone tidak boleh kosong'),
  address: z.string().min(1, 'Alamat tidak boleh kosong').max(110, 'Alamat maksimal 110 karakter'),
  bankName: z.string().min(1, 'Pilih bank'),
  accountNumber: z.string().min(1, 'Nomor rekening tidak boleh kosong'),
  accountHolderName: z.string().min(1, 'Nama pemilik rekening tidak boleh kosong'),
})

// File upload handlers
const triggerKtpUpload = () => ktpInput.value?.click()
const triggerBankBookUpload = () => bankBookInput.value?.click()

const handleKtpUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    ktpFile.value = file
    ktpPreview.value = URL.createObjectURL(file)
  }
}

const handleBankBookUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    bankBookFile.value = file
    bankBookPreview.value = URL.createObjectURL(file)
  }
}

const removeKtp = () => {
  ktpFile.value = null
  ktpPreview.value = null
  if (ktpInput.value) ktpInput.value.value = ''
}

const removeBankBook = () => {
  bankBookFile.value = null
  bankBookPreview.value = null
  if (bankBookInput.value) bankBookInput.value.value = ''
}

const handleSubmit = async () => {
  if (loading.value) return

  errors.value = {}

  // Validate files
  if (!ktpFile.value) {
    errors.value.ktp = 'Foto KTP wajib diunggah'
  }
  if (!bankBookFile.value) {
    errors.value.bankBook = 'Foto buku rekening wajib diunggah'
  }

  // Validate form
  const result = registerSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0] as string] = issue.message
    })
  }

  // Validate company fields if toggled
  if (hasCompany.value) {
    if (!form.company) errors.value.company = 'Nama perusahaan tidak boleh kosong'
    if (!form.jobPosition) errors.value.jobPosition = 'Jabatan tidak boleh kosong'
    if (!form.companyAddress) errors.value.companyAddress = 'Alamat perusahaan tidak boleh kosong'
    if (form.companyAddress.length > 110) errors.value.companyAddress = 'Alamat perusahaan maksimal 110 karakter'
  }

  if (Object.keys(errors.value).length > 0) return

  loading.value = true
  try {
    // TODO: Implement register API call
    toast.success('Pendaftaran berhasil dikirim!')
    navigateTo('/auth/sign-in')
  } finally {
    loading.value = false
  }
}
</script>
