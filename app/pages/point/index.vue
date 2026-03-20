<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Point Saya</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              Ringkasan perolehan dan penarikan poin referral Anda
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-9 h-full">
          <AreaChart
            :data="AreaChartData"
            :height="400"
            :categories="categories"
            :y-num-ticks="5"
            :x-num-ticks="7"
            :y-grid-line="true"
            :hide-legend="true"
            :x-formatter="xFormatter"
            :curve-type="CurveType.Linear"
          />
        </div>
        <div class="lg:col-span-3 h-full">
          <div class="card bg-white border border-base-200">
            <div class="card-body">
              <h1 class="text-neutral-700 font-medium flex gap-2">
                <Coins class="w-5 h-5 text-primary" />
                Total Point Saya
              </h1>
              <div class="flex items-center gap-2">
                <span class="text-neutral-800 font-medium text-3xl">1874</span>
                <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
              </div>
              <button 
                @click="isWithdrawModalOpen = true"
                class="btn btn-primary btn-sm rounded-lg text-sm h-8 w-full mt-3 font-semibold"
              >
                Tarik Poin
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalWithdraw v-model="isWithdrawModalOpen" />

      <div class="flex flex-col gap-6 w-full pt-10">
        <!-- Tabs Section -->
        <div class="flex items-center gap-8 border-b border-base-200">
          <button 
            @click="activeTab = 'incoming'"
            :class="[
              'pb-3 font-medium transition-all relative',
              activeTab === 'incoming' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800'
            ]"
          >
            Poin Masuk
            <div v-if="activeTab === 'incoming'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </button>
          <button 
            @click="activeTab = 'withdrawn'"
            :class="[
              'pb-3 font-medium transition-all relative',
              activeTab === 'withdrawn' ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800'
            ]"
          >
            Sudah Ditarik
            <div v-if="activeTab === 'withdrawn'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full"></div>
          </button>
        </div>

        <DataTable 
          flat 
          :columns="currentColumns"
          :loading="loading"
          :is-empty="!loading && currentData.length === 0"
          v-model:search-query="searchQuery"
        >
          <template #filters>
            <div class="dropdown dropdown-bottom md:dropdown-start">
              <div tabindex="0" role="button" class="btn btn-outline border-primary text-primary btn-md h-10 px-4 gap-2 rounded-lg hover:bg-base-200 transition-colors w-full md:w-auto">
                <Filter class="w-4 h-4" />
                Filter
              </div>
              <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[450px] shadow-xl border border-base-200 mt-2 left-0 md:left-auto">
                <div class="card-body p-0">
                  <div class="flex items-center justify-between px-6 py-4 border-b border-base-200">
                    <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                    <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                  </div>
                  <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-neutral-400 text-xs font-medium">Tanggal Aktif</span>
                        <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                          <label class="text-xs font-medium text-neutral-800">Dari:</label>
                          <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                        </div>
                        <div class="space-y-1.5">
                          <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                          <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-neutral-400 text-xs font-medium">Status</span>
                        <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                      </div>
                      <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                        <option selected disabled>Semua Status</option>
                        <option>Aktif</option>
                        <option>Dihentikan</option>
                      </select>
                    </div>
                  </div>
                  <div class="p-4 border-t border-base-200 flex items-center justify-between">
                    <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">Atur Ulang</button>
                    <button class="btn bg-primary border-none text-white hover:bg-primary/90 btn-sm rounded-lg text-sm font-semibold h-10 px-6">Terapkan</button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #body="{ isColumnVisible }">
            <tbody v-if="activeTab === 'incoming'" class="text-sm text-neutral-600">
              <tr v-for="(item, index) in filteredIncoming" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
                <td v-show="isColumnVisible('waktu')" class="py-3 border-r border-base-200 ps-4">{{ item.waktu }}</td>
                <td v-show="isColumnVisible('jumlah')" class="py-3 border-r border-base-200 ps-4">{{ item.jumlah }}</td>
                <td v-show="isColumnVisible('pelanggan')" class="py-3 border-r border-base-200 ps-4">
                  <span class="text-primary font-medium">{{ item.pelanggan.name }}</span>
                  <span class="text-primary ml-1">- {{ item.pelanggan.id }}</span>
                </td>
                <td v-show="isColumnVisible('layanan')" class="py-3 border-r border-base-200 ps-4 text-primary font-medium">{{ item.layanan }}</td>
                <td v-show="isColumnVisible('periode')" class="py-3 border-r border-base-200 ps-4">{{ item.periode }}</td>
                <td v-show="isColumnVisible('tipe')" class="py-3 ps-4">{{ item.tipe }}</td>
              </tr>
            </tbody>

            <tbody v-else class="text-sm text-neutral-600">
              <tr v-for="(item, index) in filteredWithdrawn" :key="index" class="hover:bg-base-100/30 transition-colors border-b border-base-100 last:border-0">
                <td v-show="isColumnVisible('waktu')" class="py-3 border-r border-base-200 ps-4">{{ item.waktu }}</td>
                <td v-show="isColumnVisible('poin')" class="py-3 border-r border-base-200 ps-4">{{ item.poin }}</td>
                <td v-show="isColumnVisible('bank')" class="py-3 border-r border-base-200 ps-4">{{ item.bank }}</td>
                <td v-show="isColumnVisible('rekening')" class="py-3 border-r border-base-200 ps-4">{{ item.rekening }}</td>
                <td v-show="isColumnVisible('penerima')" class="py-3 border-r border-base-200 ps-4">{{ item.penerima }}</td>
                <td v-show="isColumnVisible('nota')" class="py-3 ps-4 flex items-center justify-between pr-4 gap-2">
                  <span class="text-primary font-medium underline truncate cursor-pointer">{{ item.nota }}</span>
                  <Download class="w-4 h-4 text-primary shrink-0 cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CircleHelp, ListFilter, X, 
  Coins, Download,
  Filter
} from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-white'
})

