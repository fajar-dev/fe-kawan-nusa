<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <!-- Backdrop -->
      <div class="absolute inset-0" @click="isOpen = false"></div>
      
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative z-10 mx-4">
        <!-- Close Button -->
        <button @click="isOpen = false" class="absolute right-4 top-4 text-neutral-400 hover:text-neutral-800 transition-colors z-20">
          <X class="w-6 h-6" />
        </button>

        <div class="p-6 flex flex-col items-center text-center">
          <!-- Ticket Icon -->
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Ticket class="w-8 h-8 text-primary" />
          </div>

          <h3 class="text-lg font-semibold text-neutral-800 mb-1 px-4 leading-tight">
            {{ (redemption?.voucherDetails?.catalog.name) || 'Voucher Belanja' }}
          </h3>
          <p class="text-xs text-neutral-400 mb-6">
            Simpan dan gunakan kode voucher Anda
          </p>

          <!-- Voucher Code Box -->
          <div class="w-full bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-3 mb-6 relative">
            <span class="text-xs text-neutral-400">Kode Voucher</span>
            <p class="text-neutral-800 font-bold text-xl tracking-wider select-all uppercase">
              {{ redemption?.voucherDetails?.detail?.code || '-' }}
            </p>
            <div class="flex items-center justify-center gap-1.5 text-neutral-400 text-xs pt-1">
              <Calendar class="w-3.5 h-3.5" />
              Berlaku hingga: {{ formatDate(redemption?.voucherDetails?.detail?.expiredDate) || '-' }}
            </div>
          </div>

          <!-- Usage Instructions -->
          <div class="w-full text-left space-y-3 mb-8">
            <p class="text-sm font-medium text-neutral-800">Cara Penggunaan:</p>
            <ul class="text-xs leading-relaxed text-neutral-500 space-y-2 list-decimal pl-4">
              <li>Tunjukkan kode voucher saat melakukan pembayaran di kasir.</li>
              <li>Potongan harga akan otomatis diterapkan pada transaksi Anda.</li>
              <li>Berlaku untuk pembelian produk yang tersedia di toko.</li>
              <li>Tidak dapat digabungkan dengan promo lainnya.</li>
              <li>Gunakan voucher sebelum tanggal kedaluwarsa.</li>
            </ul>
          </div>

          <!-- Copy Button -->
          <button 
            @click="copyToClipboard"
            class="btn w-full btn-primary rounded-lg"
          >
            <Copy v-if="!isCopied" class="w-4 h-4" />
            <Check v-else class="w-4 h-4" />
            {{ isCopied ? 'Tersalin!' : 'Salin Kode Voucher' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Ticket, Calendar, Copy, Check } from 'lucide-vue-next'
import { ref, watch, onUnmounted } from 'vue'
import type { RedemptionData } from '~/types/redemptions'

const props = defineProps<{
  redemption?: RedemptionData | null
}>()

const isOpen = defineModel<boolean>({ default: false })
const isCopied = ref(false)

const copyToClipboard = async () => {
  const code = props.redemption?.voucherDetails?.detail?.code
  if (!code) return

  try {
    await navigator.clipboard.writeText(code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

watch(isOpen, (val) => {
  if (!import.meta.client) return
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    isCopied.value = false
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>
