<template>
  <div class="h-screen flex flex-col font-sans text-base-content bg-base-200 overflow-hidden">
    <!-- Header is now on top and spans full width -->
    <AppHeader class="z-[60]" />

    <div class="drawer lg:drawer-open flex-1 overflow-hidden">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />
      
      <div :class="['drawer-content flex flex-col items-center justify-start overflow-y-auto w-full scroll-smooth', $route.meta.bgColor || 'bg-[#F7FDF9]']">
        <main class="flex-1 w-full p-4 md:p-6 lg:p-8 min-h-full">
          <slot />
        </main>
      </div> 
      
      <div class="drawer-side z-50 lg:h-full lg:sticky lg:top-0">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <AppSidebar class="h-full" />
      </div>
    </div>
  </div>
</template>
