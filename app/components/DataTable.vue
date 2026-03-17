<template>
  <div :class="[
    'w-full mb-6',
    flat ? '' : 'card bg-base-100 shadow-xs border border-base-200'
  ]">
    <div :class="flat ? '' : 'card-body p-6'">
      <!-- Title & Action -->
      <div v-if="title || $slots['title-action']" class="flex items-center justify-between mb-4">
        <div>
          <h3 v-if="title" class="font-semibold text-lg text-neutral-800">{{ title }}</h3>
          <p v-if="description" class="text-neutral-500 text-sm">{{ description }}</p>
        </div>
        <slot name="title-action" />
      </div>

      <!-- Filters Slot -->
      <div v-if="$slots.filters" class="mb-6">
        <slot name="filters" />
      </div>
      
      <!-- Table Content -->
      <div class="overflow-x-auto w-full">
        <table class="table table-md w-full border-separate border-spacing-0 border border-base-200 rounded-sm bg-base-100">
          <slot name="header" />
          <tbody v-if="isEmpty">
            <tr>
              <td colspan="100" class="py-20 text-center">
                <div class="flex flex-col items-center justify-center">
                  <img src="/assets/no-data.png" alt="No Data" class="w-64 h-auto mb-6" />
                  <h3 class="text-xl font-bold text-neutral-800 mb-2">Data Kosong</h3>
                  <p class="text-neutral-500">Saat ini belum ada data yang bisa ditampilkan.</p>
                </div>
              </td>
            </tr>
          </tbody>
          <slot v-else name="body" />
        </table>
      </div>

      <!-- Pagination footer -->
      <div class="flex flex-col lg:flex-row items-center lg:justify-between lg:gap-0 gap-4 justify-center mt-6 text-sm">
        <div class="text-neutral-500">
          {{ isEmpty ? 'Showing 0 to 0 of 0 entries' : 'Showing 1 to 5 of 5 entries' }}
        </div>
        <div class="join">
          <button class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 btn-disabled">
            <ChevronFirst class="w-4 h-4" />
          </button>
          <button class="btn border-none shadow-none btn-sm rounded-sm bg-base-100 text-neutral-400 hover:bg-base-200 btn-disabled">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button :class="['btn border-none shadow-none btn-sm rounded-sm', isEmpty ? 'bg-base-100 text-neutral-400' : 'bg-primary border-0 text-primary-content hover:bg-primary/90']">1</button>
          <button v-if="!isEmpty" class="btn border-none shadow-none btn-sm rounded-sm bg-white text-neutral-600 hover:bg-base-200 border border-base-200">2</button>
          <button v-if="!isEmpty" class="btn border-none shadow-none btn-sm rounded-sm bg-white text-neutral-600 hover:bg-base-200 border border-base-200">3</button>
          <button :class="['btn border-none shadow-none btn-sm rounded-sm bg-base-100', isEmpty ? 'text-neutral-400' : 'text-neutral-600 hover:bg-base-200']">
            <ChevronRight class="w-4 h-4" />
          </button>
          <button :class="['btn border-none shadow-none btn-sm rounded-sm bg-base-100', isEmpty ? 'text-neutral-400' : 'text-neutral-600 hover:bg-base-200']">
            <ChevronLast class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
  flat?: boolean
  isEmpty?: boolean
}>()
</script>
