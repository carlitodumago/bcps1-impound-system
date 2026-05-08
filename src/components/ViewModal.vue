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
          <div class="receipt-preview">
            <div class="receipt-header">
              <div class="logos">
                <div class="logo-circle" style="font-size:7px;font-weight:800;line-height:1.3;letter-spacing:0.5px">NAPOLCOM<br>PNP</div>
                <div class="header-text">
                  <h4>Republic of the Philippines</h4>
                  <h4>NATIONAL POLICE COMMISSION</h4>
                  <h4>PHILIPPINE NATIONAL POLICE</h4>
                  <h3>BUTUAN CITY POLICE OFFICE</h3>
                  <h2>BUTUAN CITY POLICE STATION 1</h2>
                  <h5>Butuan City</h5>
                </div>
                <div class="logo-circle" style="font-size:7px;font-weight:800;line-height:1.3;letter-spacing:0.5px">BCPO<br>STATION 1</div>
              </div>
            </div>
            <div class="receipt-date">Date: <span>{{ fmtDate(selectedRecord.date) }}</span></div>
            <div class="receipt-title">IMPOUNDING RECEIPT</div>
            <div class="field-row"><span class="field-label">Type of Vehicle</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.type }}</span></div>
            <div class="field-row"><span class="field-label">Plate no.</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.plate }}</span></div>
            <div class="field-row"><span class="field-label">Color</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.color }}</span></div>
            <div class="field-row"><span class="field-label">Driver's Name</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.driver }}</span></div>
            <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.driverAddress }}</span></div>
            <div class="field-row"><span class="field-label">Registered Owner</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.owner }}</span></div>
            <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value">{{ selectedRecord.ownerAddress }}</span></div>
            <div class="violations-section">
              <strong>VIOLATIONS:</strong>
              <div class="vio-row"><span class="vio-num">1.</span><span class="vio-line">{{ selectedRecord.vio1 }}</span></div>
              <div class="vio-row"><span class="vio-num">2.</span><span class="vio-line">{{ selectedRecord.vio2 }}</span></div>
            </div>
            <div class="receipt-body">Subject MV/MC was apprehended by BCPO Station 1 personnel for violation/s as stated above on <u>&nbsp;{{ fmtDate(selectedRecord.date) }}&nbsp;</u> at about <u>&nbsp;{{ fmtTime(selectedRecord.time) }}&nbsp;</u> along the vicinity of <u>&nbsp;{{ selectedRecord.location }}&nbsp;</u> and same was brought for safekeeping subject for the investigation/verification and proper disposition.</div>
            <div class="receipt-note">Note: Subject MV/MC shall only be released upon presentation of its pertinent original documents and agreement.</div>
            <div class="receipt-sigs">
              <div class="sig-title">Apprehending Officer:</div>
              <div class="sig-group">
                <div class="conformed">
                  <div style="font-size:12.5px;margin-bottom:4px">Conformed:</div>
                  <div class="sig-line-block" style="align-items:flex-start">
                    <div style="width:200px;border-top:1px solid #000;padding-top:4px;font-size:12px;text-align:center;margin-top:40px">Owner/Driver/Possessor</div>
                  </div>
                </div>
                <div class="sig-line-block">
                  <div style="font-weight:bold;font-size:13px;text-align:center;margin-top:40px;margin-bottom:4px">{{ selectedRecord.officer }}</div>
                  <div style="border-top:1px solid #000;width:100%"></div>
                  <div style="font-size:11px;text-align:center;color:#888;margin-top:3px">Apprehending Officer</div>
                </div>
                <div class="sig-line-block" v-if="selectedRecord.officer2">
                  <div style="font-weight:bold;font-size:13px;text-align:center;margin-top:40px;margin-bottom:4px">{{ selectedRecord.officer2 }}</div>
                  <div style="border-top:1px solid #000;width:100%"></div>
                  <div style="font-size:11px;text-align:center;color:#888;margin-top:3px">Apprehending Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="no-print" style="padding:16px 24px;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border2)">
          <button class="btn btn-success" v-if="selectedRecord.status==='Impounded'" @click="releaseVehicle(selectedRecord)">✅ Release</button>
          <button class="btn btn-warning" v-if="selectedRecord.status==='Released'" @click="impoundVehicle(selectedRecord)">🚔 Impound</button>
          <button class="btn btn-primary" @click="printRecordReceipt(selectedRecord)">
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
import { inject } from 'vue'
import { useImpoundStore, fmtDate, fmtTime } from '../composables/useImpoundStore.js'
const { showModal, selectedRecord, releaseVehicle, impoundVehicle, editRecord, deleteRecord } = useImpoundStore()
const printRecordReceipt = inject('printRecordReceipt')
</script>
