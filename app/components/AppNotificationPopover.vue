<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle btn-sm hover:text-neutral-900 transition-colors">
      <div class="indicator">
        <Bell class="w-5 h-5" />
        <span v-if="unreadCount > 0" class="indicator-item w-2.5 h-2.5 bg-primary rounded-full"></span>
      </div>
    </div>
    <div tabindex="0" class="dropdown-content z-[200] card card-compact w-80 lg:w-96 p-0 shadow-xl bg-base-100 mt-4 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
      <div class="p-4 border-b border-base-200 flex items-center justify-between">
        <h3 class="font-semibold text-neutral-800">Notifikasi</h3>
      </div>
      <div class="max-h-96 overflow-y-auto overflow-x-hidden divide-y divide-base-100 pb-2">
          <div v-for="notif in notifications" :key="notif.id" class="p-4 hover:bg-neutral-50 transition-colors group">
              <div class="flex gap-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', notif.iconBg]">
                    <component :is="notif.icon" :class="['w-5 h-5', notif.iconColor]" />
                </div>
                <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-medium leading-none text-neutral-800 transition-colors">{{ notif.title }}</p>
                      <span class="text-xs text-neutral-400 whitespace-nowrap">{{ notif.time }}</span>
                    </div>
                    <p class="text-xs text-neutral-500 leading-relaxed">{{ notif.message }}</p>
                </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, UserPlus, Gift, Info } from 'lucide-vue-next'

// Mock Notifications
const notifications = ref([
  {
    id: 1,
    title: 'Referral Baru Bergabung',
    message: 'Selamat! Budi Santoso baru saja mendaftar menggunakan kode referral Anda.',
    time: '2 jam yang lalu',
    icon: UserPlus,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    isRead: false
  },
  {
    id: 2,
    title: 'Reward Poin Cair',
    message: 'Poin sebesar 500 telah ditambahkan ke akun Anda dari transaksi PT. Maju Jaya.',
    time: '5 jam yang lalu',
    icon: Gift,
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    isRead: false
  },
  {
    id: 3,
    title: 'Promo Terbatas!',
    message: 'Dapatkan tambahan komisi 2% untuk setiap referral baru di bulan ini.',
    time: '1 hari yang lalu',
    icon: Info,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    isRead: true
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length)
</script>
