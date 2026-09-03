<template>
  <div class="flex flex-col w-full max-w-4xl pb-10">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Unduh Laporan</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Unduh Laporan
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <NuxtLink
          to="/report/history"
          class="btn btn-outline btn-sm h-10 w-10 p-0 rounded-lg flex items-center justify-center"
          title="Riwayat Unduhan"
        >
          <History class="w-4.5 h-4.5" />
        </NuxtLink>
      </template>
    </AppToolbar>

    <p class="text-sm text-neutral-500 -mt-2 mb-4">
      Rekap data referral untuk rekonsiliasi dan pembukuan. Pilih jenis laporan, tentukan periode dan format berkas, lalu unduh. Berkas dibuat berdasarkan data pada saat unduhan dijalankan.
    </p>

    <div class="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3 mb-4">
      <Info class="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
      <p class="text-sm text-neutral-700">
        <span class="font-semibold">Konversi poin:</span> 1 poin = Rp1.000. Nominal tunai pada laporan sudah dipotong PPh sesuai pengaturan pajak, dan setiap laporan mencantumkan kolom bruto, pajak, dan netto secara terpisah.
      </p>
    </div>

    <div class="card bg-white border border-base-200 rounded-lg">
      <div class="card-body p-6 space-y-6">
        <!-- 1. Jenis Laporan -->
        <section>
          <h3 class="text-sm font-semibold text-neutral-800 mb-3">1 &middot; Jenis Laporan</h3>
          <select v-model="form.type" class="select select-bordered w-full max-w-md rounded-lg text-sm h-10 font-medium">
            <option v-for="rt in REPORT_TYPES" :key="rt.value" :value="rt.value">{{ rt.label }}</option>
          </select>
          <p class="text-xs text-neutral-400 mt-1.5">{{ selectedType.description }}</p>
        </section>

        <hr class="border-base-200" />

        <!-- 2. Periode -->
        <section v-if="form.type !== 'point_balance'">
          <h3 class="text-sm font-semibold text-neutral-800 mb-1">2 &middot; Periode</h3>
          <p class="text-xs text-neutral-400 mb-3">Pilih rentang cepat atau tentukan tanggal sendiri.</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="preset in QUICK_RANGES"
              :key="preset.value"
              type="button"
              @click="applyQuickRange(preset.value)"
              class="btn btn-sm rounded-full font-medium"
              :class="activePreset === preset.value ? 'btn-primary' : 'btn-outline'"
            >
              {{ preset.label }}
            </button>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1">
              <label class="text-xs text-neutral-500 font-medium mb-1 block">Dari tanggal</label>
              <input v-model="form.dateFrom" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" @change="activePreset = 'kustom'" />
            </div>
            <div class="flex-1">
              <label class="text-xs text-neutral-500 font-medium mb-1 block">Sampai tanggal</label>
              <input v-model="form.dateTo" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" @change="activePreset = 'kustom'" />
            </div>
          </div>

          <div class="max-w-xs">
            <label class="text-xs text-neutral-500 font-medium mb-1 block">Basis tanggal</label>
            <select v-model="form.basis" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
              <option value="submission">{{ selectedType.basisLabels.submission }}</option>
              <option value="completion">{{ selectedType.basisLabels.completion }}</option>
            </select>
          </div>
        </section>

        <section v-else>
          <h3 class="text-sm font-semibold text-neutral-800 mb-1">2 &middot; Periode</h3>
          <p class="text-xs text-neutral-400 mb-3">Saldo poin bersifat kumulatif, jadi laporan ini diambil sebagai posisi pada satu tanggal.</p>
          <div class="max-w-xs">
            <label class="text-xs text-neutral-500 font-medium mb-1 block">Posisi saldo per tanggal</label>
            <input v-model="form.snapshotDate" type="date" class="input input-bordered w-full rounded-lg text-sm h-10 font-medium" />
          </div>
        </section>

        <hr class="border-base-200" />

        <!-- 3. Filter -->
        <section>
          <h3 class="text-sm font-semibold text-neutral-800 mb-1">3 &middot; Filter <span class="text-neutral-400 font-normal">(opsional)</span></h3>
          <p class="text-xs text-neutral-400 mb-3">Kosongkan untuk mengambil seluruh data pada periode di atas.</p>

          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="flex-1">
              <label class="text-xs text-neutral-500 font-medium mb-1 block">Cabang</label>
              <select v-model="form.branchCode" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                <option value="">Semua Cabang</option>
                <option v-for="b in branchOptions" :key="b.code" :value="b.code">{{ b.name }}</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="text-xs text-neutral-500 font-medium mb-1 block">Nama Layanan</label>
              <select v-model="form.serviceCode" class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                <option value="">Semua Layanan</option>
                <option v-for="s in serviceOptions" :key="s.code" :value="s.code">{{ s.name }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-xs text-neutral-500 font-medium mb-1 block">{{ selectedType.statusLabel }}</label>
            <p class="text-[11px] text-neutral-400 mb-2">Bisa pilih lebih dari satu. Tidak dipilih = semua status.</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in selectedType.statusOptions"
                :key="opt.value"
                type="button"
                @click="toggleStatus(opt.value)"
                class="btn btn-sm rounded-full font-medium"
                :class="form.statuses.includes(opt.value) ? 'btn-primary' : 'btn-outline'"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </section>

        <hr class="border-base-200" />

        <!-- 4. Format Berkas -->
        <section>
          <h3 class="text-sm font-semibold text-neutral-800 mb-3">4 &middot; Format Berkas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <label
              class="border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors"
              :class="form.format === 'xlsx' ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-neutral-300'"
            >
              <FileSpreadsheet class="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-neutral-800">XLSX</p>
                <p class="text-xs text-neutral-400 mt-0.5">Header berformat, kolom angka siap dijumlah, plus sheet ringkasan.</p>
              </div>
              <input type="radio" value="xlsx" v-model="form.format" class="radio radio-primary radio-sm shrink-0" />
            </label>
            <label
              class="border rounded-lg p-4 flex items-start gap-3 cursor-pointer transition-colors"
              :class="form.format === 'csv' ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-neutral-300'"
            >
              <FileText class="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-neutral-800">CSV</p>
                <p class="text-xs text-neutral-400 mt-0.5">Berkas ringan, delimiter koma, UTF-8. Cocok untuk impor ke sistem akuntansi.</p>
              </div>
              <input type="radio" value="csv" v-model="form.format" class="radio radio-primary radio-sm shrink-0" />
            </label>
          </div>

          <div class="space-y-2">
            <label class="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" v-model="form.includeSummary" class="checkbox checkbox-primary checkbox-sm mt-0.5" />
              <span>
                <span class="text-sm text-neutral-800 font-medium block">Sertakan baris ringkasan</span>
                <span class="text-xs text-neutral-400">Subtotal per cabang dan grand total di akhir berkas.</span>
              </span>
            </label>
            <label class="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" v-model="form.maskSensitive" class="checkbox checkbox-primary checkbox-sm mt-0.5" />
              <span>
                <span class="text-sm text-neutral-800 font-medium block">Samarkan nomor rekening &amp; NPWP</span>
                <span class="text-xs text-neutral-400">Hanya 4 digit terakhir yang ditampilkan. Gunakan bila berkas dibagikan ke luar tim.</span>
              </span>
            </label>
          </div>
        </section>

        <!-- Preview -->
        <div v-if="previewResult" class="border border-base-200 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2.5 bg-base-50 border-b border-base-200">
            <p class="text-xs font-medium text-neutral-600">
              Preview — menampilkan {{ previewResult.rows.length }} dari {{ previewResult.totalRows }} baris
            </p>
            <button @click="previewResult = null" class="text-neutral-400 hover:text-neutral-800">
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-x-auto max-h-80">
            <table class="table table-sm w-full">
              <thead>
                <tr class="text-neutral-400 text-xs font-medium border-b border-base-200 bg-base-50">
                  <th v-for="col in previewResult.columns" :key="col.key" class="font-medium whitespace-nowrap">{{ col.header }}</th>
                </tr>
              </thead>
              <tbody class="text-xs text-neutral-600">
                <tr v-for="(row, idx) in previewResult.rows" :key="idx" class="border-b border-base-100 last:border-0">
                  <td v-for="col in previewResult.columns" :key="col.key" class="whitespace-nowrap">{{ row[col.key] ?? '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-base-200">
          <p class="text-xs text-neutral-400">
            {{ form.format ? `Format terpilih: ${form.format.toUpperCase()} (.${form.format})` : 'Pilih format berkas untuk melihat estimasi.' }}
          </p>
          <div class="flex items-center gap-2">
            <button @click="handleReset" class="btn btn-outline btn-sm rounded-lg font-medium">Atur Ulang</button>
            <button @click="handlePreview" :disabled="previewing" class="btn btn-outline btn-sm rounded-lg font-medium">
              <span v-if="previewing" class="loading loading-spinner loading-xs"></span>
              Tampilkan Preview
            </button>
            <button @click="handleDownload" :disabled="!form.format || downloading" class="btn btn-primary btn-sm rounded-lg font-medium gap-1.5">
              <span v-if="downloading" class="loading loading-spinner loading-xs"></span>
              <Download v-else class="w-4 h-4" />
              Unduh Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, History, Info, FileSpreadsheet, FileText, Download, X } from 'lucide-vue-next'
import { reportService } from '~/services/report-service'
import { additionalService } from '~/services/additional-service'
import { toISODate } from '~/utils/date'
import type { ReportType, ReportFormat, ReportDateBasis } from '~/types/report'
import type { AdditionalItem } from '~/types/additional'

definePageMeta({
  role: 'admin',
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Admin - Unduh Laporan',
})

const toast = useToast()

interface ReportTypeConfig {
  value: ReportType
  label: string
  description: string
  statusLabel: string
  statusOptions: { value: string; label: string }[]
  basisLabels: { submission: string; completion: string }
}

const REPORT_TYPES: ReportTypeConfig[] = [
  {
    value: 'cash_redemption',
    label: 'Rekap Tukar Poin Tunai',
    description: 'Pencairan poin ke rekening referral',
    statusLabel: 'Status Transaksi',
    statusOptions: [
      { value: 'belum_transfer', label: 'Belum di Transfer' },
      { value: 'sudah_transfer', label: 'Sudah di Transfer' },
    ],
    basisLabels: { submission: 'Tanggal Pengajuan', completion: 'Tanggal Transfer' },
  },
  {
    value: 'product_voucher_redemption',
    label: 'Rekap Tukar Poin Produk & Voucher',
    description: 'Redeem barang fisik dan voucher',
    statusLabel: 'Status Transaksi',
    statusOptions: [
      { value: 'pending', label: 'Pending' },
      { value: 'diproses', label: 'Diproses' },
      { value: 'selesai', label: 'Selesai' },
    ],
    basisLabels: { submission: 'Tanggal Pengajuan', completion: 'Tanggal Selesai' },
  },
  {
    value: 'referral_point',
    label: 'Rekap Poin Referral',
    description: 'Komisi dan poin terbit dari transaksi customer yang direferensikan',
    statusLabel: 'Status Persetujuan',
    statusOptions: [
      { value: 'belum_disetujui', label: 'Belum Disetujui' },
      { value: 'sudah_disetujui', label: 'Sudah Disetujui' },
      { value: 'ditolak', label: 'Ditolak' },
    ],
    basisLabels: { submission: 'Tanggal Transaksi', completion: 'Tanggal Disetujui' },
  },
  {
    value: 'point_balance',
    label: 'Saldo Poin & Data Referral',
    description: 'Liabilitas poin per tanggal tertentu',
    statusLabel: 'Status Akun',
    statusOptions: [
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
    basisLabels: { submission: '-', completion: '-' },
  },
]

const QUICK_RANGES: { value: string; label: string }[] = [
  { value: 'bulan_ini', label: 'Bulan Ini' },
  { value: 'bulan_lalu', label: 'Bulan Lalu' },
  { value: '30_hari', label: '30 Hari Terakhir' },
  { value: 'kuartal', label: 'Kuartal Berjalan' },
  { value: 'tahun', label: 'Tahun Berjalan' },
  { value: 'kustom', label: 'Kustom' },
]

const form = reactive({
  type: 'cash_redemption' as ReportType,
  dateFrom: '',
  dateTo: '',
  snapshotDate: toISODate(new Date()),
  basis: 'submission' as ReportDateBasis,
  branchCode: '',
  serviceCode: '',
  statuses: [] as string[],
  format: '' as ReportFormat | '',
  includeSummary: false,
  maskSensitive: false,
})

const activePreset = ref('bulan_ini')

const selectedType = computed(() => REPORT_TYPES.find(rt => rt.value === form.type) ?? REPORT_TYPES[0]!)

watch(() => form.type, () => {
  form.statuses = []
})

const applyQuickRange = (preset: string) => {
  activePreset.value = preset
  const today = new Date()

  if (preset === 'bulan_ini') {
    form.dateFrom = toISODate(new Date(today.getFullYear(), today.getMonth(), 1))
    form.dateTo = toISODate(today)
  } else if (preset === 'bulan_lalu') {
    form.dateFrom = toISODate(new Date(today.getFullYear(), today.getMonth() - 1, 1))
    form.dateTo = toISODate(new Date(today.getFullYear(), today.getMonth(), 0))
  } else if (preset === '30_hari') {
    form.dateFrom = toISODate(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000))
    form.dateTo = toISODate(today)
  } else if (preset === 'kuartal') {
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3
    form.dateFrom = toISODate(new Date(today.getFullYear(), quarterStartMonth, 1))
    form.dateTo = toISODate(today)
  } else if (preset === 'tahun') {
    form.dateFrom = toISODate(new Date(today.getFullYear(), 0, 1))
    form.dateTo = toISODate(today)
  }
}
applyQuickRange('bulan_ini')

const toggleStatus = (value: string) => {
  const idx = form.statuses.indexOf(value)
  if (idx >= 0) form.statuses.splice(idx, 1)
  else form.statuses.push(value)
}

const branchOptions = ref<AdditionalItem[]>([])
const serviceOptions = ref<AdditionalItem[]>([])

const fetchFilterOptions = async () => {
  const [branches, services] = await Promise.all([
    additionalService.getBranches(),
    additionalService.getServices(),
  ])
  if (branches?.success) branchOptions.value = branches.data
  if (services?.success) serviceOptions.value = services.data
}

const buildParams = (format?: ReportFormat) => ({
  type: form.type,
  format: format || undefined,
  dateFrom: form.type !== 'point_balance' ? (form.dateFrom || undefined) : undefined,
  dateTo: form.type !== 'point_balance' ? (form.dateTo || undefined) : undefined,
  snapshotDate: form.type === 'point_balance' ? form.snapshotDate : undefined,
  basis: form.type !== 'point_balance' ? form.basis : undefined,
  branchCode: form.branchCode || undefined,
  serviceCode: form.serviceCode || undefined,
  statuses: form.statuses.length ? form.statuses : undefined,
  includeSummary: form.includeSummary,
  maskSensitive: form.maskSensitive,
})

const previewing = ref(false)
const previewResult = ref<{ columns: { header: string; key: string }[]; rows: Record<string, any>[]; totalRows: number } | null>(null)

const handlePreview = async () => {
  previewing.value = true
  try {
    const res = await reportService.getPreview(buildParams())
    if (res.success && res.data) {
      previewResult.value = res.data
    } else {
      toast.error(res.message || 'Gagal menampilkan preview laporan')
    }
  } finally {
    previewing.value = false
  }
}

const downloading = ref(false)

const handleDownload = async () => {
  if (!form.format) return
  downloading.value = true
  try {
    const { blob, filename } = await reportService.downloadReport(buildParams(form.format))
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Laporan berhasil diunduh')
  } finally {
    downloading.value = false
  }
}

const handleReset = () => {
  form.branchCode = ''
  form.serviceCode = ''
  form.statuses = []
  form.format = ''
  form.includeSummary = false
  form.maskSensitive = false
  form.basis = 'submission'
  form.snapshotDate = toISODate(new Date())
  applyQuickRange('bulan_ini')
  previewResult.value = null
}

onMounted(() => {
  fetchFilterOptions()
})
</script>
