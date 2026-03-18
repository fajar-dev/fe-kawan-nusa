<template>
  <div class="space-y-4">
    <!-- Password Change Card -->
    <div class="card bg-white border border-base-200">
      <div class="card-body p-5 lg:p-8">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-neutral-800">Perubahan Kata Sandi</h3>
          <button class="btn btn-ghost btn-sm btn-circle text-neutral-400 hover:text-neutral-800 transition-colors">
            <MoreHorizontal class="w-5 h-5" />
          </button>
        </div>

        <!-- Info Alert -->
        <div role="alert" class="alert alert-info bg-info/10 border-info/10 text-info shadow-none flex flex-col items-start gap-1">
          <div class="flex items-center gap-2">
          <Info class="w-4 h-4" />
            <span class="font-bold">Terakhir diubah 8 hari yang lalu</span>
          </div>
          <span class="text-xs ml-7 text-neutral-500 font-normal">Demi keamanan akun Anda, kami menyarankan untuk mengganti kata sandi setiap 90 hari.</span>
        </div>
        
        <div class="space-y-4">
          <!-- Current Password - Top -->
          <div class="form-control w-full max-w-md">
            <label class="label mb-1.5 p-0">
              <span class="text-xs text-neutral-800">Kata Sandi Saat Ini<span class="text-red-500">*</span></span>
            </label>
            <div class="relative">
              <input 
                :type="showOldPassword ? 'text' : 'password'" 
                value="************" 
                class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
              />
              <button 
                type="button" 
                @click="showOldPassword = !showOldPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <Eye v-if="!showOldPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- New Passwords - Bottom Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  value="************" 
                  class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                />
                <button 
                  type="button" 
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <Eye v-if="!showNewPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="form-control w-full">
              <label class="label mb-1.5 p-0">
                <span class="text-xs text-neutral-800">Ulangi Kata Sandi Baru<span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  value="************" 
                  class="input input-bordered w-full h-10 bg-neutral-50/50 border-base-200 rounded-lg text-sm transition-all focus:border-primary focus:outline-none" 
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Buttons -->
          <div class="flex items-center justify-end gap-3 pt-4">
            <button class="btn btn-outline btn-primary text-primary hover:bg-primary/5 hover:border-primary rounded-lg px-6">
              Batalkan
            </button>
            <button class="btn btn-primary rounded-lg px-6">
              Ubah Kata Sandi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  MoreHorizontal, Info, Eye, EyeOff
} from 'lucide-vue-next'

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
</script>