<template>
  <div>
    <div class="page-header">
      <div class="breadcrumb"><span @click="page='dashboard'" style="cursor:pointer">Home</span> <span style="color:var(--gray)">›</span> Impound Records</div>
      <h1>Impound Records</h1>
      <p>Complete searchable registry of all impounded vehicles</p>
    </div>

    <div class="filter-bar">
      <input v-model="searchQ" placeholder="🔍 Search plate, driver, officer..." />
      <select v-model="filterStatus"><option value="">All Status</option><option>Impounded</option><option>Released</option><option>Pending</option></select>
      <select v-model="filterType"><option value="">All Vehicles</option><option>Motorcycle</option><option>Car</option><option>SUV</option><option>Truck</option><option>Van</option><option>Jeepney</option></select>
      <button class="btn btn-secondary btn-sm" @click="downloadCSV(filteredRecords)">⬇ CSV</button>
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>#</th><th>Date</th><th>Plate</th><th>Type</th><th>Color</th><th>Driver</th><th>Owner</th><th>Violation 1</th><th>Officer</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr v-for="(r,i) in filteredRecords" :key="r.id">
            <td style="color:var(--gray)">{{ i+1 }}</td>
            <td class="nowrap">{{ fmtDate(r.date) }}</td>
            <td><strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif">{{ r.plate }}</strong></td>
            <td>{{ r.type }}</td><td>{{ r.color }}</td><td>{{ r.driver }}</td><td>{{ r.owner }}</td><td>{{ r.vio1 }}</td><td>{{ r.officer }}</td>
            <td><span class="badge" :class="r.status==='Impounded'?'badge-impounded':r.status==='Released'?'badge-released':'badge-pending'">{{ r.status }}</span></td>
            <td>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm" @click="viewDetails(r)">View Details</button>
                <button class="btn btn-info btn-sm" @click="viewRecord(r)">View Receipt</button>
                <button class="btn btn-secondary btn-sm" @click="editRecord(r)">Edit</button>
                <button class="btn btn-success btn-sm" v-if="r.status === 'Impounded'" @click="releaseVehicle(r)">Release</button>
                <button class="btn btn-warning btn-sm" v-if="r.status === 'Released'" @click="impoundVehicle(r)">Impound</button>
                <button class="btn btn-danger btn-sm" @click="deleteRecord(r)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredRecords.length===0"><td colspan="11"><div class="empty-state"><p>No records match your filters.</p></div></td></tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:12px;font-size:12px;color:var(--gray)">Showing {{ filteredRecords.length }} of {{ records.length }} records</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImpoundStore, fmtDate } from '../../composables/useImpoundStore.js'

const { page, records, downloadCSV, viewRecord, viewDetails, editRecord, deleteRecord, releaseVehicle, impoundVehicle } = useImpoundStore()

const searchQ = ref(''); const filterStatus = ref(''); const filterType = ref('')

const filteredRecords = computed(() => records.value.filter(r => {
  const q = searchQ.value.toLowerCase()
  return (!q || r.plate.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || r.officer.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q))
    && (!filterStatus.value || r.status === filterStatus.value)
    && (!filterType.value   || r.type   === filterType.value)
}))
</script>
