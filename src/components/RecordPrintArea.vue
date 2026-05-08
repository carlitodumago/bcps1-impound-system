<template>
  <div id="record-receipt-print-area" style="display:none">
    <div class="receipt-preview">
      <div class="receipt-header">
        <div class="logos">
          <div class="logo-circle" style="font-size:7px;font-weight:800;line-height:1.3">NAPOLCOM<br>PNP</div>
          <div class="header-text">
            <h4>Republic of the Philippines</h4>
            <h4>NATIONAL POLICE COMMISSION</h4>
            <h4>PHILIPPINE NATIONAL POLICE</h4>
            <h3>BUTUAN CITY POLICE OFFICE</h3>
            <h2>BUTUAN CITY POLICE STATION 1</h2>
            <h5>Butuan City</h5>
          </div>
          <div class="logo-circle" style="font-size:7px;font-weight:800;line-height:1.3">BCPO<br>STATION 1</div>
        </div>
      </div>
      <div class="receipt-date">Date: <span ref="rpDate"></span></div>
      <div class="receipt-title">IMPOUNDING RECEIPT</div>
      <div class="field-row"><span class="field-label">Type of Vehicle</span><span class="field-colon">:</span><span class="field-value" ref="rpType"></span></div>
      <div class="field-row"><span class="field-label">Plate no.</span><span class="field-colon">:</span><span class="field-value" ref="rpPlate"></span></div>
      <div class="field-row"><span class="field-label">Color</span><span class="field-colon">:</span><span class="field-value" ref="rpColor"></span></div>
      <div class="field-row"><span class="field-label">Driver's Name</span><span class="field-colon">:</span><span class="field-value" ref="rpDriver"></span></div>
      <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value" ref="rpDriverAddr"></span></div>
      <div class="field-row"><span class="field-label">Registered Owner</span><span class="field-colon">:</span><span class="field-value" ref="rpOwner"></span></div>
      <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value" ref="rpOwnerAddr"></span></div>
      <div class="violations-section">
        <strong>VIOLATIONS:</strong>
        <div class="vio-row"><span class="vio-num">1.</span><span class="vio-line" ref="rpVio1"></span></div>
        <div class="vio-row"><span class="vio-num">2.</span><span class="vio-line" ref="rpVio2"></span></div>
      </div>
      <div class="receipt-body" ref="rpBody"></div>
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
            <div class="sig-underline" ref="rpOfficer"></div>
            <div class="sig-extra-line">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fmtDate } from '../composables/useImpoundStore.js'

const rpDate = ref(null); const rpType = ref(null); const rpPlate = ref(null)
const rpColor = ref(null); const rpDriver = ref(null); const rpDriverAddr = ref(null)
const rpOwner = ref(null); const rpOwnerAddr = ref(null); const rpVio1 = ref(null)
const rpVio2 = ref(null); const rpOfficer = ref(null); const rpBody = ref(null)

