<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      <div class="absolute inset-0" @click="isOpen = false"></div>

      <div class="bg-white rounded-lg w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <h3 class="text-lg font-semibold text-neutral-800 leading-tight">{{ isEdit ? 'Ubah Rate Komisi' : 'Tambah Rate Komisi' }}</h3>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-4.5 h-4.5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-5 overflow-y-auto flex-1">
          <!-- Product / Service -->
          <div>
            <label class="label pb-1">
              <span class="label-text text-sm font-medium text-gray-700">Produk / Layanan <span class="text-red-500">*</span></span>
            </label>
            <select
              v-if="!isEdit"
              v-model="serviceCode"
              class="select select-bordered w-full text-sm h-10 rounded-lg border-gray-200 focus:border-primary bg-white font-medium"
              :class="{ 'border-red-500': errors.serviceCode }"
              :disabled="loading"
            >
              <option value="" disabled>Pilih produk atau layanan...</option>
              <option v-for="opt in productOptions" :key="opt.code" :value="opt.code">{{ opt.name }}</option>
            </select>
            <input
              v-else
              :value="rate?.service?.name"
              type="text"
              class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-gray-50 text-neutral-500"
              readonly
              disabled
            />
            <p v-if="errors.serviceCode" class="text-xs text-red-500 mt-1">{{ errors.serviceCode }}</p>
            <p v-else class="text-xs text-neutral-400 mt-1">
              Satu produk hanya punya satu rate komisi per tipe, berlaku untuk semua cabang. Produk yang tidak muncul berarti sudah punya rate OTC & Bulanan — gunakan "Ubah" pada baris yang sudah ada.
            </p>
          </div>

          <div class="border-t border-base-200"></div>

          <!-- Besaran Komisi -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Besaran Komisi <span class="text-red-500">*</span></span>
            </div>

            <!-- OTC card -->
            <div v-if="!isEdit || rate?.category === 'OTC'" class="border rounded-lg p-4 transition-colors" :class="otcEnabled ? 'border-primary bg-primary/5' : 'border-base-200'">
              <label class="flex items-start gap-3 cursor-pointer" :class="{ 'cursor-not-allowed opacity-60': isEdit || otcLocked }">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary checkbox-sm rounded mt-0.5"
                  v-model="otcEnabled"
                  :disabled="isEdit || otcLocked || loading"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-sm text-neutral-800">OTC — sekali saja</span>
                    <span class="badge badge-sm bg-blue-50 text-blue-600 border-blue-200 font-medium">One time charge</span>
                  </div>
                  <p class="text-xs text-neutral-500 mt-0.5">Poin diberikan satu kali saat pembayaran pertama customer terverifikasi.</p>
                  <p v-if="otcLocked" class="text-xs text-amber-600 mt-1">Produk ini sudah punya rate OTC — gunakan "Ubah" pada baris yang sudah ada.</p>
                </div>
              </label>

              <div v-if="otcEnabled" class="mt-4 pt-4 border-t border-dashed border-base-200 space-y-3">
                <div>
                  <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Tipe komisi OTC</span></label>
                  <select v-model="otcType" class="select select-bordered select-sm w-full text-sm h-9 rounded-lg border-gray-200 bg-white font-medium" :disabled="loading">
                    <option value="percentage">Persentase</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Besar komisi OTC <span class="text-red-500">*</span></span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">{{ otcType === 'percentage' ? '%' : 'Rp' }}</span>
                    <input v-model.number="otcValue" type="number" min="0" :max="otcType === 'percentage' ? 100 : undefined" step="any" placeholder="0" class="input input-bordered input-sm w-full text-sm h-9 rounded-lg border-gray-200 bg-white pl-9" :class="{ 'border-red-500': errors.otcValue }" :disabled="loading" />
                  </div>
                  <p v-if="errors.otcValue" class="text-xs text-red-500 mt-1">{{ errors.otcValue }}</p>
                </div>
                <RateSimulation :type="otcType" :value="otcValue" />
              </div>
            </div>

            <!-- Bulanan card -->
            <div v-if="!isEdit || rate?.category === 'Bulanan'" class="border rounded-lg p-4 transition-colors" :class="bulananEnabled ? 'border-primary bg-primary/5' : 'border-base-200'">
              <label class="flex items-start gap-3 cursor-pointer" :class="{ 'cursor-not-allowed opacity-60': isEdit || bulananLocked }">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary checkbox-sm rounded mt-0.5"
                  v-model="bulananEnabled"
                  :disabled="isEdit || bulananLocked || loading"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-semibold text-sm text-neutral-800">Bulanan — berulang</span>
                    <span class="badge badge-sm bg-purple-50 text-purple-600 border-purple-200 font-medium">Recurring</span>
                  </div>
                  <p class="text-xs text-neutral-500 mt-0.5">Poin diberikan tiap bulan selama customer masih berlangganan.</p>
                  <p v-if="bulananLocked" class="text-xs text-amber-600 mt-1">Produk ini sudah punya rate Bulanan — gunakan "Ubah" pada baris yang sudah ada.</p>
                </div>
              </label>

              <div v-if="bulananEnabled" class="mt-4 pt-4 border-t border-dashed border-base-200 space-y-3">
                <div>
                  <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Tipe komisi Bulanan</span></label>
                  <select v-model="bulananType" class="select select-bordered select-sm w-full text-sm h-9 rounded-lg border-gray-200 bg-white font-medium" :disabled="loading">
                    <option value="percentage">Persentase</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label class="label pb-1"><span class="label-text text-xs font-medium text-gray-700">Besar komisi Bulanan <span class="text-red-500">*</span></span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium z-10 pointer-events-none">{{ bulananType === 'percentage' ? '%' : 'Rp' }}</span>
                    <input v-model.number="bulananValue" type="number" min="0" :max="bulananType === 'percentage' ? 100 : undefined" step="any" placeholder="0" class="input input-bordered input-sm w-full text-sm h-9 rounded-lg border-gray-200 bg-white pl-9" :class="{ 'border-red-500': errors.bulananValue }" :disabled="loading" />
                  </div>
                  <p v-if="errors.bulananValue" class="text-xs text-red-500 mt-1">{{ errors.bulananValue }}</p>
                </div>
                <RateSimulation :type="bulananType" :value="bulananValue" />
              </div>
            </div>

            <p v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</p>
          </div>

          <div class="border-t border-base-200"></div>

          <!-- Periode Berlaku -->
          <div class="space-y-3">
            <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Periode Berlaku</span>

            <label v-if="bothActive" class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" class="checkbox checkbox-primary checkbox-sm rounded" v-model="sharedPeriod" :disabled="loading" />
              <span class="text-sm text-neutral-600">Gunakan periode yang sama untuk OTC & Bulanan</span>
            </label>

            <template v-if="!bothActive || sharedPeriod">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label pb-1"><span class="label-text text-sm font-medium text-gray-700">Mulai berlaku <span class="text-red-500">*</span></span></label>
                  <input v-model="startDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.startDate }" :disabled="loading" />
                  <p v-if="errors.startDate" class="text-xs text-red-500 mt-1">{{ errors.startDate }}</p>
                </div>
                <div>
                  <label class="label pb-1"><span class="label-text text-sm font-medium text-gray-700">Berakhir</span></label>
                  <input v-model="endDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.endDate }" :disabled="loading" />
                  <p v-if="errors.endDate" class="text-xs text-red-500 mt-1">{{ errors.endDate }}</p>
                </div>
              </div>
              <p class="text-xs text-neutral-400">Kosongkan tanggal berakhir kalau rate berlaku tanpa batas waktu. Rate yang mulai berlakunya di masa depan akan berstatus <span class="font-medium text-neutral-500">Terjadwal</span>.</p>
            </template>

            <template v-else>
              <div v-if="otcEnabled" class="space-y-1">
                <span class="text-xs font-medium text-neutral-500">Periode OTC</span>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input v-model="otcStartDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.otcStartDate }" :disabled="loading" />
                    <p v-if="errors.otcStartDate" class="text-xs text-red-500 mt-1">{{ errors.otcStartDate }}</p>
                  </div>
                  <div>
                    <input v-model="otcEndDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.otcEndDate }" :disabled="loading" />
                    <p v-if="errors.otcEndDate" class="text-xs text-red-500 mt-1">{{ errors.otcEndDate }}</p>
                  </div>
                </div>
              </div>
              <div v-if="bulananEnabled" class="space-y-1">
                <span class="text-xs font-medium text-neutral-500">Periode Bulanan</span>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <input v-model="bulananStartDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.bulananStartDate }" :disabled="loading" />
                    <p v-if="errors.bulananStartDate" class="text-xs text-red-500 mt-1">{{ errors.bulananStartDate }}</p>
                  </div>
                  <div>
                    <input v-model="bulananEndDate" type="date" class="input input-bordered w-full text-sm h-10 rounded-lg border-gray-200 bg-white font-medium" :class="{ 'border-red-500': errors.bulananEndDate }" :disabled="loading" />
                    <p v-if="errors.bulananEndDate" class="text-xs text-red-500 mt-1">{{ errors.bulananEndDate }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Notes -->
          <div>
            <label class="label pb-1"><span class="label-text text-sm font-medium text-gray-700">Catatan</span></label>
            <textarea
              v-model="notes"
              rows="2"
              placeholder="Contoh: penyesuaian komisi Q4 sesuai keputusan rapat marketing"
              class="textarea textarea-bordered w-full text-sm rounded-lg border-gray-200 focus:border-primary bg-white font-medium"
              :disabled="loading"
            ></textarea>
          </div>

          <!-- Footer -->
          <div class="px-6 py-5 bg-neutral-50/30 flex items-center justify-end gap-3 border-t border-base-200 -mx-6 -mb-6 mt-6">
            <button type="button" @click="isOpen = false" :disabled="loading" class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">Batal</button>
            <button type="submit" :disabled="loading" class="btn btn-primary rounded-lg px-6 min-w-[120px]">
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
import { rateCommissionService } from '~/services/rate-commission-service'
import { additionalService } from '~/services/additional-service'
import type { RateCommission, RateCommissionCategory, RateCommissionValueType, RateCommissionSubmitItem } from '~/types/rate-commission'

const props = defineProps<{
  rate?: RateCommission | null
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })
const emit = defineEmits<{ submit: [items: RateCommissionSubmitItem[]] }>()

