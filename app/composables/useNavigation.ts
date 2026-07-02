import { Home, Users, UsersRound, Package, Coins, BookOpen, Settings, ArrowLeftRight, Gift, PackageSearch, Shapes } from 'lucide-vue-next'
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
    label: 'Referral',
    to: '/user',
    icon: UsersRound,
    match: '/user',
    role: 'admin',
    position: 'top',
  },
  {
    label: 'Input Poin Referral',
    to: '/point-submission',
    icon: Coins,
    match: '/point-submission',
    role: 'admin',
    position: 'top',
  },
  {
    label: 'Tukar Poin',
    to: '/redemption',
    icon: Gift,
    match: '/redemption',
    role: 'admin',
    position: 'top',
    children: [
      { label: 'Tunai', to: '/redemption/cash', match: '/redemption/cash' },
      { label: 'Produk', to: '/redemption/product', match: '/redemption/product' },
      { label: 'Voucher', to: '/redemption/voucher', match: '/redemption/voucher' },
    ],
  },
  {
    label: 'Katalog Reward',
    to: '/catalog/admin/reward',
    icon: PackageSearch,
    match: '/catalog/admin',
    role: 'admin',
    position: 'top'
  },
  {
    label: 'Konten Edukasi',
    to: '/education/admin/article',
    icon: Shapes,
    match: '/education/admin',
    role: 'admin',
    position: 'top',
    children: [
      { label: 'Kategori', to: '/education/admin/category', match: '/education/admin/category' },
      { label: 'Artikel', to: '/education/admin/article', match: '/education/admin/article' },
      { label: 'Video', to: '/education/admin/video', match: '/education/admin/video' },
      { label: 'Template', to: '/education/admin/template', match: '/education/admin/template' },
      { label: 'Promosi', to: '/education/admin/promotion', match: '/education/admin/promotion' },
    ],
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
    role: 'user',
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
