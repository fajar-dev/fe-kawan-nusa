<template>
  <header class="w-full h-16 bg-base-100 flex items-center justify-between px-2 lg:px-5 border-b border-base-300">
    <div class="flex items-center flex-1">
      <label for="my-drawer" class="btn btn-square btn-ghost drawer-button lg:hidden mr-2">
        <Menu class="w-6 h-6" />
      </label>

      <!-- Logo -->
      <div class="mr-10 lg:mr-10 flex-shrink-0">
        <h1 class="font-semibold text-xl lg:text-2xl leading-tight tracking-tight text-neutral-900">kawan <span class="text-primary">nusa</span></h1>
        <p class="text-[0.3rem] lg:text-[0.35rem] text-neutral-500 uppercase tracking-widest leading-none">Portal Referral PT. Media Antar Nusa</p>
      </div>
      
      <!-- Search Input -->
      <div class="relative w-full max-w-md hidden md:block group">
        <div class="flex items-center border border-base-300 rounded-lg bg-base-100 px-3 transition-all focus-within:ring-2 focus-within:ring-primary/50">
          <input 
            type="text" 
            placeholder="Search..." 
            class="input border-none focus:outline-none w-full h-9 pl-2 text-sm bg-transparent" 
          />
          <Search class="w-5 h-5 text-neutral-800" />
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 md:gap-2">
      <button class="btn btn-ghost btn-circle btn-sm hover:text-neutral-900 transition-colors">
        <HelpCircle class="w-5 h-5" />
      </button>
      <button class="btn btn-ghost btn-circle btn-sm hover:text-neutral-900 transition-colors">
        <MessageSquareWarning class="w-5 h-5" />
      </button>
      <div class="indicator">
        <button class="btn btn-ghost btn-circle btn-sm hover:text-neutral-900 transition-colors">
          <Bell class="w-5 h-5" />
        </button>
      </div>
      
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="flex items-center gap-3 cursor-pointer hover:bg-base-200/50 p-2 rounded-full pl-3 lg:pl-4 pr-3 transition-colors">
          <div class="avatar online">
            <div class="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 transition-all group-hover:ring-primary/80">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
            </div>
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-sm font-medium leading-none text-primary max-w-30 truncate">Rupert Alexander</p>
          </div>
        </div>
        <ul tabindex="0" class="dropdown-content z-[200] menu p-2 shadow-xl bg-base-100 rounded-box w-56 mt-4 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <li>
            <a class="flex items-center gap-3 py-2.5 text-neutral-600 hover:text-primary transition-colors">
              <Settings class="w-4 h-4" />
              <span class="font-medium text-sm">Pengaturan</span>
            </a>
          </li>
          <li>
            <a class="flex items-center gap-3 py-2.5 text-neutral-600 hover:text-primary transition-colors">
              <MessageSquareMore class="w-4 h-4" />
              <span class="font-medium text-sm">My Feedback</span>
            </a>
          </li>
          <div class="divider my-1 opacity-50 mx-2"></div>
          <li>
            <a href="/auth/sign-in" class="flex items-center gap-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut class="w-4 h-4" />
              <span class="font-medium text-sm">Keluar</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Search, HelpCircle, MessageSquareWarning, Bell, Settings, MessageSquareMore, LogOut } from 'lucide-vue-next'
</script>
