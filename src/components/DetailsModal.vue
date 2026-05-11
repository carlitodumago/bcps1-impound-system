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
        <button class="btn btn-primary" @click="doPrintReceipt">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Receipt
        </button>
        <button class="btn btn-secondary" @click="showDetailsModal = false">Close</button>
      </div>
    </div>
  </div>

  <!-- Hidden printable receipt (teleported outside #app-shell) -->
  <Teleport to="body">
  <div v-if="detailRecord" id="details-receipt-print" class="details-print-area">
    <div class="receipt-preview" style="padding: 0 120px;">
      <div class="receipt-header" style="display:flex; justify-content:center; align-items:center; gap:0px; margin-bottom:10px; text-align:center;">
        <div style="margin-bottom:10px; margin-right:-20px;">
          <img src="/logo-pnp.png" style="width:80px; height:auto;" alt="PNP Logo" />
        </div>
        <div class="header-text" style="text-align:center; margin-top:20px;">
          <div style="font-size:12pt; margin-bottom:2px;">Republic of the Philippines</div>
          <div style="font-size:12pt; margin-bottom:2px;">NATIONAL POLICE COMMISSION</div>
          <div style="font-size:12pt; margin-bottom:2px;">PHILIPPINE NATIONAL POLICE</div>
          <div style="font-size:12pt; margin-bottom:2px;">BUTUAN CITY POLICE OFFICE</div>
          <div style="font-size:12pt; font-weight:bold; margin-bottom:2px;">BUTUAN CITY POLICE STATION 1</div>
          <div style="font-size:12pt;">Butuan City</div>
        </div>
        <div style="margin-bottom:10px; margin-left:-20px;">
          <img src="/logo-bcpo.png" style="width:100px; height:auto;" alt="BCPO Logo" />
        </div>
      </div>
      <div class="receipt-date" style="text-align:left;margin-top:5px;margin-bottom:0px;font-size:8pt;">Date: <span style="display:inline-block;min-width:120px;border-bottom:1px solid #000;">{{ detailRecord.date ? fmtDate(detailRecord.date) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}</span></div>
      <div class="receipt-title" style="font-family:'Book Antiqua', Palatino, serif; font-size:10pt; letter-spacing:3px; font-weight:bold; text-decoration:underline; text-align:center; margin-bottom:15px; margin-right:15px;">IMPOUNDING RECEIPT</div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Type of Vehicle:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.type }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Plate no.:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.plate }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Color:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.color }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Driver's Name:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.driver }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Address:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.driverAddress }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Registered Owner:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.owner }}</div></div>
      <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal;"><span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Address:</span><div class="field-value" style="display:inline-block; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.ownerAddress }}</div></div>
      <div class="violations-section" style="margin-top:20px; font-size:9pt; font-weight:normal;">
        <strong style="font-size:9pt; font-weight:bold;">VIOLATIONS:</strong>
        <div class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;"><span class="vio-num" style="width:30px; font-weight:normal;">1.</span><span class="vio-line" style="border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.vio1 }}</span></div>
        <div class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;"><span class="vio-num" style="width:30px; font-weight:normal;">2.</span><span class="vio-line" style="border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ detailRecord.vio2 }}</span></div>
        <div v-if="detailRecord.extraVios" v-for="(ev, idx) in detailRecord.extraVios.filter(x => x)" :key="idx" class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;">
          <span class="vio-num" style="width:30px; font-weight:normal;">{{ idx + 3 }}.</span><span class="vio-line" style="border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ ev }}</span>
        </div>
      </div>
      <div class="receipt-body" style="text-indent:60px; font-size:9pt; line-height:1.6; margin-top:15px; margin-bottom:10px; text-align:justify;">Subject MV/MC was apprehended by BCPO Station 1 personnel for violation/s as stated above on <u>&nbsp;{{ detailRecord.date ? fmtDate(detailRecord.date) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> at about <u>&nbsp;{{ detailRecord.time ? fmtTime(detailRecord.time) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> along the vicinity of <u>&nbsp;{{ detailRecord.location || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> and same was brought for safekeeping subject for the investigation/verification and proper disposition.</div>
      <div class="receipt-note" style="margin-bottom:10px; font-size:9pt;">Note: Subject MV/MC shall only be released upon presentation of its pertinent original documents and agreement.</div>
      <div class="receipt-sigs" style="position:relative; min-height:180px;">
        <div class="apprehending" style="position:absolute; right:0; top:0; width:350px;">
          <div style="font-size:10pt; margin-bottom:20px; text-align:left;">Apprehending Officer:</div>
          <div style="display:flex;flex-direction:column;gap:25px;align-items:flex-end;">
            <div class="sig-line-block" style="margin-top:0;align-items:center;">
              <div style="font-weight:bold;font-size:9pt;text-align:center;margin-bottom:2px">{{ detailRecord.officer }}</div>
              <div style="width:260px;border-top:1px solid #000;"></div>
            </div>
            <div class="sig-line-block" style="margin-top:0;align-items:center;">
              <div style="font-weight:bold;font-size:9pt;text-align:center;margin-bottom:2px">{{ detailRecord.officer2 }}</div>
              <div style="width:260px;border-top:1px solid #000;"></div>
            </div>
          </div>
        </div>
        <div class="conformed" style="position:absolute; left:0; top:110px; width:300px;">
          <div style="font-size:9pt;margin-bottom:20px">Conformed:</div>
          <div class="sig-line-block" style="align-items:center; margin-top:0; padding-left:40px;">
            <div style="width:220px;border-top:1px solid #000;padding-top:4px;font-size:9pt;text-align:center;">Owner/Driver/Possessor</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
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

function doPrintReceipt() {
  document.body.setAttribute('data-print-mode', 'details-receipt')
  window.print()
  setTimeout(() => {
    document.body.removeAttribute('data-print-mode')
  }, 100)
}
</script>

<style scoped>
.detail-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px }
.detail-item { display:flex;flex-direction:column;gap:3px }
.detail-item.full { grid-column:1/-1 }
.detail-label { font-size:11px;color:var(--gray);font-weight:600;letter-spacing:0.5px;text-transform:uppercase }
.detail-val { font-size:13px;color:rgba(255,255,255,0.9) }
.details-print-area { display:none }
</style>
