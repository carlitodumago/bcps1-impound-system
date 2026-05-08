<template>
  <div>
    <div class="page-header">
      <div class="breadcrumb"><span @click="page='dashboard'" style="cursor:pointer">Home</span> › Backup &amp; Restore</div>
      <h1>Backup &amp; Restore</h1>
      <p>Supabase cloud sync and local backup options for your impound records</p>
    </div>

    <div v-if="msg" class="alert" :class="msg.type==='success'?'alert-success':'alert-danger'">{{ msg.text }}</div>

    <!-- SUPABASE CLOUD STATUS -->
    <div class="card" style="margin-bottom:20px;border:1px solid rgba(33,150,243,0.25);background:linear-gradient(135deg,rgba(33,150,243,0.05),rgba(33,150,243,0.02))">
      <div class="card-header">
        <div class="card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
          ☁️ Supabase Cloud Sync
        </div>
        <span v-if="supabaseConnected" style="font-size:11px;background:rgba(39,174,96,0.15);color:#27ae60;border:1px solid rgba(39,174,96,0.3);padding:3px 10px;border-radius:20px;font-weight:600">● CONNECTED</span>
        <span v-else style="font-size:11px;background:rgba(230,126,34,0.15);color:#f39c12;border:1px solid rgba(230,126,34,0.3);padding:3px 10px;border-radius:20px;font-weight:600">● CONNECTING...</span>
      </div>

      <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:16px">
        Your records are automatically synced to <strong style="color:#4fc3f7">Supabase</strong> cloud database in the background.
        Every create, edit, delete, and status change is synced instantly with zero delay.
      </p>

      <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="font-size:12px;color:var(--gray);margin-bottom:10px;font-weight:600;letter-spacing:0.5px">SYNC STATUS</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Database</span><strong style="color:#4fc3f7">Supabase PostgreSQL</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Connection</span><strong :style="supabaseConnected ? 'color:#27ae60' : 'color:#f39c12'">{{ supabaseConnected ? 'Active' : 'Connecting...' }}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Records Synced</span><strong style="color:var(--gold2)">{{ records.length }}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Sync Mode</span><strong style="color:#27ae60">Real-time (Optimistic)</strong></div>
        </div>
      </div>
    </div>

    <!-- CLOUD ACTIONS -->
    <div class="grid-2" style="margin-bottom:20px">
      <div class="card" style="border:1px solid rgba(33,150,243,0.2)">
        <div class="card-header"><div class="card-title">☁️ Push to Cloud</div></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:16px">Force push all local records to Supabase. Use this after restoring from a local backup file.</p>
        <button class="btn btn-primary" @click="doPushToCloud" :disabled="supabaseSyncing" style="width:100%">
          <span v-if="supabaseSyncing">⏳ Pushing...</span>
          <span v-else>☁️ Push All to Cloud</span>
        </button>
      </div>
      <div class="card" style="border:1px solid rgba(39,174,96,0.2)">
        <div class="card-header"><div class="card-title">☁️ Pull from Cloud</div></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:16px"><span style="color:#e74c3c">⚠</span> Pull latest records from Supabase. Replaces all local data.</p>
        <button class="btn btn-success" @click="doPullFromCloud" :disabled="supabaseSyncing" style="width:100%">
          <span v-if="supabaseSyncing">⏳ Pulling...</span>
          <span v-else>☁️ Pull from Cloud</span>
        </button>
      </div>
    </div>

    <!-- LOCAL BACKUP -->
    <div class="grid-2" style="margin-bottom:20px">
      <div class="card">
        <div class="card-header"><div class="card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Download Local Backup
        </div></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px">Export all records as a <strong style="color:var(--gold2)">JSON backup file</strong> saved to your device.</p>
        <div style="background:rgba(201,168,76,0.06);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:20px">
          <div style="font-size:12px;color:var(--gray);margin-bottom:10px;font-weight:600;letter-spacing:0.5px">BACKUP SUMMARY</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Total Records</span><strong style="color:var(--gold2)">{{ records.length }}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Impounded</span><strong style="color:#e74c3c">{{ activeImpounded }}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Released</span><strong style="color:#27ae60">{{ totalReleased }}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Backup Date</span><strong style="color:rgba(255,255,255,0.8)">{{ todayDate }}</strong></div>
          </div>
        </div>
        <button class="btn btn-primary" @click="createBackup" style="width:100%">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Download Backup File (.json)
        </button>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 8 12 3 17 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Restore from Local File
        </div></div>
        <p style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:20px">Select a <strong style="color:var(--gold2)">.json backup file</strong> to restore records. <span style="color:#e74c3c">⚠ This will replace all current records.</span></p>
        <div style="background:rgba(255,255,255,0.03);border:2px dashed rgba(255,255,255,0.12);border-radius:8px;padding:28px;text-align:center;margin-bottom:16px;cursor:pointer;transition:border-color 0.2s"
             @click="fileInput.click()" @dragover.prevent @drop.prevent="onDrop"
             :style="restoreFile ? 'border-color:rgba(39,174,96,0.5);background:rgba(39,174,96,0.05)' : ''">
          <div style="font-size:28px;margin-bottom:8px">{{ restoreFile ? '✅' : '📂' }}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7)">{{ restoreFile ? restoreFile.name : 'Click to browse or drag & drop your backup file here' }}</div>
          <div v-if="!restoreFile" style="font-size:11px;color:var(--gray);margin-top:4px">Accepts .json backup files only</div>
        </div>
        <input type="file" ref="fileInput" accept=".json" style="display:none" @change="onFileSelect" />
        <button class="btn btn-success" @click="doRestore" :disabled="!restoreFile" style="width:100%" :style="restoreFile?'':'opacity:0.5'">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.08"/></svg>
          Restore from File
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useImpoundStore } from '../../composables/useImpoundStore.js'