const isEdit = computed(() => !!props.rate?.id)

const allServices = ref<{ code: string; name: string }[]>([])
const takenOtc = ref<string[]>([])
const takenBulanan = ref<string[]>([])

const productOptions = computed(() => {
  return allServices.value.filter(s => !(takenOtc.value.includes(s.code) && takenBulanan.value.includes(s.code)))
})

const serviceCode = ref('')
const otcLocked = computed(() => !isEdit.value && !!serviceCode.value && takenOtc.value.includes(serviceCode.value))
const bulananLocked = computed(() => !isEdit.value && !!serviceCode.value && takenBulanan.value.includes(serviceCode.value))

const otcEnabled = ref(false)
const otcType = ref<RateCommissionValueType>('percentage')
const otcValue = ref<number>(0)
const otcStartDate = ref('')
const otcEndDate = ref('')

const bulananEnabled = ref(false)
const bulananType = ref<RateCommissionValueType>('percentage')
const bulananValue = ref<number>(0)
const bulananStartDate = ref('')
const bulananEndDate = ref('')

const bothActive = computed(() => otcEnabled.value && bulananEnabled.value)
const sharedPeriod = ref(true)
const startDate = ref('')
const endDate = ref('')

const notes = ref('')
const errors = ref<Record<string, string>>({})

