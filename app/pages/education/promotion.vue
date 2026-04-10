<template>
    <div class="flex flex-col w-full">
        <AppToolbar>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <BadgePercent class="w-9 h-9 mt-1 text-neutral-800" />
                    <div>
                        <div class="flex items-center gap-2">
                        <h1 class="text-xl font-medium text-neutral-800">Update Promo</h1>
                        </div>
                        <p class="text-xs text-neutral-400 font-medium mt-0.5">
                            <NuxtLink to="/education" class="text-primary hover:underline">Edukasi</NuxtLink> / Update Promo
                        </p>
                    </div>
                </div>
            </div>
        </AppToolbar>

        <div class="space-y-10 pb-10">

        </div>
    </div>
</template>

<script setup lang="ts">
import { BadgePercent } from 'lucide-vue-next';


definePageMeta({
  bgColor: 'bg-white'
})

useSeoMeta({
  title: 'Kawan Nusa | Strategi Penawaran',
})
</script>

