<template>
  <div class="min-h-screen flex flex-col font-body selection:bg-primary/10 selection:text-primary">
    <div class="flex-1 flex flex-col w-full max-w-6xl mx-auto space-y-6 py-8">
      <!-- Header Card -->
      <div class="card bg-white border border-base-200 rounded-2xl shadow-sm">
        <div class="flex items-center justify-between px-8 py-2">
          <!-- Logo -->
          <div class="inline-flex flex-col">
            <div class="font-display gap-0 flex flex-col leading-none">
              <span class="text-gray-800 font-semibold text-3xl">kawan</span>
              <span class="text-primary font-semibold text-3xl -mt-2">nusa</span>
            </div>
            <p class="text-[4px] text-gray-900 tracking-widest uppercase mt-1 font-body">
              Portal Referal PT Media Antar Nusa
            </p>
          </div>
          <h1 class="text-xl font-semibold text-neutral-800">Pendaftaran Referal Baru</h1>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>
