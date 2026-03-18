<template>
  <aside class="menu bg-base-100 h-full w-64 p-2 text-base-content flex flex-col justify-between border-r border-base-300">
    <div>

      <ul class="menu w-full gap-1.5 lg:mt-3 mt-18">
        <li>
          <NuxtLink to="/" active-class="bg-primary text-primary-content active hover:bg-primary/90" class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <Home class="w-5 h-5 group-[.active]:text-white" />
            Beranda
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/customer" active-class="bg-primary text-primary-content active hover:bg-primary/90" class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <Users class="w-5 h-5 group-[.active]:text-white" />
            Customer Saya
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/service" active-class="bg-primary text-primary-content active hover:bg-primary/90" class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <Package class="w-5 h-5 group-[.active]:text-white" />
            Produk dan Layanan
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/point" active-class="bg-primary text-primary-content active hover:bg-primary/90" class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <Coins class="w-5 h-5 group-[.active]:text-white" />
            Poin Saya
          </NuxtLink>
        </li>
      </ul>
    </div>
    
    <div class="mt-auto">
      <ul class="menu w-full gap-1">
        <li>
          <NuxtLink to="/education" class="hover:bg-base-200 text-neutral-600 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <BookOpen class="w-5 h-5 group-[.active]:text-white" />
            Edukasi
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/setting" active-class="bg-primary text-primary-content active hover:bg-primary/90" class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors">
            <Settings class="w-5 h-5 group-[.active]:text-white" />
            Pengaturan
          </NuxtLink>
        </li>
      </ul>
      <div class="px-6 py-2 text-center">
        <p class="text-xs text-neutral-400">version: 2.1.0</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Home, Users, Package, Coins, BookOpen, Settings } from 'lucide-vue-next'
</script>
