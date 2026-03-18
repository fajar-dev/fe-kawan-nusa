<template>
  <div class="space-y-6">
    <!-- Personal Info Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-semibold text-neutral-800">Informasi Pribadi</h3>
          <button class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Depan<span class="text-red-500">*</span></span>
            </label>
            <input type="text" value="Rupert" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nama Belakang<span class="text-red-500">*</span></span>
            </label>
            <input type="text" value="Alexander" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Alamat Email<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="email" value="adipragiwaksono@gmail.com" class="input input-bordered w-full h-10 pl-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div class="form-control w-full">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Nomor Handphone<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value="+62 822-0870-3090" class="input input-bordered w-full h-10 pl-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
            </div>
          </div>
        </div>
        
        <!-- Company Info -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-5">Informasi Perusahaan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Nama Perusahaan<span class="text-red-500">*</span></span>
              </label>
              <input type="text" value="HAHAHA Corp" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs ßtext-neutral-800">Jabatan<span class="text-red-500">*</span></span>
              </label>
              <input type="text" value="Head of Creative" class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MoreHorizontal, Mail, Phone
} from 'lucide-vue-next'
</script>