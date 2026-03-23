<template>
  <div :class="[
    'w-full mb-6',
    flat ? '' : 'card bg-base-100 shadow-xs border border-base-200'
  ]">
    <div :class="flat ? '' : 'card-body p-6'">
      <!-- Title & Action -->
      <div v-if="title || $slots['title-action']" class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="font-semibold text-lg text-neutral-800">{{ title }}</h3>
          <p v-if="description" class="text-neutral-500 text-sm">{{ description }}</p>
        </div>
        <slot name="title-action" />
      </div>

      <!-- Filters & Search Section -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <!-- Filters Slot (Left Side) -->
          <div class="flex items-center gap-2 flex-wrap">
            <slot name="filters" />
          </div>

          <!-- Search & Columns Toggle (Right Side) -->
          <div class="flex items-center gap-2 w-full md:w-auto">
            <div v-if="showSearch" class="relative flex-1 md:w-64">
              <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                :value="searchQuery"
                @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                :placeholder="searchPlaceholder" 
                class="input input-bordered w-full pl-10 bg-white border-base-300 rounded-lg focus:outline-none focus:border-primary text-sm h-10"
              />
            </div>

            <!-- Column Toggle -->
            <div v-if="showColumnToggle" class="dropdown dropdown-bottom dropdown-end">
              <button tabindex="0" role="button" class="btn btn-ghost btn-sm h-10 w-10 p-0 text-primary hover:bg-base-200">
                <Columns3Cog class="w-5 h-5" />
              </button>
              <div tabindex="0" class="dropdown-content z-[101] card card-compact bg-base-100 w-56 shadow-xl border border-base-200 mt-2">
                <div class="card-body p-4">
                  <h3 class="font-bold text-sm text-neutral-800 mb-3 border-b border-base-200 pb-2">Toggle Columns</h3>
                  <div class="space-y-2">
                    <label v-for="col in columns" :key="col.key" class="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        class="checkbox checkbox-primary checkbox-sm rounded" 
                        :checked="isColumnVisible(col.key)"
                        @change="toggleColumn(col.key)"
                      />
                      <span class="text-sm text-neutral-600 group-hover:text-primary transition-colors">{{ col.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table Content -->
      <div class="overflow-x-auto w-full">
        <table class="table table-md w-full border-separate border-spacing-0 border border-base-200 rounded-sm bg-base-100">
          <!-- Table Header -->
          <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
            <tr>
              <th 
                v-for="col in columns" 
                v-show="isColumnVisible(col.key)"
                :key="col.key" 
                :class="['border-r border-base-200 font-medium transition-colors', col.sortable ? 'cursor-pointer hover:bg-base-300/50' : '']"
                @click="col.sortable ? handleSort(col.key) : null"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate">{{ col.label }}</span>
                  <div v-if="col.sortable" class="flex flex-col -space-y-1" :class="currentSort === col.key ? 'opacity-100' : 'opacity-20'">
                    <ChevronUp 
                      class="w-3.5 h-3.5" 
                      :class="currentSort === col.key && currentOrder === 'asc' ? 'text-primary' : ''" 
                    />
                    <ChevronDown 
                      class="w-3.5 h-3.5" 
                      :class="currentSort === col.key && currentOrder === 'desc' ? 'text-primary' : ''" 
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody v-if="loading" class="text-sm text-neutral-600">
            <tr v-for="n in 5" :key="n" class="border-b border-base-100 last:border-0 animate-pulse">
              <td v-for="col in columns" v-show="isColumnVisible(col.key)" :key="col.key" class="py-4 border-r border-base-200 px-4">
                <div class="h-4 bg-neutral-200 rounded-lg w-full opacity-50"></div>
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="isEmpty" class="text-sm text-neutral-600">
            <tr>
              <td :colspan="visibleColumnCount" class="py-10 text-center">
                <div class="flex flex-col items-center justify-center">
                  <img src="/assets/no-data.png" alt="No Data" class="w-52 h-auto mb-6" />
                  <h3 class="text-xl font-bold text-neutral-800 mb-2">Data Kosong</h3>
                  <p class="text-neutral-500">Saat ini belum ada data yang bisa ditampilkan.</p>
                </div>
              </td>           
            </tr>
          </tbody>

          <slot v-else name="body" :isColumnVisible="isColumnVisible" />
        </table>
      </div>

      <!-- Pagination footer -->
      <div class="flex flex-col lg:flex-row items-center lg:justify-between lg:gap-0 gap-4 justify-center mt-6 text-sm">
        <div class="text-neutral-500">
          Showing {{ (totalEntries ?? 0) > 0 ? `${totalFrom ?? 0} to ${totalTo ?? 0} of ${totalEntries ?? 0}` : '0 to 0 of 0' }} entries
        </div>
        <div class="join overflow-x-auto max-w-full">
          <button 
            class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 transition-colors"
            :disabled="currentPage === 1 || isEmpty || loading"
            @click="$emit('update:page', 1)"
          >
            <ChevronFirst class="w-4 h-4" />
          </button>
          
          <button 
            class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 transition-colors"
            :disabled="currentPage === 1 || isEmpty || loading"
            @click="$emit('update:page', currentPage - 1)"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <template v-for="page in visiblePages" :key="page">
            <button 
              v-if="page === '...'"
              class="btn btn-disabled border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400"
            >
              ...
            </button>
            <button 
              v-else
              :class="[
                'btn border-none shadow-none btn-sm rounded-sm transition-all text-xs h-8 min-h-0 px-3',
                currentPage === page 
                  ? 'bg-primary border-0 text-primary-content hover:bg-primary/90' 
                  : 'bg-white text-neutral-600 hover:bg-base-200 border border-base-200'
              ]"
              @click="$emit('update:page', page)"
            >
              {{ page }}
            </button>
          </template>

          <button 
            class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 transition-colors"
            :disabled="currentPage === lastPage || isEmpty || loading"
            @click="$emit('update:page', currentPage + 1)"
          >
            <ChevronRight class="w-4 h-4" />
          </button>

          <button 
            class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-600 hover:bg-base-200 transition-colors"
            :disabled="currentPage === lastPage || isEmpty || loading"
            @click="$emit('update:page', lastPage)"
          >
            <ChevronLast class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, 
  Search, Columns3Cog, ChevronUp, ChevronDown 
} from 'lucide-vue-next'

