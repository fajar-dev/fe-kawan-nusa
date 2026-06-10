<template>
  <aside class="menu bg-base-100 h-full w-64 p-2 text-base-content flex flex-col justify-between border-r border-base-300">
    <div>
      <ul class="menu w-full gap-1.5 lg:mt-3 mt-18">
        <li v-for="item in topNav" :key="item.to">
          <!-- With children (expandable) -->
          <details v-if="item.children" :open="$route.path.startsWith(item.match)">
            <summary 
              class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors cursor-pointer list-none flex items-center gap-2"
              :class="{ 'text-primary bg-primary/10': isActive(item, $route.path) }"
            >
              <component :is="item.icon" class="w-5 h-5" :class="{ 'text-primary': isActive(item, $route.path) }" />
              <div class="flex items-center w-40">
                <span>{{ item.label }}</span>
              </div>
            </summary>
            <ul class="mt-1 gap-1.5 ml-4">
              <li v-for="child in item.children" :key="child.to">
                <NuxtLink 
                  :to="child.to" 
                  class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2 font-medium transition-all"
                  :class="{ 'text-primary active': isActive(child, $route.path) }"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </details>

          <!-- Simple link -->
          <NuxtLink 
            v-else
            :to="item.to" 
            class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors"
            :class="{ 'bg-primary text-primary-content active hover:bg-primary/90': isActive(item, $route.path) }"
          >
            <component :is="item.icon" class="w-5 h-5" :class="{ 'text-white': isActive(item, $route.path) }" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    
    <div class="mt-auto">
      <ul class="menu w-full gap-1">
        <li v-for="item in bottomNav" :key="item.to">
          <NuxtLink 
            :to="item.to" 
            class="text-neutral-600 hover:bg-base-200 rounded-lg px-3 py-2.5 font-medium transition-colors"
            :class="{ 'bg-primary text-primary-content active hover:bg-primary/90': isActive(item, $route.path) }"
          >
            <component :is="item.icon" class="w-5 h-5" :class="{ 'text-white': isActive(item, $route.path) }" />
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
      <div class="px-6 py-2 text-center">
        <p class="text-xs text-neutral-400">version: 2.1.0</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { topNav, bottomNav, isActive } = useNavigation()
</script>