function fillAndPrint(r) {
  const fmtTime = (t) => {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Impounding Receipt – ${r.plate || ''}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #000; background: #fff; padding: 32px; }
    .receipt-header { text-align: center; margin-bottom: 12px; }
    .logos { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px; }
    .logo-circle { width: 60px; height: 60px; border-radius: 50%; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 800; text-align: center; line-height: 1.3; flex-shrink: 0; }
    .header-text h4 { font-size: 11px; font-weight: normal; }
    .header-text h3 { font-size: 13px; font-weight: bold; }
    .header-text h2 { font-size: 15px; font-weight: bold; }
    .header-text h5 { font-size: 11px; font-weight: normal; }
    .receipt-date { text-align: right; margin-bottom: 4px; font-size: 12px; }
    .receipt-title { text-align: center; font-size: 16px; font-weight: bold; letter-spacing: 2px; margin: 12px 0 14px; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 6px 0; }
    .field-row { display: flex; margin-bottom: 6px; font-size: 13px; }
    .field-label { width: 180px; flex-shrink: 0; font-weight: 600; }
    .field-colon { width: 16px; flex-shrink: 0; }
    .field-value { flex: 1; border-bottom: 1px solid #000; min-width: 0; padding-bottom: 2px; }
    .violations-section { margin: 14px 0; }
    .violations-section strong { font-size: 13px; display: block; margin-bottom: 6px; }
    .vio-row { display: flex; gap: 8px; margin-bottom: 6px; }
    .vio-num { width: 20px; flex-shrink: 0; }
    .vio-line { flex: 1; border-bottom: 1px solid #000; padding-bottom: 2px; }
    .receipt-body { font-size: 12px; line-height: 1.8; margin: 14px 0; text-align: justify; }
    .receipt-note { font-size: 11px; font-style: italic; margin-bottom: 24px; }
    .receipt-sigs { margin-top: 24px; }
    .sig-title { font-weight: bold; margin-bottom: 12px; font-size: 13px; }
    .sig-group { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
    .conformed { font-size: 12px; }
    .sig-line-block { display: flex; flex-direction: column; align-items: center; min-width: 200px; }
    .sig-name { font-weight: bold; font-size: 13px; text-align: center; margin-top: 40px; margin-bottom: 2px; }
    .sig-line { border-top: 1px solid #000; width: 100%; }
    .sig-role { font-size: 11px; text-align: center; color: #333; margin-top: 3px; }
    u { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="receipt-header">
    <div class="logos">
      <div class="logo-circle">NAPOLCOM<br>PNP</div>
      <div class="header-text">
        <h4>Republic of the Philippines</h4>
        <h4>NATIONAL POLICE COMMISSION</h4>
        <h4>PHILIPPINE NATIONAL POLICE</h4>
        <h3>BUTUAN CITY POLICE OFFICE</h3>
        <h2>BUTUAN CITY POLICE STATION 1</h2>
        <h5>Butuan City</h5>
      </div>
      <div class="logo-circle">BCPO<br>STATION 1</div>
    </div>
  </div>
  <div class="receipt-date">Date: <span>${fmtDate(r.date) || ''}</span></div>
  <div class="receipt-title">IMPOUNDING RECEIPT</div>
  <div class="field-row"><span class="field-label">Type of Vehicle</span><span class="field-colon">:</span><span class="field-value">${r.type || ''}</span></div>
  <div class="field-row"><span class="field-label">Plate no.</span><span class="field-colon">:</span><span class="field-value">${r.plate || ''}</span></div>
  <div class="field-row"><span class="field-label">Color</span><span class="field-colon">:</span><span class="field-value">${r.color || ''}</span></div>
  <div class="field-row"><span class="field-label">Driver's Name</span><span class="field-colon">:</span><span class="field-value">${r.driver || ''}</span></div>
  <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value">${r.driverAddress || ''}</span></div>
  <div class="field-row"><span class="field-label">Registered Owner</span><span class="field-colon">:</span><span class="field-value">${r.owner || ''}</span></div>
  <div class="field-row"><span class="field-label">Address</span><span class="field-colon">:</span><span class="field-value">${r.ownerAddress || ''}</span></div>
  <div class="violations-section">
    <strong>VIOLATIONS:</strong>
    <div class="vio-row"><span class="vio-num">1.</span><span class="vio-line">${r.vio1 || ''}</span></div>
    <div class="vio-row"><span class="vio-num">2.</span><span class="vio-line">${r.vio2 || ''}</span></div>
  </div>
  <div class="receipt-body">Subject MV/MC was apprehended by BCPO Station 1 personnel for violation/s as stated above on <u>&nbsp;${fmtDate(r.date)||''}&nbsp;</u> at about <u>&nbsp;${fmtTime(r.time)}&nbsp;</u> along the vicinity of <u>&nbsp;${r.location||''}&nbsp;</u> and same was brought for safekeeping subject for the investigation/verification and proper disposition.</div>
  <div class="receipt-note">Note: Subject MV/MC shall only be released upon presentation of its pertinent original documents and agreement.</div>
  <div class="receipt-sigs">
    <div class="sig-title">Apprehending Officer:</div>
    <div class="sig-group">
      <div class="conformed">
        <div>Conformed:</div>
        <div class="sig-line-block" style="align-items:flex-start">
          <div style="width:200px;border-top:1px solid #000;padding-top:4px;font-size:12px;text-align:center;margin-top:40px">Owner/Driver/Possessor</div>
        </div>
      </div>
      <div class="sig-line-block">
        <div class="sig-name">${r.officer || ''}</div>
        <div class="sig-line"></div>
        <div class="sig-role">Apprehending Officer</div>
      </div>
      ${r.officer2 ? `
      <div class="sig-line-block">
        <div class="sig-name">${r.officer2}</div>
        <div class="sig-line"></div>
        <div class="sig-role">Apprehending Officer</div>
      </div>` : ''}
    </div>
  </div>
</body>
</html>`

  const pw = window.open('', '_blank', 'width=800,height=900')
  pw.document.write(html)
  pw.document.close()
  pw.focus()
  setTimeout(() => { pw.print(); pw.close() }, 400)
}

defineExpose({ fillAndPrint })
</script>
