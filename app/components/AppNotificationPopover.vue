<template>
  <div v-if="isUser" class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-circle btn-sm hover:text-neutral-900 transition-colors"
      @click="onOpen"
    >
      <div class="indicator">
        <Bell class="w-4.5 h-4.5" />
        <span
          v-if="unreadCount > 0"
          class="indicator-item badge badge-xs bg-primary text-primary-content border-none min-w-4 h-4 px-1 text-[10px] font-semibold"
        >{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
      </div>
    </div>

    <div tabindex="0" class="dropdown-content z-[200] card card-compact w-80 lg:w-96 p-0 shadow-xl bg-base-100 mt-4 border border-base-200 animate-in fade-in slide-in-from-top-2 duration-200">
      <div class="p-4 border-b border-base-200 flex items-center justify-between">
        <h3 class="font-semibold text-neutral-800">Notifikasi</h3>
        <button
          v-if="unreadCount > 0"
          @click.stop="handleMarkAll"
          class="text-xs font-medium text-primary hover:underline"
        >Tandai semua dibaca</button>
      </div>

      <div
        ref="scrollEl"
        class="max-h-96 overflow-y-auto overflow-x-hidden divide-y divide-base-100"
        @scroll="onScroll"
      >
        <!-- Loading (initial) -->
        <div v-if="loading && items.length === 0" class="flex justify-center py-10">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <!-- Empty -->
        <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-12 text-center px-6">
          <BellOff class="w-8 h-8 text-neutral-300 mb-2" />
          <p class="text-sm text-neutral-400">Belum ada notifikasi</p>
        </div>

        <!-- List -->
        <button
          v-for="notif in items"
          :key="notif.id"
          @click="onClickNotif(notif)"
          :class="['w-full text-left p-4 hover:bg-neutral-50 transition-colors flex gap-3', !notif.isRead ? 'bg-primary/5' : '']"
        >
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg(notif.type)]">
            <component :is="iconFor(notif.type)" :class="['w-5 h-5', iconColor(notif.type)]" />
          </div>
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium leading-snug text-neutral-800 truncate">{{ notif.title }}</p>
              <span class="text-[11px] text-neutral-400 whitespace-nowrap shrink-0 mt-0.5">{{ timeAgo(notif.createdAt) }}</span>
            </div>
            <p class="text-xs text-neutral-500 leading-relaxed line-clamp-2">{{ notif.message }}</p>
          </div>
          <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
        </button>

        <!-- Loading more -->
        <div v-if="loadingMore" class="flex justify-center py-4">
          <span class="loading loading-spinner loading-sm text-primary"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, BellOff, Coins, Gift, UserCheck, Megaphone, Info } from 'lucide-vue-next'
import { notificationService } from '~/services/notification-service'
import type { NotificationItem, NotificationType } from '~/types/notification'
import { timeAgo } from '~/utils/date'

const { state } = useAuth()
const isUser = computed(() => state.isUser)

const items = ref<NotificationItem[]>([])
const page = ref(1)
const lastPage = ref(1)
const loading = ref(false)
const loadingMore = ref(false)
const unreadCount = ref(0)
const scrollEl = ref<HTMLElement | null>(null)

const iconFor = (t: NotificationType) => (({ point: Coins, redemption: Gift, account: UserCheck, content: Megaphone, general: Info } as Record<string, any>)[t] || Info)
const iconBg = (t: NotificationType) => (({ point: 'bg-success/10', redemption: 'bg-primary/10', account: 'bg-blue-50', content: 'bg-amber-50', general: 'bg-neutral-100' } as Record<string, string>)[t] || 'bg-neutral-100')
const iconColor = (t: NotificationType) => (({ point: 'text-success', redemption: 'text-primary', account: 'text-blue-500', content: 'text-amber-500', general: 'text-neutral-500' } as Record<string, string>)[t] || 'text-neutral-500')

const fetchUnread = async () => {
  try {
    const res = await notificationService.getUnreadCount()
    unreadCount.value = res.data?.count ?? 0
  } catch { /* handled in service */ }
}

const fetchPage = async (p: number) => {
  const res = await notificationService.getNotifications(p, 10)
  lastPage.value = res.meta.lastPage
  if (p === 1) items.value = res.data
  else items.value.push(...res.data)
  page.value = p
}

const loadInitial = async () => {
  loading.value = true
  try {
    await fetchPage(1)
  } catch { /* handled */ } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || loading.value || page.value >= lastPage.value) return
  loadingMore.value = true
  try {
    await fetchPage(page.value + 1)
  } catch { /* handled */ } finally {
    loadingMore.value = false
  }
}

const onScroll = () => {
  const el = scrollEl.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) loadMore()
}

const onOpen = () => {
  // Refresh on each open so the list & badge stay current.
  loadInitial()
  fetchUnread()
}

const markLocalRead = (notif: NotificationItem) => {
  if (!notif.isRead) {
    notif.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
}

const onClickNotif = async (notif: NotificationItem) => {
  markLocalRead(notif)
  notificationService.markRead(notif.id).catch(() => {})
  ;(document.activeElement as HTMLElement | null)?.blur() // close dropdown
  if (notif.link) navigateTo(notif.link)
}

const handleMarkAll = async () => {
  items.value.forEach(n => { n.isRead = true })
  unreadCount.value = 0
  try { await notificationService.markAllRead() } catch { /* handled */ }
}

onMounted(() => {
  if (isUser.value) fetchUnread()
})
</script>
