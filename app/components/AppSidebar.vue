<template>
  <aside class="menu bg-base-100 h-full w-64 p-4 text-base-content flex flex-col justify-between border-r border-base-300">
    <div>

      <ul class="menu w-full gap-1 lg:mt-0 mt-20">
        <li>
          <NuxtLink to="/" class="active text-primary-content bg-primary hover:bg-primary/90 rounded-xl px-4 py-3 font-medium">
            <Home class="w-5 h-5" />
            Beranda
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/customers" class="hover:bg-base-200 text-neutral-600 rounded-xl px-4 py-3 font-medium transition-colors">
            <Users class="w-5 h-5 text-primary" />
            Customer Saya
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/products" class="hover:bg-base-200 text-neutral-600 rounded-xl px-4 py-3 font-medium transition-colors">
            <Package class="w-5 h-5 text-primary" />
            Produk dan Layanan
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/points" class="hover:bg-base-200 text-neutral-600 rounded-xl px-4 py-3 font-medium transition-colors">
            <Coins class="w-5 h-5 text-primary" />
            Poin Saya
          </NuxtLink>
        </li>
      </ul>
    </div>
    
    <div class="mt-auto">
      <ul class="menu w-full gap-1">
        <li>
          <NuxtLink to="/education" class="hover:bg-base-200 text-neutral-600 rounded-xl px-4 py-3 font-medium transition-colors">
            <BookOpen class="w-5 h-5 text-primary" />
            Edukasi
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/settings" class="hover:bg-base-200 text-neutral-600 rounded-xl px-4 py-3 font-medium transition-colors">
            <Settings class="w-5 h-5 text-primary" />
            Pengaturan
          </NuxtLink>
        </li>
      </ul>
      <div class="px-6 py-4 text-center">
        <p class="text-xs text-neutral-400">version: 2.1.0</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Home, Users, Package, Coins, BookOpen, Settings } from 'lucide-vue-next'
</script>