const isWithdrawModalOpen = ref(false)
const activeTab = ref('incoming')
const loading = ref(false)
const searchQuery = ref('')

const currentColumns = computed(() => {
  if (activeTab.value === 'incoming') {
    return [
      { label: 'Waktu', key: 'waktu', sortable: true },
      { label: 'Jumlah Poin', key: 'jumlah', sortable: true },
      { label: 'Pelanggan Yang Direferensikan', key: 'pelanggan', sortable: true },
      { label: 'Nama Layanan', key: 'layanan', sortable: true },
      { label: 'Periode Berlangganan', key: 'periode', sortable: true },
      { label: 'Tipe Komisi', key: 'tipe', sortable: true }
    ]
  }
  return [
    { label: 'Waktu Penarikan Poin', key: 'waktu', sortable: true },
    { label: 'Poin Ditarik', key: 'poin', sortable: true },
    { label: 'Nama Bank', key: 'bank', sortable: true },
    { label: 'Nomor Akun Bank', key: 'rekening', sortable: true },
    { label: 'Nama Penerima', key: 'penerima', sortable: true },
    { label: 'Nota', key: 'nota', sortable: true }
  ]
})

interface IncomingPoint {
  waktu: string
  jumlah: number
  pelanggan: { name: string; id: string }
  layanan: string
  periode: string
  tipe: string
}

interface WithdrawnPoint {
  waktu: string
  poin: number
  bank: string
  rekening: string
  penerima: string
  nota: string
}

