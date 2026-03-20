<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Package class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Produk dan Layanan</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-xs text-neutral-400 font-medium mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Produk dan Layanan
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-6 w-full">
      <DataTable 
        flat 
        :columns="columns"
        :loading="loading"
        :is-empty="!loading && services.length === 0"
        v-model:search-query="searchQuery"
      >
        <template #filters>
          <div class="dropdown dropdown-bottom md:dropdown-start">
            <div tabindex="0" role="button" class="btn btn-outline border-primary text-primary btn-md h-10 px-4 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors w-full md:w-auto">
              <Filter class="w-4 h-4 text-primary" />
              Filter
            </div>
            <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[calc(100vw-2rem)] md:w-[450px] shadow-xl border border-base-200 mt-2 left-0 md:left-auto">
              <div class="card-body p-0">
                <div class="flex items-center justify-between px-6 py-4 border-b border-base-200">
                  <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                  <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                </div>
                <div class="p-6 space-y-4 max-h-[60vh] md:max-h-[45vh] overflow-y-auto">
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Tanggal Aktif</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Dari:</label>
                        <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                        <input type="date" class="input input-bordered w-full rounded-lg text-sm h-10" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-neutral-400 text-xs font-medium">Status</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 font-medium">
                      <option selected disabled>Semua Status</option>
                      <option>Aktif</option>
                      <option>Dihentikan</option>
                    </select>
                  </div>
                </div>
                <div class="p-4 border-t border-base-200 flex items-center justify-between">
                  <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold h-10 px-6">Atur Ulang</button>
                  <button class="btn bg-primary border-none text-white hover:bg-primary/90 btn-sm rounded-lg text-sm font-semibold h-10 px-6">Terapkan</button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #body="{ isColumnVisible }">
          <tbody class="text-sm text-neutral-600">
            <tr v-for="(item, index) in services" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
              <td v-show="isColumnVisible('name')" class="text-primary font-medium py-3 border-r border-base-200 ps-4">{{ item.name }}</td>
              <td v-show="isColumnVisible('lastRef')" class="py-3 border-r border-base-200 ps-4">{{ item.lastRef }}</td>
              <td v-show="isColumnVisible('status')" class="py-3 border-r border-base-200 text-center px-4">
                <div :class="[
                  'badge border-none font-semibold text-[12px] rounded-lg w-full py-3',
                  item.status === 'Aktif' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-500'
                ]">
                  {{ item.status }}
                </div>
              </td>
              <td v-show="isColumnVisible('points')" class="py-3 border-r border-base-200 ps-4">{{ item.points }}</td>
              <td v-show="isColumnVisible('customers')" class="py-3 text-primary font-medium ps-4">{{ item.customers }}</td>
            </tr>
          </tbody>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleHelp, ListFilter, X, Package, Filter } from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-white'
})

const columns = [
  { label: 'Nama Layanan', key: 'name', sortable: true },
  { label: 'Referensi Terakhir', key: 'lastRef', sortable: true },
  { label: 'Status Layanan', key: 'status', sortable: true },
  { label: 'Poin Didapatkan', key: 'points', sortable: true },
  { label: 'Pelanggan Anda', key: 'customers', sortable: true }
]

const loading = ref(false)
const searchQuery = ref('')

const services = [
  { name: 'Nusanet Broadband Business EDGE100', lastRef: '28/12/2025', status: 'Aktif', points: 5678, customers: 99 },
  { name: 'Nusanet Broadband Business EDGE200', lastRef: '28/12/2025', status: 'Aktif', points: 2231, customers: 54 },
  { name: 'Nusanet Broadband Business EDGE300', lastRef: '28/12/2025', status: 'Aktif', points: 2332, customers: 21 },
  { name: 'Nusanet Dedicated Business NOVA90', lastRef: '28/12/2025', status: 'Aktif', points: 4321, customers: 14 },
  { name: 'Nusanet Dedicated Business NOVA280', lastRef: '28/12/2025', status: 'Aktif', points: 3384, customers: 12 },
  { name: 'Nusafiber Selecta Basic 30', lastRef: '28/12/2025', status: 'Aktif', points: 831, customers: 3 },
  { name: 'Nusafiber Selecta Prime 100', lastRef: '22/12/2025', status: 'Aktif', points: 400, customers: 1 },
  { name: 'Nusafiber Selecta Prime 200', lastRef: '22/12/2025', status: 'Aktif', points: 1210, customers: 5 },
  { name: 'Google Workspace Starter', lastRef: '22/12/2025', status: 'Aktif', points: 4712, customers: 33 },
  { name: 'Google Workspace Business', lastRef: '22/12/2025', status: 'Aktif', points: 3942, customers: 12 },
  { name: 'Nusawork Business', lastRef: '22/12/2025', status: 'Dihentikan', points: 763, customers: 3 },
  { name: 'Nusawork Advance', lastRef: '22/12/2025', status: 'Dihentikan', points: 100, customers: 1 }
]
</script>
