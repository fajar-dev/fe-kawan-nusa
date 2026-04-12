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
      
      <!-- Command Palette Trigger -->
      <div class="relative w-full max-w-md hidden md:block group cursor-pointer" @click="isPaletteOpen = true">
        <div class="flex items-center border border-base-300 rounded-lg bg-base-100 px-3 h-9 transition-all hover:border-primary/50">
          <span class="text-sm text-neutral-400 flex-1">Type a command or search...</span>
          <div class="flex items-center gap-1">
            <kbd class="kbd kbd-xs bg-base-200">⌘</kbd>
            <kbd class="kbd kbd-xs bg-base-200">K</kbd>
          </div>
          <Search class="w-4 h-4 text-neutral-400 ml-3" />
        </div>
      </div>

      <AppCommandPalette v-model="isPaletteOpen" />
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
              <img v-if="authState.user?.photo" :src="`${useRuntimeConfig().public.apiUrl}${authState.user?.photo}`" alt="Avatar" />
              <div v-else class="bg-primary text-white flex items-center justify-center font-bold text-xs h-full w-full uppercase">
                {{ getInitials(authState.user?.firstName + ' ' + authState.user?.lastName) }}
              </div>
            </div>
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-sm font-medium leading-none text-primary max-w-30 truncate" :title="authState.user?.firstName + ' ' + authState.user?.lastName">
                {{ authState.user?.firstName }} {{ authState.user?.lastName }}
            </p>
          </div>
        </div>
        <ul tabindex="0" class="dropdown-content z-[200] menu p-2 shadow-xl bg-base-100 rounded-box w-56 mt-4 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <li>
            <NuxtLink to="/setting/account" class="flex items-center gap-3 py-2.5 text-neutral-600 hover:text-primary transition-colors">
              <Settings class="w-4 h-4" />
              <span class="font-medium text-sm">Pengaturan</span>
            </NuxtLink>
          </li>
          <li>
            <a class="flex items-center gap-3 py-2.5 text-neutral-600 hover:text-primary transition-colors">
              <MessageSquareMore class="w-4 h-4" />
              <span class="font-medium text-sm">My Feedback</span>
            </a>
          </li>
          <div class="divider my-1 opacity-50 mx-2"></div>
          <li>
            <button @click="handleLogout" class="flex items-center gap-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
              <LogOut class="w-4 h-4" />
              <span class="font-medium text-sm">Keluar</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Menu, Search, HelpCircle, MessageSquareWarning, Bell, Settings, MessageSquareMore, LogOut } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const isPaletteOpen = ref(false)
const { state: authState, service: authService } = useAuth()
const toast = useToast()

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
}

// Keyboard shortcut (Cmd+K or Ctrl+K)
const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        isPaletteOpen.value = !isPaletteOpen.value
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

const handleLogout = async () => {
    await authService.logout()
    toast.success({
        message: 'Berhasil keluar'
    })
}
</script>
