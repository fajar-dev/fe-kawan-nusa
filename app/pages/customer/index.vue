<template>
  <div class="flex flex-col w-full">
    <AppToolbar>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Users class="w-9 h-9 mt-1 text-neutral-800" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-medium text-neutral-800">Pelanggan Saya</h1>
              <CircleHelp class="w-4 h-4 text-neutral-400 cursor-pointer hover:text-primary transition-colors" />
            </div>
            <p class="text-[11px] text-neutral-400 font-medium tracking-wider mt-0.5">
              <NuxtLink to="/" class="text-primary hover:underline">Home</NuxtLink> / Pelanggan Saya
            </p>
          </div>
        </div>
      </div>
    </AppToolbar>

    <div class="flex flex-col gap-6 w-full">
      <!-- Table Section -->
      <DataTable flat>
      <!-- Filters Slot -->
      <template #filters>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Filter Dropdown -->
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-outline border-base-300 text-neutral-600 btn-sm h-10 mt-1 px-4 gap-2 rounded-lg hover:bg-base-200 hover:text-neutral-800 transition-colors">
              <ListFilter class="w-4 h-4 text-primary" />
              Filter
            </div>
            <div tabindex="0" class="dropdown-content z-[100] card card-compact bg-base-100 w-[450px] shadow-xl border border-base-200 mt-2">
              <div class="card-body p-0">
                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-2 border-b border-base-200">
                  <h3 class="font-bold text-lg text-neutral-800">Filter</h3>
                  <button class="btn btn-ghost btn-xs btn-circle"><X class="w-4 h-4" /></button>
                </div>
                
                <!-- Content -->
                <div class="p-6 space-y-4 max-h-[45vh] overflow-y-auto">
                  <!-- Tanggal Aktif -->
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-400 text-xs font-medium">Tanggal Aktif</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Dari:</label>
                        <div class="relative">
                          <input type="date" value="01/12/2026" class="input input-bordered w-full rounded-lg text-sm h-10 mt-1" />
                        </div>
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-xs font-medium text-neutral-800">Sampai:</label>
                        <div class="relative">
                          <input type="date" value="01/12/2026" class="input input-bordered w-full rounded-lg text-sm h-10 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tipe Industri -->
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-400 text-xs font-mediium">Tipe Industri</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 mt-1">
                      <option selected>Semua Industri</option>
                    </select>
                  </div>

                  <!-- Status -->
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-400 text-xs font-mediium">Status</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 mt-1">
                      <option selected>Aktif</option>
                      <option>Tidak Aktif</option>
                    </select>
                  </div>

                  <!-- Layanan -->
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-400 text-xs font-mediium">Layanan</span>
                      <span class="text-primary text-xs font-medium cursor-pointer hover:underline">Hapus Terpilih</span>
                    </div>
                    <select class="select select-bordered w-full rounded-lg text-sm h-10 mt-1">
                      <option selected>Semua Layanan</option>
                    </select>
                  </div>
                </div>

                <!-- Footer -->
                <div class="p-4 border-t border-base-200 flex items-center justify-between">
                  <button class="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold">
                    Atur Ulang
                  </button>
                  <button class="btn bg-[#e8f2e6] border-none text-[#5d8b4e] hover:bg-primary hover:text-white btn-sm rounded-lg text-sm font-semibold">
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="relative w-full md:w-64">
              <Search class="z-10 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search" 
                class="input input-sm h-10 mt-1 w-full pl-9 bg-base-100 border-base-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>
            <button class="btn btn-ghost btn-sm h-10 mt-1 w-10 p-0 text-primary hover:bg-primary/10">
              <Columns2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </template>

      <!-- Table Header -->
      <template #header>
        <thead class="bg-base-200/50 text-neutral-800 font-semibold border-b border-base-200">
          <tr>
            <th v-for="col in columns" :key="col.key" class="border-r border-base-200 font-medium py-3">
              <div class="flex items-center justify-between">
                {{ col.label }}
                <div class="flex flex-col -space-y-1 opacity-40">
                  <ChevronUp class="w-3.5 h-3.5" />
                  <ChevronDown class="w-3.5 h-3.5" />
                </div>
              </div>
            </th>
          </tr>
        </thead>
      </template>

      <!-- Table Body -->
      <template #body>
        <tbody class="text-sm text-neutral-600">
          <tr v-for="(item, index) in customers" :key="index" class="hover:bg-base-200/30 transition-colors border-b border-base-100 last:border-0">
            <td class="text-primary font-medium py-3 border-r border-base-200">{{ item.id }}</td>
            <td class="py-3 border-r border-base-200">{{ item.pic }}</td>
            <td class="py-3 border-r border-base-200 max-w-[150px]">{{ item.business }}</td>
            <td class="py-3 border-r border-base-200">
            <div class="badge bg-accent border-none text-primary font-semibold text-[12px] rounded-lg">{{ item.status  }}</div>
            </td>
            <td class="py-3 border-r border-base-200">{{ item.date }}</td>
            <td class="py-3 border-r border-base-200">
              <div class="flex items-center justify-between gap-2 px-2">
                <span class="truncate flex-1">{{ item.email }}</span>
                <div v-if="item.emailBadge" class="badge bg-accent border-none text-primary font-semibold text-[12px] rounded-lg shrink-0">
                  +{{ item.emailBadge }} <ChevronDown class="w-3 h-3" />
                </div>
              </div>
            </td>
            <td class="py-3 border-r border-base-200">
              <div class="flex items-center justify-between gap-2 px-2">
                <span class="truncate flex-1">{{ item.phone }}</span>
                <div v-if="item.phoneBadge" class="badge bg-accent border-none text-primary font-semibold text-[12px] rounded-lg shrink-0">
                  +{{ item.phoneBadge }} <ChevronDown class="w-3 h-3" />
                </div>
              </div>
            </td>
            <td class="py-3">{{ item.am }}</td>
          </tr>
        </tbody>
      </template>
    </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, CircleHelp, ListFilter, Search, Columns2, 
  ChevronUp, ChevronDown, Calendar, X 
} from 'lucide-vue-next'

