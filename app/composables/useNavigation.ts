import { Home, Users, Package, Coins, BookOpen, Settings } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavChild {
  label: string
  to: string
  match: string
}

export interface NavItem {
  label: string
  to: string
  icon: Component
  match: string
  exact?: boolean
  role?: 'user' | 'admin'
  position?: 'top' | 'bottom'
  children?: NavChild[]
}

const navItems: NavItem[] = [
  // ── Top section ──
  {
    label: 'Beranda',
    to: '/',
    icon: Home,
    match: '/',
    exact: true,
    position: 'top',
  },
  {
    label: 'Customer Saya',
    to: '/customer',
    icon: Users,
    match: '/customer',
    role: 'user',
    position: 'top',
  },
  {
    label: 'Produk dan Layanan',
    to: '/service',
    icon: Package,
    match: '/service',
    role: 'user',
    position: 'top',
  },
  {
    label: 'Poin Saya',
    to: '/point',
    icon: Coins,
    match: '/point',
    role: 'user',
    position: 'top',
    children: [
      { label: 'Aktivitas Poin', to: '/point/activity/reward', match: '/point/activity' },
      { label: 'Tukar Poin', to: '/point/reedem', match: '/point/reedem' },
    ],
  },

  // ── Bottom section ──
  {
    label: 'Edukasi',
    to: '/education',
    icon: BookOpen,
    match: '/education',
    position: 'bottom',
  },
  {
    label: 'Pengaturan',
    to: '/setting',
    icon: Settings,
    match: '/setting',
    role: 'user',
    position: 'bottom',
  },
]

export const useNavigation = () => {
  const { state } = useAuth()

  const filteredNav = computed(() =>
    navItems.filter(item => !item.role || item.role === state.role)
  )

  const topNav = computed(() => filteredNav.value.filter(item => item.position !== 'bottom'))
  const bottomNav = computed(() => filteredNav.value.filter(item => item.position === 'bottom'))

  const isActive = (item: NavItem | NavChild, path: string) => {
    if ('exact' in item && item.exact) return path === item.match
    return path.startsWith(item.match)
  }

  return { topNav, bottomNav, isActive }
}