const {
  page, records, activeImpounded, totalReleased, todayDate,
  supabaseConnected, supabaseSyncing,
  fetchFromSupabase, pushAllToSupabase
} = useImpoundStore()

const msg = ref(null)
const restoreFile = ref(null)
const fileInput = ref(null)

function flash(type, text) { msg.value = { type, text }; setTimeout(() => msg.value = null, 6000) }

// ── Cloud Push ──
async function doPushToCloud() {
  const ok = await pushAllToSupabase()
  if (ok) {
    flash('success', `✅ Pushed ${records.value.length} records to Supabase successfully.`)
  } else {
    flash('danger', '❌ Failed to push to Supabase. Check your connection.')
  }
}

// ── Cloud Pull ──
async function doPullFromCloud() {
  if (!confirm('Pull from cloud? This will replace all local records with Supabase data.')) return
  const ok = await fetchFromSupabase()
  if (ok) {
    flash('success', `✅ Pulled ${records.value.length} records from Supabase.`)
  } else {
    flash('danger', '❌ Failed to pull from Supabase. Check your connection.')
  }
}

// ── Local Backup ──
function createBackup() {
  const data = { version:'1.0', system:'BCPO Station 1 Impound Management System', exportedAt: new Date().toISOString(), totalRecords: records.value.length, records: records.value }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }))
  a.download = `bcpo_impound_backup_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  flash('success', '✅ Backup downloaded successfully!')
}

function onFileSelect(e) { restoreFile.value = e.target.files[0] || null }
function onDrop(e) { const f = e.dataTransfer.files[0]; if (f?.name.endsWith('.json')) restoreFile.value = f }

function doRestore() {
  if (!restoreFile.value) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (!data.records || !Array.isArray(data.records)) throw new Error()
      if (!confirm(`Restore ${data.records.length} records from backup dated ${data.exportedAt?.split('T')[0] ?? 'unknown'}?\n\nThis will replace all current records and sync to Supabase.`)) return
      records.value = data.records
      restoreFile.value = null
      flash('success', `✅ Restored ${data.records.length} records locally. Pushing to Supabase...`)
      const ok = await pushAllToSupabase()
      if (ok) {
        flash('success', `✅ Restored and synced ${records.value.length} records to Supabase.`)
      }
    } catch { flash('danger', '❌ Failed to restore: Invalid or corrupted backup file.') }
  }
  reader.readAsText(restoreFile.value)
}
</script>
