<template>
  <div>
    <div class="page-header">
      <div class="breadcrumb"><span>Home</span> <span style="color:var(--gray)">›</span> Dashboard</div>
      <h1>Operations Dashboard</h1>
      <p>Real-time vehicle impound monitoring — Butuan City Police Station 1</p>
    </div>
    <div class="loading-bar"></div>

    <div class="stat-grid">
      <div class="stat-card gold"><div class="stat-icon gold">🚔</div><div class="stat-val gold">{{ totalImpounded }}</div><div class="stat-label">Total Impounded</div><div class="stat-sub">All-time vehicle records</div></div>
      <div class="stat-card green"><div class="stat-icon green">✅</div><div class="stat-val green">{{ totalReleased }}</div><div class="stat-label">Total Released</div><div class="stat-sub">Documents verified &amp; cleared</div></div>
      <div class="stat-card red"><div class="stat-icon red">🚨</div><div class="stat-val red">{{ activeImpounded }}</div><div class="stat-label">Currently Held</div><div class="stat-sub">Pending release</div></div>
      <div class="stat-card blue"><div class="stat-icon blue">📅</div><div class="stat-val blue">{{ todayCount }}</div><div class="stat-label">Today's Apprehensions</div><div class="stat-sub">{{ todayDate }}</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Monthly Activity</div></div>
        <div class="chart-wrap"><canvas ref="monthlyChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Impounded and Released</div></div>
        <div style="position:relative;height:300px"><canvas ref="typeChart"></canvas></div>
        <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;font-size:13px;color:#c8d0dc">
          <span v-for="item in typeStats" :key="item.label" style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:11px;height:11px;border-radius:50%;flex-shrink:0" :style="{background: item.color}"></span>
            {{ item.label }} {{ item.count }}
          </span>
        </div>
      </div>
    </div>

    <div style="margin-top:20px" class="card">
      <div class="card-header">
        <div class="card-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Recent Impound Records</div>
        <button class="btn btn-secondary btn-sm" @click="page = 'receipt'">+ New Entry</button>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Date</th><th>Plate No.</th><th>Vehicle</th><th>Driver</th><th>Violation</th><th>Officer</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr v-for="r in [...records].reverse()" :key="r.id">
              <td class="nowrap">{{ fmtDate(r.date) }}</td>
              <td><strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:15px">{{ r.plate }}</strong></td>
              <td>{{ r.type }} <span style="color:var(--gray)">{{ r.color }}</span></td>
              <td>{{ r.driver }}</td>
              <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.vio1 }}</td>
              <td>{{ r.officer }}</td>
              <td><span class="badge" :class="badgeClass(r.status)"><span class="dot" :class="dotClass(r.status)"></span>{{ r.status }}</span></td>
              <td>
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button class="btn btn-primary btn-sm" @click="viewDetails(r)">View Details</button>
                  <button class="btn btn-secondary btn-sm" @click="editRecord(r)">Edit</button>
                  <button class="btn btn-success btn-sm" v-if="r.status === 'Impounded'" @click="releaseVehicle(r)">Release</button>
                  <button class="btn btn-warning btn-sm" v-if="r.status === 'Released'" @click="impoundVehicle(r)">Impound</button>
                  <button class="btn btn-danger btn-sm" @click="deleteRecord(r)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="records.length === 0"><td colspan="8"><div class="empty-state"><p>No records yet. Create the first impound entry.</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top:20px" class="card">
      <PNPStationsMap />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useImpoundStore, fmtDate } from '../../composables/useImpoundStore.js'
import PNPStationsMap from '../PNPStationsMap.vue'

Chart.register(...registerables)

const { page, records, totalImpounded, totalReleased, activeImpounded, todayCount, todayDate, viewDetails, releaseVehicle, impoundVehicle, editRecord, deleteRecord } = useImpoundStore()

const monthlyChart = ref(null)
const typeChart    = ref(null)
let chartInstances = {}

function badgeClass(s) { return s === 'Impounded' ? 'badge-impounded' : s === 'Released' ? 'badge-released' : 'badge-pending' }
function dotClass(s)   { return s === 'Impounded' ? 'dot-impounded'   : s === 'Released' ? 'dot-released'   : 'dot-pending'   }

// ── Compute monthly data from REAL records ──
const monthlyData = computed(() => {
  const now = new Date()
  const labels = []
  const impCounts = []
  const relCounts = []
  // Last 9 months
  for (let i = 8; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const monthKey = `${yyyy}-${mm}`
    labels.push(d.toLocaleString('en', { month: 'short' }))
    impCounts.push(records.value.filter(r => r.date && r.date.startsWith(monthKey)).length)
    relCounts.push(records.value.filter(r => r.date && r.date.startsWith(monthKey) && r.status === 'Released').length)
  }
  return { labels, impCounts, relCounts }
})

// ── Compute Impounded vs Released breakdown ──
const typeStats = computed(() => {
  const impounded = records.value.filter(r => r.status === 'Impounded').length
  const released  = records.value.filter(r => r.status === 'Released').length
  return [
    { label: 'Impounded', count: impounded, color: '#e74c3c' },
    { label: 'Released',  count: released,  color: '#27ae60' },
  ]
})

function buildCharts() {
  // Destroy existing
  Object.values(chartInstances).forEach(c => c.destroy())
  chartInstances = {}

  if (monthlyChart.value) {
    const md = monthlyData.value
    chartInstances.monthly = new Chart(monthlyChart.value, {
      type: 'bar',
      data: { labels: md.labels, datasets: [
        { label: 'Impounded', data: md.impCounts, backgroundColor: 'rgba(201,168,76,0.7)', borderColor: '#c9a84c', borderWidth: 1, borderRadius: 4 },
        { label: 'Released',  data: md.relCounts, backgroundColor: 'rgba(39,174,96,0.6)',  borderColor: '#27ae60', borderWidth: 1, borderRadius: 4 },
      ]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { ticks: { color: '#8892a4', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
                  y: { ticks: { color: '#8892a4', font: { size: 11 }, precision: 0 }, grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true, suggestedMax: 5 } } }
    })
  }

  if (typeChart.value) {
    const ts = typeStats.value
    const hasData = ts.some(t => t.count > 0)
    chartInstances.types = new Chart(typeChart.value, {
      type: 'doughnut',
      data: {
        labels: ts.map(t => t.label),
        datasets: [{
          data: hasData ? ts.map(t => t.count) : [1, 1],
          backgroundColor: hasData ? ts.map(t => t.color) : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)'],
          borderColor: 'rgba(0,0,0,0)',
          hoverOffset: 8
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { display: false }, tooltip: { enabled: hasData } } }
    })
  }
}

// Rebuild charts when records change
watch(records, async () => {
  await nextTick()
  buildCharts()
}, { deep: true })

onMounted(() => buildCharts())
</script>
