<template>
  <div class="modal-bg" v-if="showModal" @click.self="showModal = false">
    <div class="modal" style="max-width:800px;padding:0;overflow:hidden">
      <div class="modal-header no-print" style="padding:16px 24px;margin-bottom:0;border-bottom:1px solid var(--border2)">
        <h2>Impounding Receipt — {{ selectedRecord?.plate }}</h2>
        <button class="modal-close" @click="showModal = false">✕</button>
      </div>

      <div v-if="selectedRecord" style="padding:0">
        <!-- Status bar -->
        <div class="no-print" style="padding:10px 24px;display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border2)">
          <span class="badge" :class="selectedRecord.status==='Impounded'?'badge-impounded':selectedRecord.status==='Released'?'badge-released':'badge-pending'">{{ selectedRecord.status }}</span>
          <span style="font-size:12px;color:var(--gray)">Receipt ID: IR-2025-{{ String(selectedRecord.id).padStart(4,'0') }}</span>
        </div>

        <!-- Receipt Preview -->
        <div style="padding:20px;background:#f8f8f8;overflow-y:auto;max-height:60vh">
          <div class="receipt-preview modal-print-content" style="background:#fff;">
            <div class="receipt-header" style="display:flex; justify-content:center; align-items:center; gap:0px; margin-bottom:24px; text-align:center;">
              <div style="margin-bottom:30px; margin-right:-20px;">
                <img src="/logo-pnp.png" style="width:80px; height:auto;" alt="PNP Logo" />
              </div>
              <div class="header-text" style="text-align:center; margin-top:50px;">
                <div style="font-size:12pt; margin-bottom:2px;">Republic of the Philippines</div>
                <div style="font-size:12pt; margin-bottom:2px;">NATIONAL POLICE COMMISSION</div>
                <div style="font-size:12pt; margin-bottom:2px;">PHILIPPINE NATIONAL POLICE</div>
                <div style="font-size:12pt; margin-bottom:2px;">BUTUAN CITY POLICE OFFICE</div>
                <div style="font-size:12pt; font-weight:bold; margin-bottom:2px;">BUTUAN CITY POLICE STATION 1</div>
                <div style="font-size:12pt;">Butuan City</div>
              </div>
              <div style="margin-bottom:20px; margin-left:-20px;">
                <img src="/logo-bcpo.png" style="width:100px; height:auto;" alt="BCPO Logo" />
              </div>
            </div>
            <div class="receipt-date" style="text-align:left;margin-top:5px;margin-bottom:0px;font-size:8pt;">Date: <span style="display:inline-block;min-width:180px;border-bottom:1px solid #000;margin-left:4px;">{{ selectedRecord.date ? fmtDate(selectedRecord.date) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}</span></div>
            <div class="receipt-title" style="font-family:'Book Antiqua', Palatino, serif; font-size:10pt; letter-spacing:3px; font-weight:bold; text-decoration:underline; text-align:center; margin-bottom:30px; margin-right:15px;">IMPOUNDING RECEIPT</div>
            
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Type of Vehicle:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.type }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Plate no.:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.plate }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Color:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.color }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Driver's Name:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.driver }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Address:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.driverAddress }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Registered Owner:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.owner }}</div>
            </div>
            <div class="field-row" style="margin-bottom:10px; font-size:9pt; font-weight:normal; display:flex; align-items:flex-end;">
              <span class="field-label" style="width:130px; display:inline-block; font-weight:normal;">Address:</span>
              <div class="field-value" style="display:inline-block; width:150px; border-bottom:1px solid #000; min-height:15px; font-weight:normal;">{{ selectedRecord.ownerAddress }}</div>
            </div>

            <div class="violations-section" style="margin-top:20px; font-size:9pt; font-weight:normal;">
              <strong style="font-size:9pt; font-weight:bold;">VIOLATIONS:</strong>
              <div class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;"><span class="vio-num" style="width:30px; font-weight:normal;">1.</span><span class="vio-line" style="flex:1; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ selectedRecord.vio1 }}</span></div>
              <div class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;"><span class="vio-num" style="width:30px; font-weight:normal;">2.</span><span class="vio-line" style="flex:1; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ selectedRecord.vio2 }}</span></div>
              <div v-if="selectedRecord.extraVios" v-for="(ev, idx) in selectedRecord.extraVios.filter(x => x)" :key="idx" class="vio-row" style="margin-top:10px; display:flex; font-size:8pt; font-weight:normal; padding-left:95px;">
                <span class="vio-num" style="width:30px; font-weight:normal;">{{ idx + 3 }}.</span><span class="vio-line" style="flex:1; border-bottom:1px solid #000; min-height:18px; font-weight:normal;">{{ ev }}</span>
              </div>
            </div>
            <div class="receipt-body" style="text-indent:60px; font-size:9pt; line-height:1.8; margin-top:30px; margin-bottom:20px; text-align:justify;">Subject MV/MC was apprehended by BCPO Station 1 personnel for violation/s as stated above on <u>&nbsp;{{ selectedRecord.date ? fmtDate(selectedRecord.date) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> at about <u>&nbsp;{{ selectedRecord.time ? fmtTime(selectedRecord.time) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> along the vicinity of <u>&nbsp;{{ selectedRecord.location || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}&nbsp;</u> and same was brought for safekeeping subject for the investigation/verification and proper disposition.</div>
            <div class="receipt-note" style="margin-bottom:60px; font-size:9pt;">Note: Subject MV/MC shall only be released upon presentation of its pertinent original documents and agreement.</div>
            <div class="receipt-sigs" style="position:relative; min-height:180px;">
              <div class="apprehending" style="position:absolute; right:0; top:0; width:350px;">
                <div style="font-size:10pt; margin-bottom:40px; text-align:left; ">Apprehending Officer:</div>
                <div style="display:flex;flex-direction:column;gap:30px;align-items:flex-end;">
                  <div class="sig-line-block" style="margin-top:0;align-items:center;">
                    <div style="font-weight:bold;font-size:9pt;text-align:center;margin-bottom:2px">{{ selectedRecord.officer }}</div>
                    <div style="width:260px;border-top:1px solid #000;"></div>
                  </div>
                  <div class="sig-line-block" style="margin-top:0;align-items:center;">
                    <div style="font-weight:bold;font-size:9pt;text-align:center;margin-bottom:2px">{{ selectedRecord.officer2 }}</div>
                    <div style="width:260px;border-top:1px solid #000;"></div>
                  </div>
                </div>
              </div>

              <div class="conformed" style="position:absolute; left:0; top:160px; width:300px;">
                <div style="font-size:9pt;margin-bottom:40px">Conformed:</div>
                <div class="sig-line-block" style="align-items:center; margin-top:0; padding-left:40px;">
                  <div style="width:220px;border-top:1px solid #000;padding-top:4px;font-size:9pt;text-align:center;">Owner/Driver/Possessor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="no-print" style="padding:16px 24px;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border2)">
          <button class="btn btn-success" v-if="selectedRecord.status==='Impounded'" @click="releaseVehicle(selectedRecord)">✅ Release</button>
          <button class="btn btn-warning" v-if="selectedRecord.status==='Released'" @click="impoundVehicle(selectedRecord)">🚔 Impound</button>
          <button class="btn btn-primary" @click="doPrint">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
          <button class="btn btn-secondary" @click="editRecord(selectedRecord)">✏️ Edit</button>
          <button class="btn btn-danger" @click="deleteRecord(selectedRecord)">🗑️ Delete</button>
          <button class="btn btn-secondary" @click="showModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImpoundStore, fmtDate, fmtTime } from '../composables/useImpoundStore.js'
const { showModal, selectedRecord, releaseVehicle, impoundVehicle, editRecord, deleteRecord } = useImpoundStore()

function doPrint() {
  document.body.classList.add('print-modal-mode')
  window.print()
  setTimeout(() => {
    document.body.classList.remove('print-modal-mode')
  }, 100)
}
</script>
