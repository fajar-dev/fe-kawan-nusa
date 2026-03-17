<template>
  <div class="min-h-screen flex flex-col font-sans text-base-content bg-base-200">
    <!-- Header is now on top and spans full width -->
    <AppHeader class="sticky top-0 z-[60]" />

    <div class="drawer lg:drawer-open flex-1">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />
      
      <div class="drawer-content flex flex-col items-center justify-start">
        <main :class="['flex-1 w-full p-4 md:p-6 lg:p-8 mx-auto w-full', $route.meta.bgColor || 'bg-[#F7FDF9]']">
          <slot />
        </main>
      </div> 
      
      <div class="drawer-side z-50 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <AppSidebar />
      </div>
    </div>
  </div>
</template>
