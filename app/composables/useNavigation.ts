import { Home, Users, UsersRound, Package, Coins, BookOpen, Settings, ArrowLeftRight, Gift, PackageSearch, Shapes, Shield, Percent } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavChild {
  label: string
  to: string
  match: string
  permissionKey?: string
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
  permissionKey?: string
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
    permissionKey: 'dashboard',
  },
  {
    label: 'Referral',
    to: '/user',
    icon: UsersRound,
    match: '/user',
    role: 'admin',
    position: 'top',
    permissionKey: 'user',
    children: [
      { label: 'Data Referral', to: '/user', match: '/user', permissionKey: 'user' },
      { label: 'Persetujuan Registrasi', to: '/user/approval', match: '/user/approval', permissionKey: 'user.approval' },
    ],
  },
  {
    label: 'Input Poin Referral',
    to: '/point-submission',
    icon: Coins,
    match: '/point-submission',
    role: 'admin',
    position: 'top',
    permissionKey: 'point-submission',
  },
  {
    label: 'Rate Komisi',
    to: '/rate-commission',
    icon: Percent,
    match: '/rate-commission',
    role: 'admin',
    position: 'top',
    permissionKey: 'rate-commission',
  },
  {
    label: 'Tukar Poin',
    to: '/redemption',
    icon: Gift,
    match: '/redemption',
    role: 'admin',
    position: 'top',
    children: [
      { label: 'Tunai', to: '/redemption/cash', match: '/redemption/cash', permissionKey: 'redemption.cash' },
      { label: 'Produk', to: '/redemption/product', match: '/redemption/product', permissionKey: 'redemption.product' },
      { label: 'Voucher', to: '/redemption/voucher', match: '/redemption/voucher', permissionKey: 'redemption.voucher' },
    ],
  },
  {
    label: 'Katalog Reward',
    to: '/catalog/admin/reward',
    icon: PackageSearch,
    match: '/catalog/admin',
    role: 'admin',
    position: 'top',
    children: [
      { label: 'Kategori', to: '/catalog/admin/category', match: '/catalog/admin/category', permissionKey: 'catalog' },
      { label: 'Katalog', to: '/catalog/admin/reward', match: '/catalog/admin/reward', permissionKey: 'catalog' },
    ],
  },
  {
    label: 'Konten Edukasi',
    to: '/education/admin/article',
    icon: Shapes,
    match: '/education/admin',
    role: 'admin',
    position: 'top',
    permissionKey: 'education',
    children: [
      { label: 'Kategori', to: '/education/admin/category', match: '/education/admin/category', permissionKey: 'education' },
      { label: 'Artikel', to: '/education/admin/article', match: '/education/admin/article', permissionKey: 'education' },
      { label: 'Video', to: '/education/admin/video', match: '/education/admin/video', permissionKey: 'education' },
      { label: 'Template', to: '/education/admin/template', match: '/education/admin/template', permissionKey: 'education' },
      { label: 'Promosi', to: '/education/admin/promotion', match: '/education/admin/promotion', permissionKey: 'education' },
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
      { label: 'Tukar Poin', to: '/point/redeem', match: '/point/redeem' },
    ],
  },

  // ── Bottom section ──
  {
    label: 'Pengaturan Akses',
    to: '/role-permission',
    icon: Shield,
    match: '/role-permission',
    role: 'admin',
    position: 'bottom',
    permissionKey: 'role',
  },
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
    if (!path.startsWith(item.match)) return false

    // For children with overlapping prefixes (e.g. /user vs /user/approval), only the
    // most specific (longest) matching sibling should light up — otherwise both children
    // stay highlighted together whenever the more specific route is active.
    const parent = navItems.find(nav => nav.children?.includes(item as NavChild))
    if (parent?.children) {
      const longestMatch = Math.max(
        ...parent.children.filter(c => path.startsWith(c.match)).map(c => c.match.length)
      )
      return item.match.length === longestMatch
    }

    return true
  }

  return { topNav, bottomNav, isActive }
}