definePageMeta({
  bgColor: 'bg-white'
})

const columns = [
  { label: 'ID Pelanggan', key: 'id' },
  { label: 'Nama PIC', key: 'pic' },
  { label: 'Nama Bisnis', key: 'business' },
  { label: 'Status', key: 'status' },
  { label: 'Tanggal Aktif', key: 'date' },
  { label: 'Email', key: 'email' },
  { label: 'No Telpon', key: 'phone' },
  { label: 'Nama AM', key: 'am' }
]

const customers = [
  { id: '02001653520', pic: 'Robert Fox', business: 'PT Rubah Oranye Indo...', status: 'Aktif', date: '-', email: 'foxrobert@email.c...', phone: '+6288456789012', am: 'Marudut Tampu...', emailBadge: '1', phoneBadge: '1' },
  { id: '02001653513', pic: 'Aulia Syera', business: 'PT Tulang Punggung', status: 'Aktif', date: '-', email: 'aulias@email.com', phone: '+6288456789012', am: 'Marudut Tampu...', emailBadge: null, phoneBadge: '2' },
  { id: '02001653518', pic: 'Wade Warren', business: '-', status: 'Aktif', date: '28/10/2025', email: 'wade@email.com', phone: '+6288123456789', am: 'Jaya Gharaj', emailBadge: '2', phoneBadge: '2' },
  { id: '02001267400', pic: 'Annette Black', business: 'PT Kecantikan Alami', status: 'Aktif', date: '15/08/2023', email: 'ann@email.com', phone: '+62881234567890', am: 'Jaka Pangga...', emailBadge: '2', phoneBadge: '2' },
  { id: '02001651535', pic: 'Savannah Nguyen', business: '-', status: 'Aktif', date: '18/09/2022', email: 'savnguyen@email.com', phone: '+6285456789012', am: 'Mauliddana Putra', emailBadge: null, phoneBadge: '2' },
  { id: '02001487443', pic: 'Anggi Edwarsa', business: 'PT Fenty Jelita Abadi', status: 'Aktif', date: '12/06/2022', email: 'anggifenty@emai...', phone: '+6288456789012', am: 'Nicholas Simbolon', emailBadge: '2', phoneBadge: '2' }
]
</script>