const incomingPoints: IncomingPoint[] = [
  { waktu: '7 Jan 2026 - 12:42', jumlah: 300, pelanggan: { name: 'Chalista', id: '328940283830' }, layanan: 'Nusanet Broadband Business EDGE...', periode: 'Okt 2025 - Sep 2026', tipe: 'Recurring per tahun' },
  { waktu: '5 Jan 2026 - 12:42', jumlah: 145, pelanggan: { name: 'Kurtney', id: '328940286754' }, layanan: 'Nusanet Broadband Business EDGE...', periode: 'Agu 2025 - Agu 2025', tipe: 'Sekali Bayar (OTP)' },
  { waktu: '11 Des 2025 - 12:42', jumlah: 129, pelanggan: { name: 'Budi', id: '328940282234' }, layanan: 'Nusawork Advance', periode: 'Sep 2025 - Agu 2026', tipe: 'Recurring per bulan' },
  { waktu: '11 Des 2025 - 12:42', jumlah: 329, pelanggan: { name: 'Anita', id: '328940280912' }, layanan: 'Nusawork Advance', periode: 'Jun 2025 - Mei 2026', tipe: 'Sekali Bayar (OTP)' },
  { waktu: '6 Des 2025 - 12:42', jumlah: 6732, pelanggan: { name: 'Ali', id: '328940286543' }, layanan: 'Nusafiber Life', periode: 'Sep 2025 - Sep 2025', tipe: 'Recurring per bulan' },
  { waktu: '5 Des 2025 - 12:42', jumlah: 193, pelanggan: { name: 'David', id: '328940288907' }, layanan: 'Nusafiber Selecta Basic 30', periode: 'Sep 2025 - Sep 2025', tipe: 'Sekali Bayar (OTP)' }
]

const withdrawnPoints: WithdrawnPoint[] = [
  { waktu: '11 Des 2025 - 12:42', poin: 500, bank: 'Bank Mandiri', rekening: '1380002254567', penerima: 'SIMU ANDERSON LIU', nota: 'paid-8373001.pdf' },
  { waktu: '6 Des 2025 - 12:42', poin: 648, bank: 'Bank Mandiri', rekening: '1380002254567', penerima: 'SIMU ANDERSON LIU', nota: 'paid-8372902.pdf' },
  { waktu: '5 Des 2025 - 12:42', poin: 400, bank: 'Bank Mandiri', rekening: '1380002254567', penerima: 'SIMU ANDERSON LIU', nota: 'paid-8376789.pdf' },
  { waktu: '30 Nov 2025 - 12:42', poin: 800, bank: 'Bank Mandiri', rekening: '1380002254567', penerima: 'SIMU ANDERSON LIU', nota: 'paid-8376679.pdf' },
  { waktu: '22 Nov 2025 - 12:42', poin: 150, bank: 'Bank Mandiri', rekening: '1380002254567', penerima: 'SIMU ANDERSON LIU', nota: 'paid-8374432.pdf' }
]

const filteredIncoming = computed(() => {
  if (!searchQuery.value) return incomingPoints
  const query = searchQuery.value.toLowerCase()
  return incomingPoints.filter(item => 
    item.pelanggan.name.toLowerCase().includes(query) ||
    item.layanan.toLowerCase().includes(query) ||
    item.pelanggan.id.toLowerCase().includes(query)
  )
})

const filteredWithdrawn = computed(() => {
  if (!searchQuery.value) return withdrawnPoints
  const query = searchQuery.value.toLowerCase()
  return withdrawnPoints.filter(item => 
    item.bank.toLowerCase().includes(query) ||
    item.penerima.toLowerCase().includes(query) ||
    item.nota.toLowerCase().includes(query)
  )
})

const currentData = computed(() => activeTab.value === 'incoming' ? filteredIncoming.value : filteredWithdrawn.value)

interface AreaChartItem {
  month: string
  growth: number
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', growth: 186 },
  { month: 'February', growth: 305 },
  { month: 'March', growth: 237 },
  { month: 'April', growth: 73 },
  { month: 'May', growth: 209 },
  { month: 'June', growth: 214 }
]

const categories = {
  growth: { name: 'Pertumbuhan', color: '#24960F' }
}

const xFormatter = (tick: number): string => {
  return AreaChartData[tick]?.month || ''
}
</script>
