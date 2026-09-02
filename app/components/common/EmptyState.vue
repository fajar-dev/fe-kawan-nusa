<template>
    <div class="flex flex-col items-center justify-center py-5">
        <img :src="image" :alt="title" class="w-52 h-auto mb-6" />
        <h3 class="text-xl font-bold text-neutral-800 mb-2">{{ title }}</h3>
        <p class="text-neutral-500">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    image?: string
}>(), {
    title: 'Data Kosong',
    description: 'Saat ini belum ada data yang bisa ditampilkan.',
    image: '/assets/no-data.png',
})
</script>
