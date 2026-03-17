<template>
  <header class="w-full h-20 bg-base-100 flex items-center justify-between px-6 lg:px-10 border-b border-base-300 shadow-xs">
    <div class="flex items-center flex-1">
      <label for="my-drawer" class="btn btn-square btn-ghost drawer-button lg:hidden mr-2">
        <Menu class="w-6 h-6" />
      </label>

      <!-- Logo -->
      <div class="mr-6 lg:mr-10 flex-shrink-0">
        <h1 class="font-semibold text-2xl lg:text-3xl leading-tight tracking-tight text-neutral-900">kawan <span class="text-primary">nusa</span></h1>
        <p class="text-[0.4rem] lg:text-[0.42rem] text-neutral-500 uppercase tracking-widest leading-none">Portal Referral PT. Media Antar Nusa</p>
      </div>
      
      <!-- Search Input -->
      <div class="relative w-full max-w-md hidden md:block group">
        <input 
          type="text" 
          placeholder="Search..." 
          class="input input-bordered w-full pl-5 h-10 rounded-lg bg-base-100 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all border-base-300" 
        />
        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded border border-base-300 text-base-content/50 bg-base-200 shadow-sm">
          ⌘K
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 md:gap-2">
      <button class="btn btn-ghost btn-circle btn-sm text-neutral-500 hover:text-neutral-900 transition-colors">
        <HelpCircle class="w-5 h-5" />
      </button>
      <button class="btn btn-ghost btn-circle btn-sm text-neutral-500 hover:text-neutral-900 transition-colors">
        <MessageSquareWarning class="w-5 h-5" />
      </button>
      <div class="indicator">
        <button class="btn btn-ghost btn-circle btn-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          <Bell class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex items-center gap-3 cursor-pointer hover:bg-base-200/50 p-2 rounded-full pl-3 lg:pl-4 pr-3 transition-colors">
        <div class="avatar online">
          <div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
          </div>
        </div>
        <div class="hidden lg:block text-right">
          <p class="text-sm font-medium text-neutral-800 leading-none text-primary">Rupert Alexander</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Search, HelpCircle, MessageSquareWarning, Bell } from 'lucide-vue-next'
</script>
