<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-800">Syarat & Ketentuan Penukaran Poin</h3>
          <button @click="isOpen = false" class="text-neutral-400 hover:text-neutral-800 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 overflow-y-auto max-h-[50vh]">
          <ol class="list-decimal list-outside ml-5 space-y-2 text-sm text-neutral-600 leading-relaxed">
            <li v-for="(term, index) in terms" :key="index" v-html="term"></li>
          </ol>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex justify-end border-t border-neutral-100 bg-neutral-50/30">
          <button 
            @click="isOpen = false"
            class="btn btn-primary rounded-lg font-medium"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const isOpen = defineModel<boolean>({ default: false })

const terms = [
  'Referral dapat melakukan penukaran poin apabila memiliki saldo poin yang mencukupi sesuai dengan reward yang dipilih.',
  'Poin dapat ditukarkan dengan berbagai reward yang tersedia di <b>halaman tukar poin</b>, seperti voucher belanja, produk elektronik dan voucher hiburan.',
  'Setiap reward memiliki jumlah poin yang berbeda dan tercantum pada masing-masing item.',
  'Poin yang telah ditukarkan <b>tidak dapat dibatalkan, dikembalikan, atau ditukar kembali</b> dengan poin.',
  'Untuk reward berupa <b>voucher</b>, kode voucher akan dikirimkan melalui sistem atau email yang terdaftar.',
  'Untuk reward berupa <b>produk/barang</b>, Referral wajib mengisi data pengiriman secara lengkap dan benar. Segala kesalahan pengisian data menjadi tanggung jawab Referral.',
  'Proses verifikasi dan pengiriman reward memerlukan waktu sesuai dengan ketentuan yang berlaku.',
  'Pihak penyedia layanan berhak menolak atau membatalkan penukaran apabila ditemukan indikasi penyalahgunaan atau pelanggaran.',
  'Syarat & ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.'
]

watch(isOpen, (val) => {
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
