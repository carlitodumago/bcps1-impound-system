<template>
  <div class="modal-bg" v-if="showDetailsModal" @click.self="showDetailsModal = false" style="z-index:1100">
    <div class="modal" style="max-width:680px;padding:0;overflow:hidden">
      <div class="modal-header" style="padding:16px 24px;margin-bottom:0;border-bottom:1px solid var(--border2)">
        <h2 style="display:flex;align-items:center;gap:10px">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Record Details — <span style="color:var(--gold2)">{{ detailRecord?.plate }}</span>
        </h2>
        <button class="modal-close" @click="showDetailsModal = false">✕</button>
      </div>

      <div v-if="detailRecord" style="padding:20px 24px;max-height:70vh;overflow-y:auto">
        <!-- Status -->
        <div style="margin-bottom:16px">
          <span class="badge" :class="detailRecord.status==='Impounded'?'badge-impounded':detailRecord.status==='Released'?'badge-released':'badge-pending'" style="font-size:13px;padding:6px 14px">
            {{ detailRecord.status }}
          </span>
          <span style="font-size:12px;color:var(--gray);margin-left:12px">Record #{{ detailRecord.id }}</span>
        </div>

        <!-- Vehicle Info -->
        <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-bottom:12px">🚗 VEHICLE INFORMATION</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Type</span><span class="detail-val">{{ detailRecord.type || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Plate No.</span><span class="detail-val" style="color:var(--gold2);font-weight:700;font-size:15px">{{ detailRecord.plate || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Color</span><span class="detail-val">{{ detailRecord.color || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Engine No.</span><span class="detail-val">{{ detailRecord.engineNo || '—' }}</span></div>
            <div class="detail-item full"><span class="detail-label">Chassis No.</span><span class="detail-val">{{ detailRecord.chassisNo || '—' }}</span></div>
          </div>
        </div>

        <!-- Apprehension Info -->
        <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-bottom:12px">📋 APPREHENSION DETAILS</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Date</span><span class="detail-val">{{ fmtDate(detailRecord.date) }}</span></div>
            <div class="detail-item"><span class="detail-label">Time</span><span class="detail-val">{{ fmtTime(detailRecord.time) }}</span></div>
            <div class="detail-item full"><span class="detail-label">Location</span><span class="detail-val">{{ detailRecord.location || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Violation 1</span><span class="detail-val">{{ detailRecord.vio1 || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Violation 2</span><span class="detail-val">{{ detailRecord.vio2 || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Officer 1</span><span class="detail-val">{{ detailRecord.officer || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Officer 2</span><span class="detail-val">{{ detailRecord.officer2 || '—' }}</span></div>
          </div>
        </div>

        <!-- Driver & Owner -->
        <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-bottom:12px">👤 DRIVER & OWNER</div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Driver</span><span class="detail-val">{{ detailRecord.driver || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Driver Address</span><span class="detail-val">{{ detailRecord.driverAddress || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Registered Owner</span><span class="detail-val">{{ detailRecord.owner || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Owner Address</span><span class="detail-val">{{ detailRecord.ownerAddress || '—' }}</span></div>
          </div>
        </div>

        <!-- Vehicle Photo -->
        <div v-if="detailRecord.photo" style="margin-bottom:14px;border-radius:10px;overflow:hidden;border:1px solid var(--border)">
          <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;padding:12px 16px 8px;background:rgba(201,168,76,0.06)">📷 VEHICLE PHOTO</div>
          <div style="background:rgba(0,0,0,0.3);padding:12px;display:flex;justify-content:center">
            <img :src="detailRecord.photo" alt="Vehicle photo" style="max-width:100%;max-height:360px;border-radius:8px;object-fit:contain;cursor:pointer" @click="openFullPhoto" />
          </div>
        </div>
        <!-- Remarks -->
        <div v-if="detailRecord.remarks" style="background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:10px;padding:14px">
          <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;margin-bottom:8px">📝 REMARKS</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.6">{{ detailRecord.remarks }}</div>
        </div>
      </div>

      <div style="padding:14px 24px;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border2)">
        <button class="btn btn-secondary" @click="showDetailsModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImpoundStore, fmtDate, fmtTime } from '../composables/useImpoundStore.js'
const { showDetailsModal, detailRecord } = useImpoundStore()

function openFullPhoto() {
  if (detailRecord.value?.photo) {
    const w = window.open()
    w.document.write(`<html><head><title>Vehicle Photo</title><style>body{margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh}img{max-width:100%;max-height:100vh;object-fit:contain}</style></head><body><img src="${detailRecord.value.photo}" /></body></html>`)
  }
}
</script>

<style scoped>
.detail-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px }
.detail-item { display:flex;flex-direction:column;gap:3px }
.detail-item.full { grid-column:1/-1 }
.detail-label { font-size:11px;color:var(--gray);font-weight:600;letter-spacing:0.5px;text-transform:uppercase }
.detail-val { font-size:13px;color:rgba(255,255,255,0.9) }
</style>