watch(serviceCode, () => {
  if (otcLocked.value) otcEnabled.value = false
  if (bulananLocked.value) bulananEnabled.value = false
})

const fetchOptions = async () => {
  const [services, otc, bulanan] = await Promise.all([
    additionalService.getServices(),
    rateCommissionService.getTakenServices('OTC'),
    rateCommissionService.getTakenServices('Bulanan'),
  ])
  if (services?.success) allServices.value = services.data
  if (otc?.success) takenOtc.value = otc.data
  if (bulanan?.success) takenBulanan.value = bulanan.data
}

watch(isOpen, (val) => {
  errors.value = {}
  if (!val) {
    if (import.meta.client) document.body.style.overflow = ''
    return
  }

  if (import.meta.client) document.body.style.overflow = 'hidden'
  fetchOptions()

  if (isEdit.value && props.rate) {
    serviceCode.value = props.rate.service?.code || ''
    const isOtc = props.rate.category === 'OTC'
    otcEnabled.value = isOtc
    bulananEnabled.value = !isOtc
    if (isOtc) {
      otcType.value = props.rate.type
      otcValue.value = props.rate.value
    } else {
      bulananType.value = props.rate.type
      bulananValue.value = props.rate.value
    }
    startDate.value = props.rate.startDate.slice(0, 10)
    endDate.value = props.rate.endDate ? props.rate.endDate.slice(0, 10) : ''
    notes.value = props.rate.notes || ''
  } else {
    serviceCode.value = ''
    otcEnabled.value = false
    bulananEnabled.value = false
    otcType.value = 'percentage'
    bulananType.value = 'percentage'
    otcValue.value = 0
    bulananValue.value = 0
    sharedPeriod.value = true
    startDate.value = new Date().toISOString().slice(0, 10)
    endDate.value = ''
    otcStartDate.value = ''
    otcEndDate.value = ''
    bulananStartDate.value = ''
    bulananEndDate.value = ''
    notes.value = ''
  }
})

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

