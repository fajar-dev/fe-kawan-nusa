<template>
  <div class="space-y-6">
    <!-- Bank Info Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-neutral-800">Informasi Bank</h3>
          <button class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>

        <!-- Info Alert -->
        <div role="alert" class="alert alert-info bg-info/10 border-info/10 text-info shadow-none">
          <Info class="w-4 h-4" />
          <span>Pastikan nama pemilik rekening sesuai dengan nama akun Anda.</span>
        </div>
        
        <div class="space-y-4">
          <div class="form-control w-full max-w-md">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Pemilik Rekening<span class="text-red-500">*</span></span>
            </label>
            <input type="text" value="Rupert Alexander" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nama Bank<span class="text-red-500">*</span></span>
              </label>
              <select class="select select-bordered w-full h-10 min-h-0 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none font-normal">
                <option selected>PT. Bank Mandiri (Persero) Tbk (Mandiri)</option>
                <option>BCA</option>
                <option>BNI</option>
                <option>BRI</option>
              </select>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nomor Rekening<span class="text-red-500">*</span></span>
              </label>
              <input type="text" value="1400012345678" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MoreHorizontal, Info
} from 'lucide-vue-next'
</script>