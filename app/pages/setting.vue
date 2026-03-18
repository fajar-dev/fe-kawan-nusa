<template>
  <div class="flex flex-col w-full pb-10">
    <!-- Profile/Setting Header Section -->
    <div class="bg-white rounded-2xl border border-base-200 overflow-hidden mb-8 shadow-xs">
      <!-- Cover Photo -->
      <div 
        class="h-48 relative" 
        style="background: linear-gradient(92.21deg, rgba(243, 244, 246, 0.8) 28.48%, rgba(219, 234, 254, 0.8) 67.21%);"
      >
      </div>
      
      <!-- Profile Info Bar -->
      <div class="px-5 lg:px-10 pb-4 relative">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between -mt-12 lg:-mt-16 gap-4 lg:gap-6">
          <div class="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
            <!-- Avatar -->
            <div class="relative inline-block mx-auto lg:mx-0">
              <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-[4px] lg:border-[6px] border-white shadow-lg overflow-hidden bg-base-100">
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="w-full h-full object-cover" />
              </div>
            </div>
            
            <div class="mt-4 lg:mt-20 text-center lg:text-left">
              <h1 class="text-lg lg:text-xl font-medium text-neutral-800">Rupert Alexander</h1>
              <p class="text-xs lg:text-sm text-neutral-500">Bergabung sejak Agustus 2022</p>
              <div class="mt-2 text-primary font-semibold text-[10px] lg:text-xs bg-primary/10 px-3 py-1.5 rounded-lg inline-block">
                Super Referrer
              </div>
            </div>
          </div>
          
          <div class="mb-2 flex justify-center lg:justify-end">
            <button class="btn btn-primary">
              <Pencil class="w-4 h-4" />
              Ubah Foto
            </button>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="mt-8 lg:mt-10">
          <div class="flex items-center lg:justify-end gap-6 lg:gap-8 overflow-x-auto no-scrollbar lg:max-w-sm lg:ml-auto border-b border-base-300">
            <NuxtLink 
              to="/setting/account" 
              class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0"
              :class="[ $route.path === '/setting/account' ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800' ]"
            >
              <User2 class="w-4 h-4" />
              Akun
              <div v-if="$route.path === '/setting/account'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
            </NuxtLink>
            <NuxtLink 
              to="/setting/bank" 
              class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0"
              :class="[ $route.path === '/setting/bank' ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800' ]"
            >
              <Warehouse class="w-4 h-4" />
              Bank dan Komisi
              <div v-if="$route.path === '/setting/bank'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
            </NuxtLink>
            <NuxtLink 
              to="/setting/password" 
              class="pb-3 text-xs lg:text-sm transition-all relative inline-flex items-center gap-2 shrink-0"
              :class="[ $route.path === '/setting/password' ? 'text-primary' : 'text-neutral-600 hover:text-neutral-800' ]"
            >
              <LockKeyhole class="w-4 h-4" />
              Password
              <div v-if="$route.path === '/setting/password'" class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"></div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-8">
        <NuxtPage />
      </div>
      
      <div class="lg:col-span-4 space-y-4">
        <div class="card bg-white border border-base-200">
          <div class="card-body p-8">
            <h3 class="text-lg font-semibold text-neutral-800 mb-6">Preferensi</h3>
            
            <div class="space-y-4">
              <!-- Item 1 -->
              <div class="flex items-start gap-4 p-4 border border-base-300 rounded-xl bg-neutral-50/30">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-neutral-800">Update & Informasi Terbaru</span>
                    <input type="checkbox" checked class="toggle toggle-primary toggle-sm" />
                  </div>
                  <p class="text-xs text-neutral-500 leading-relaxed max-w-[240px]">
                    Jika ini aktif, maka Anda akan menerima update setiap hari via email
                  </p>
                </div>
              </div>

              <!-- Item 2 -->
              <div class="flex items-start gap-4 p-4 border border-base-300 rounded-xl bg-neutral-50/30">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign class="w-5 h-5 text-primary" />
                </div>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-neutral-800 text-right">Penarikan Otomatis</span>
                    <input type="checkbox" checked class="toggle toggle-primary toggle-sm" />
                  </div>
                  <p class="text-xs text-neutral-500 leading-relaxed max-w-[240px]">
                    Jika ini aktif, maka komisi Anda akan otomatis dikirimkan tanpa pengajuan penarikan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, User2, Warehouse, LockKeyhole, Mail, DollarSign } from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-[#f8fcf9]'
})
</script>