const validateValue = (type: RateCommissionValueType, val: number): string | null => {
  if (val === null || val === undefined || isNaN(Number(val)) || val < 0) return 'Nilai harus berupa angka ≥ 0'
  if (type === 'percentage' && val > 100) return 'Nilai persentase tidak boleh lebih dari 100'
  return null
}

const validateRange = (start: string, end: string): string | null => {
  if (start && end && end < start) return 'Tidak boleh sebelum tanggal mulai'
  return null
}

const handleSubmit = () => {
  errors.value = {}

  if (!isEdit.value && !serviceCode.value) {
    errors.value.serviceCode = 'Produk/layanan wajib dipilih'
  }
  if (!otcEnabled.value && !bulananEnabled.value) {
    errors.value.type = 'Aktifkan minimal satu tipe komisi di atas'
  }

  if (otcEnabled.value) {
    const err = validateValue(otcType.value, otcValue.value)
    if (err) errors.value.otcValue = err
  }
  if (bulananEnabled.value) {
    const err = validateValue(bulananType.value, bulananValue.value)
    if (err) errors.value.bulananValue = err
  }

  const useShared = !bothActive.value || sharedPeriod.value
  if (useShared) {
    if (!startDate.value) errors.value.startDate = 'Tanggal mulai berlaku wajib diisi'
    const err = validateRange(startDate.value, endDate.value)
    if (err) errors.value.endDate = err
  } else {
    if (otcEnabled.value) {
      if (!otcStartDate.value) errors.value.otcStartDate = 'Wajib diisi'
      const err = validateRange(otcStartDate.value, otcEndDate.value)
      if (err) errors.value.otcEndDate = err
    }
    if (bulananEnabled.value) {
      if (!bulananStartDate.value) errors.value.bulananStartDate = 'Wajib diisi'
      const err = validateRange(bulananStartDate.value, bulananEndDate.value)
      if (err) errors.value.bulananEndDate = err
    }
  }

  if (Object.keys(errors.value).length > 0) return

  const datesFor = (category: RateCommissionCategory): [string, string] => {
    if (!useShared) {
      return category === 'OTC' ? [otcStartDate.value, otcEndDate.value] : [bulananStartDate.value, bulananEndDate.value]
    }
    return [startDate.value, endDate.value]
  }

  const items: RateCommissionSubmitItem[] = []
  if (otcEnabled.value) {
    const [sd, ed] = datesFor('OTC')
    items.push({
      category: 'OTC',
      serviceCode: !isEdit.value ? serviceCode.value : undefined,
      value: Number(otcValue.value),
      type: otcType.value,
      startDate: sd,
      endDate: ed || null,
      notes: notes.value || null,
    })
  }
  if (bulananEnabled.value) {
    const [sd, ed] = datesFor('Bulanan')
    items.push({
      category: 'Bulanan',
      serviceCode: !isEdit.value ? serviceCode.value : undefined,
      value: Number(bulananValue.value),
      type: bulananType.value,
      startDate: sd,
      endDate: ed || null,
      notes: notes.value || null,
    })
  }

  emit('submit', items)
}
</script>
