<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Welcome Banner -->
    <div class="card bg-base-100 shadow-sm border border-base-200 w-full mb-2">
      <div class="card-body p-6 lg:p-8">
        <h2 class="text-2xl font-bold text-neutral-800">Selamat Datang, Rupert 👋</h2>
        <p class="text-neutral-500 mt-1">Berikut adalah ringkasan aktivitas referral Anda</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <!-- Total Pelanggan -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Total Pelanggan</p>
            <h3 class="text-3xl font-bold mt-2 text-neutral-800">320</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <Users class="w-8 h-8" />
          </div>
        </div>
      </div>

      <!-- Total Poin Aktif -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Total Poin Aktif</p>
            <h3 class="text-3xl font-bold mt-2 text-neutral-800">18876</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <HandCoins class="w-8 h-8" />
          </div>
        </div>
      </div>

      <!-- Layanan Direferensikan -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6 flex flex-row items-start justify-between">
          <div>
            <p class="text-neutral-500 font-medium text-sm">Layanan Direferensikan</p>
            <h3 class="text-3xl font-bold mt-2 text-neutral-800">24</h3>
            <div class="flex items-center gap-1 mt-4 text-primary text-xs font-medium">
              <ArrowUpRight class="w-3.5 h-3.5" />
              <span>12% dari bulan lalu</span>
            </div>
          </div>
          <div class="p-1 text-primary">
            <Box class="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <!-- Line Chart -->
      <div class="card bg-base-100 shadow-sm border border-base-200 lg:col-span-2">
        <div class="card-body p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="font-bold text-lg text-neutral-800">Pertumbuhan Pelanggan</h3>
              <p class="text-neutral-500 text-sm">Grafik pertumbuhan pelanggan bulan ini</p>
            </div>
            <select class="select select-bordered select-sm w-full max-w-xs rounded-lg bg-base-100 text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm">
              <option disabled selected>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          
        </div>
      </div>

      <!-- Top Services List -->
      <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-6 flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-lg text-neutral-800">Layanan Teratas</h3>
              <p class="text-neutral-500 text-sm">Berdasarkan total poin yang diperoleh</p>
            </div>
            <button class="btn btn-ghost btn-circle btn-sm text-primary transition-colors hover:bg-primary/10">
              <ArrowUpRight class="w-5 h-5" />
            </button>
          </div>
          
          <div class="flex flex-col gap-1 mt-2 flex-1 justify-between">
            <!-- Rank 1 -->
            <div class="flex items-center gap-4 py-3 border-b border-base-200 last:border-0">
              <div class="w-8 h-8 rounded-lg bg-[#2b7c41] text-white flex items-center justify-center font-bold text-sm shadow">1</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">Nusanet Broadband Business...</p>
                <p class="text-xs text-neutral-500">99 Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary text-sm">5678</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
            <!-- Rank 2 -->
            <div class="flex items-center gap-4 py-3 border-b border-base-200 last:border-0">
              <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow">2</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">Google Workspace Starter</p>
                <p class="text-xs text-neutral-500">48 Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary text-sm">4712</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
            <!-- Rank 3 -->
            <div class="flex items-center gap-4 py-3 border-b border-base-200 last:border-0">
              <div class="w-8 h-8 rounded-lg bg-[#73c847] text-white flex items-center justify-center font-bold text-sm shadow">3</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">Nusanet Dedicated Business...</p>
                <p class="text-xs text-neutral-500">34 Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary text-sm">4321</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
            <!-- Rank 4 -->
            <div class="flex items-center gap-4 py-3 border-b border-base-200 last:border-0">
              <div class="w-8 h-8 rounded-lg bg-[#a6e267] text-neutral-800 flex items-center justify-center font-bold text-sm shadow">4</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">Google Workspace Business</p>
                <p class="text-xs text-neutral-500">20 Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary text-sm">3942</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
            <!-- Rank 5 -->
            <div class="flex items-center gap-4 py-3 border-b border-base-200 last:border-0">
              <div class="w-8 h-8 rounded-lg bg-[#d9f5a8] text-neutral-800 flex items-center justify-center font-bold text-sm shadow">5</div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-neutral-800 text-sm truncate">Nusanet Dedicated Business...</p>
                <p class="text-xs text-neutral-500">24 Pelanggan</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary text-sm">3384</p>
                <p class="text-[10px] text-neutral-400 leading-none">Poin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Recent Users -->
    <div class="card bg-base-100 shadow-sm border border-base-200 w-full mb-6 relative overflow-hidden">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-bold text-lg text-neutral-800">Pelanggan Terbaru</h3>
            <p class="text-neutral-500 text-sm">Daftar pelanggan yang baru terdaftar</p>
          </div>
          <button class="btn btn-ghost btn-sm text-primary text-sm font-medium hover:bg-primary/10 group">
            Lihat Semua
            <ArrowUpRight class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
        
        <div class="overflow-x-auto w-full">
          <table class="table table-zebra table-md w-full border-t border-b border-base-200">
            <!-- head -->
            <thead class="bg-base-100 text-neutral-700 font-semibold border-b border-base-200 text-xs uppercase tracking-wider">
              <tr>
                <th class="py-4">ID Pelanggan <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th class="py-4">Tanggal Registrasi <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th class="py-4">Pembayaran Terakhir <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th class="py-4">Periode Berlangganan <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th class="py-4">Status <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
                <th class="py-4">Nama AM <ChevronDown class="w-3 h-3 inline ml-1 opacity-50" /></th>
              </tr>
            </thead>
            <tbody class="text-sm text-neutral-600">
              <!-- row 1 -->
              <tr class="hover:bg-base-200/50 transition-colors border-b border-base-100">
                <td class="text-primary font-medium py-4">02001653518</td>
                <td class="py-4">28/03/2026</td>
                <td class="py-4">27/12/2027</td>
                <td class="py-4">27/12/2028</td>
                <td class="py-4"><div class="badge bg-accent border-none text-accent-content font-semibold text-[11px] py-2 px-3">Aktif</div></td>
                <td class="py-4">Jaya Gharaj</td>
              </tr>
              <!-- row 2 -->
              <tr class="hover:bg-base-200/50 transition-colors border-b border-base-100">
                <td class="text-primary font-medium py-4">02001267400</td>
                <td class="py-4">11/03/2026</td>
                <td class="py-4">27/12/2027</td>
                <td class="py-4">27/12/2028</td>
                <td class="py-4"><div class="badge bg-accent border-none text-accent-content font-semibold text-[11px] py-2 px-3">Aktif</div></td>
                <td class="py-4">Jaka Panggabean</td>
              </tr>
              <!-- row 3 -->
              <tr class="hover:bg-base-200/50 transition-colors border-b border-base-100">
                <td class="text-primary font-medium py-4">02001651535</td>
                <td class="py-4">10/03/2026</td>
                <td class="py-4">27/12/2027</td>
                <td class="py-4">27/12/2028</td>
                <td class="py-4"><div class="badge bg-accent border-none text-accent-content font-semibold text-[11px] py-2 px-3">Aktif</div></td>
                <td class="py-4">Mauliddana Putra</td>
              </tr>
              <!-- row 4 -->
              <tr class="hover:bg-base-200/50 transition-colors border-b border-base-100">
                <td class="text-primary font-medium py-4">02001487443</td>
                <td class="py-4">12/02/2026</td>
                <td class="py-4">28/12/2027</td>
                <td class="py-4">12/06/2028</td>
                <td class="py-4"><div class="badge bg-accent border-none text-accent-content font-semibold text-[11px] py-2 px-3">Aktif</div></td>
                <td class="py-4">Nicholas Simbolon</td>
              </tr>
              <!-- row 5 -->
              <tr class="hover:bg-base-200/50 transition-colors">
                <td class="text-primary font-medium py-4">02001651532</td>
                <td class="py-4">01/02/2026</td>
                <td class="py-4">28/12/2027</td>
                <td class="py-4">Sep 2028 - Sep 2028</td>
                <td class="py-4"><div class="badge bg-accent border-none text-accent-content font-semibold text-[11px] py-2 px-3">Aktif</div></td>
                <td class="py-4">Mauliddana Putra</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination footer -->
        <div class="flex items-center justify-between mt-6 text-sm">
          <div class="text-neutral-500">
            Showing 1 to 5 of 5 entries
          </div>
          <div class="join border border-base-200 shadow-sm rounded-lg">
            <button class="join-item btn btn-sm bg-base-100 text-neutral-400 hover:bg-base-200 btn-disabled"><ChevronFirst class="w-4 h-4" /></button>
            <button class="join-item btn btn-sm bg-base-100 text-neutral-400 hover:bg-base-200 btn-disabled"><ChevronLeft class="w-4 h-4" /></button>
            <button class="join-item btn btn-sm bg-primary text-primary-content hover:bg-primary/90 border-0">1</button>
            <button class="join-item btn btn-sm bg-base-100 text-neutral-600 hover:bg-base-200 border-x-0 border-y-base-200">2</button>
            <button class="join-item btn btn-sm bg-base-100 text-neutral-600 hover:bg-base-200 border-x border-base-200 border-y-base-200">3</button>
            <button class="join-item btn btn-sm bg-base-100 text-neutral-400 hover:bg-base-200"><ChevronRight class="w-4 h-4" /></button>
            <button class="join-item btn btn-sm bg-base-100 text-neutral-400 hover:bg-base-200"><ChevronLast class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, HandCoins, Box, ArrowUpRight, 
  ChevronDown, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast 
} from 'lucide-vue-next'
</script>