interface Column {
  label: string
  key: string
  sortable?: boolean
}

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  flat?: boolean
  loading?: boolean
  isEmpty?: boolean
  columns: Column[]
  totalFrom?: number
  totalTo?: number
  totalEntries?: number
  currentPage?: number
  lastPage?: number
  currentSort?: string
  currentOrder?: 'asc' | 'desc'
  searchQuery?: string
  searchPlaceholder?: string
  showSearch?: boolean
  showColumnToggle?: boolean
}>(), {
  currentPage: 1,
  lastPage: 1,
  totalFrom: 0,
  totalTo: 0,
  totalEntries: 0,
  columns: () => [],
  searchPlaceholder: 'Search',
  showSearch: true,
  showColumnToggle: true,
  currentOrder: 'desc'
})

const emit = defineEmits([
  'update:page', 
  'update:sort', 
  'update:order', 
  'update:searchQuery'
])

const visibleColumnKeys = ref<string[]>(props.columns.map(c => c.key))

watch(() => props.columns, (newCols) => {
  if (visibleColumnKeys.value.length === 0) {
    visibleColumnKeys.value = newCols.map(c => c.key)
  }
}, { immediate: true })

const isColumnVisible = (key: string) => visibleColumnKeys.value.includes(key)
const visibleColumnCount = computed(() => visibleColumnKeys.value.length)

const toggleColumn = (key: string) => {
  if (visibleColumnKeys.value.includes(key)) {
    if (visibleColumnKeys.value.length > 1) {
      visibleColumnKeys.value = visibleColumnKeys.value.filter(k => k !== key)
    }
  } else {
    visibleColumnKeys.value.push(key)
  }
}

const handleSort = (key: string) => {
  if (props.currentSort === key) {
    emit('update:order', props.currentOrder === 'asc' ? 'desc' : 'asc')
  } else {
    emit('update:sort', key)
    emit('update:order', 'asc')
  }
}

const visiblePages = computed(() => {
  const current = props.currentPage || 1
  const last = props.lastPage || 1
  const pages: (number | string)[] = []

  if (last <= 5) {
    for (let i = 1; i <= last; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(last - 1, current + 1)
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }
    if (current < last - 2) pages.push('...')
    if (!pages.includes(last)) pages.push(last)
  }
  return pages
})
</script>
