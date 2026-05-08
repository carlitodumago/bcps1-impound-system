import { ref, computed, watch } from 'vue'
import { supabase, toDbRecord, toAppRecord } from '../lib/supabase.js'

// ── Load cached records from localStorage (instant startup) ──
function loadCachedRecords() {
  try {
    const saved = localStorage.getItem('bcpo_records')
    if (saved) {
      const data = JSON.parse(saved)
      if (Array.isArray(data)) return data
    }
  } catch { }
  return []
}

// ── Singleton state ──
const isLoggedIn = ref(sessionStorage.getItem('bcpo_logged_in') === 'true')
const page = ref(sessionStorage.getItem('bcpo_page') || 'dashboard')
const reportTab = ref('overview')
const records = ref(loadCachedRecords())
const nextId = ref(Date.now())
const currentTime = ref('')
const showModal = ref(false)
const selectedRecord = ref(null)
const showLogoutDialog = ref(false)
const mobileMenuOpen = ref(false)
const showReleaseDialog = ref(false)
const releaseTarget = ref(null)
const releaseMode = ref('release')
const showEditModal = ref(false)
const editTarget = ref(null)
const showEditConfirmDialog = ref(false)
const pendingEditData = ref(null)
const showDeleteDialog = ref(false)
const deleteTarget = ref(null)
const showDetailsModal = ref(false)
const detailRecord = ref(null)

// ── Supabase state ──
const supabaseConnected = ref(false)
const supabaseSyncing = ref(false)

// ── Toast ──
let _toastTimer = null
const toast = ref({ show: false, type: 'success', title: '', message: '', duration: 3500 })
function showToast(type, title, message, duration = 3500) {
  if (_toastTimer) clearTimeout(_toastTimer)
  toast.value = { show: true, type, title, message, duration }
  _toastTimer = setTimeout(() => { toast.value.show = false }, duration)
}
function hideToast() { toast.value.show = false; if (_toastTimer) clearTimeout(_toastTimer) }

// ── Violation Types (Cloud Synced) ──
const DEFAULT_VIOLATIONS = ['No Helmet','No License','Expired Registration','No Registration','Reckless Driving','Illegal Parking','DUI/DWI','Overloading','Obstruction of Traffic','Illegal Modification','Hit and Run','Other Traffic Violation']
function loadViolationTypes() {
  try {
    const saved = localStorage.getItem('bcpo_violation_types')
    if (saved) { const d = JSON.parse(saved); if (Array.isArray(d) && d.length) return d }
  } catch { }
  return [...DEFAULT_VIOLATIONS]
}
const violationTypes = ref(loadViolationTypes())

watch(violationTypes, async (v) => {
  try {
    localStorage.setItem('bcpo_violation_types', JSON.stringify(v))
    // Push settings change to Supabase
    await supabase.from('system_settings').upsert({ key: 'violation_types', value: v })
  } catch { }
}, { deep: true })

// ── Persist to localStorage (cache layer) ──
function persistRecords() {
  try { localStorage.setItem('bcpo_records', JSON.stringify(records.value)) } catch { }
}
watch(records, persistRecords, { deep: true })
watch(page, (v) => { sessionStorage.setItem('bcpo_page', v) })

// ── Computed ──
const todayDate = computed(() =>
  new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)
const todayStr = computed(() => new Date().toISOString().split('T')[0])
const totalImpounded = computed(() => records.value.length)
const totalReleased = computed(() => records.value.filter(r => r.status === 'Released').length)
const activeImpounded = computed(() => records.value.filter(r => r.status === 'Impounded').length)
const todayCount = computed(() => records.value.filter(r => r.date === todayStr.value).length)

// ── Clock ──
function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
updateTime()
setInterval(updateTime, 1000)

// ═══════════════════════════════════════════
//  SUPABASE BACKGROUND SYNC
// ═══════════════════════════════════════════

async function fetchFromSupabase() {
  try {
    // Fetch Settings First
    const { data: settingsData } = await supabase.from('system_settings').select('*')
    if (settingsData) {
      const vTypes = settingsData.find(s => s.key === 'violation_types')
      if (vTypes && Array.isArray(vTypes.value)) {
        violationTypes.value = vTypes.value
      }
    }

    // Fetch Records
    const { data, error } = await supabase
      .from('impound_records')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) {
      records.value = data.map(toAppRecord)
      supabaseConnected.value = true
      return true
    }
  } catch { }
  return false
}

// Fire on module load — runs in background, no blocking
fetchFromSupabase()

// Background insert → replaces temp ID with real Supabase ID
async function sbInsert(localRecord) {
  try {
    const dbRec = toDbRecord(localRecord)
    const { data, error } = await supabase
      .from('impound_records')
      .insert(dbRec)
      .select()
      .single()
    if (error) {
      console.error('[Supabase INSERT error]', error.message, error)
      return
    }
    if (data) {
      const idx = records.value.findIndex(x => x.id === localRecord.id)
      if (idx !== -1) {
        records.value[idx] = toAppRecord(data)
        persistRecords()
      }
      supabaseConnected.value = true
    }
  } catch (e) { console.error('[Supabase INSERT exception]', e) }
}

async function sbUpdate(record) {
  try {
    const { error } = await supabase.from('impound_records').update(toDbRecord(record)).eq('id', record.id)
    if (error) { console.error('[Supabase UPDATE error]', error.message, error); return }
    supabaseConnected.value = true
  } catch (e) { console.error('[Supabase UPDATE exception]', e) }
}

async function sbDelete(id) {
  try {
    const { error } = await supabase.from('impound_records').delete().eq('id', id)
    if (error) { console.error('[Supabase DELETE error]', error.message, error); return }
    supabaseConnected.value = true
  } catch (e) { console.error('[Supabase DELETE exception]', e) }
}

async function sbUpdateStatus(id, status) {
  try {
    const { error } = await supabase.from('impound_records').update({ status }).eq('id', id)
    if (error) { console.error('[Supabase STATUS error]', error.message, error); return }
    supabaseConnected.value = true
  } catch (e) { console.error('[Supabase STATUS exception]', e) }
}

// Push ALL local records to Supabase (used by backup restore)
async function pushAllToSupabase() {
  supabaseSyncing.value = true
  try {
    await supabase.from('impound_records').delete().gte('id', 0)
    if (records.value.length > 0) {
      const dbRecords = records.value.map(r => toDbRecord(r))
      const { data, error } = await supabase
        .from('impound_records')
        .insert(dbRecords)
        .select()
      if (!error && data) {
        records.value = data.map(toAppRecord)
        persistRecords()
        supabaseConnected.value = true
        supabaseSyncing.value = false
        return true
      }
    } else {
      supabaseConnected.value = true
      supabaseSyncing.value = false
      return true
    }
  } catch { }
  supabaseSyncing.value = false
  return false
}

// ═══════════════════════════════════════════
//  UTILITY
// ═══════════════════════════════════════════

export function fmtDate(d) {
  if (!d) return ''
  const p = d.split('-')
  return p.length === 3 ? `${p[1]}/${p[2]}/${p[0]}` : d
}

export function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

// ═══════════════════════════════════════════
//  STORE COMPOSABLE
// ═══════════════════════════════════════════

export function useImpoundStore() {
  function login(adminData) {
    isLoggedIn.value = true
    if (adminData && adminData.id) {
      sessionStorage.setItem('bcpo_admin_id', adminData.id)
    }
    sessionStorage.setItem('bcpo_logged_in', 'true')
  }

  function confirmLogout() {
    showLogoutDialog.value = false
    mobileMenuOpen.value = false
    isLoggedIn.value = false
    page.value = 'dashboard'
    sessionStorage.removeItem('bcpo_logged_in')
    sessionStorage.removeItem('bcpo_admin_id')
    sessionStorage.removeItem('bcpo_page')
  }

  function viewRecord(r) {
    selectedRecord.value = r
    showModal.value = true
  }

  function viewDetails(r) {
    detailRecord.value = r
    showDetailsModal.value = true
  }

  function releaseVehicle(r) {
    releaseTarget.value = r
    releaseMode.value = 'release'
    showReleaseDialog.value = true
  }

  function doConfirmedRelease() {
    if (releaseTarget.value) {
      const rec = records.value.find(x => x.id === releaseTarget.value.id)
      if (rec) {
        rec.status = 'Released'
        sbUpdateStatus(rec.id, 'Released')
      }
      persistRecords()
      showToast('success', 'Vehicle Released', `${releaseTarget.value.plate} has been released successfully.`)
    }
    showReleaseDialog.value = false
    releaseTarget.value = null
    showModal.value = false
  }

  function saveRecord(form) {
    const tempId = Date.now()
    const rec = { ...form, id: tempId, status: 'Impounded' }
    records.value.push(rec)
    persistRecords()
    showToast('success', 'Record Saved', `Vehicle ${rec.plate || ''} has been impounded and saved.`)
    sbInsert(rec)
    return rec
  }

  function impoundVehicle(r) {
    releaseTarget.value = r
    releaseMode.value = 'impound'
    showReleaseDialog.value = true
  }

  function doConfirmedImpound() {
    if (releaseTarget.value) {
      const rec = records.value.find(x => x.id === releaseTarget.value.id)
      if (rec) {
        rec.status = 'Impounded'
        sbUpdateStatus(rec.id, 'Impounded')
      }
      persistRecords()
      showToast('warning', 'Vehicle Re-Impounded', `${releaseTarget.value.plate} status changed to Impounded.`)
    }
    showReleaseDialog.value = false
    releaseTarget.value = null
    showModal.value = false
  }

  // ── Edit ──
  function editRecord(r) {
    editTarget.value = { ...r }
    showEditModal.value = true
  }

  function updateRecord(updated) {
    const idx = records.value.findIndex(x => x.id === updated.id)
    if (idx !== -1) {
      records.value[idx] = { ...updated }
      persistRecords()
      showToast('info', 'Record Updated', `${updated.plate || 'Record'} has been updated successfully.`)
      sbUpdate(updated)
    }
    showEditModal.value = false
    editTarget.value = null
    showModal.value = false
  }

  function requestUpdateRecord(formData) {
    pendingEditData.value = { ...formData }
    showEditConfirmDialog.value = true
  }

  function doConfirmedUpdate() {
    if (pendingEditData.value) {
      updateRecord(pendingEditData.value)
    }
    showEditConfirmDialog.value = false
    pendingEditData.value = null
  }

  // ── Delete ──
  function deleteRecord(r) {
    deleteTarget.value = r
    showDeleteDialog.value = true
  }

  function doConfirmedDelete() {
    if (deleteTarget.value) {
      const plate = deleteTarget.value.plate
      const id = deleteTarget.value.id
      records.value = records.value.filter(x => x.id !== id)
      persistRecords()
      showToast('danger', 'Record Deleted', `Vehicle ${plate || ''} has been permanently deleted.`)
      sbDelete(id)
    }
    showDeleteDialog.value = false
    deleteTarget.value = null
    showModal.value = false
  }

  function downloadCSV(list) {
    const headers = ['ID', 'Date', 'Plate', 'Type', 'Color', 'Driver', 'Driver Address', 'Owner', 'Owner Address', 'Violation 1', 'Violation 2', 'Location', 'Officer', 'Status']
    const rows = list.map(r => [r.id, fmtDate(r.date), r.plate, r.type, r.color, r.driver, r.driverAddress, r.owner, r.ownerAddress, r.vio1, r.vio2, r.location, r.officer, r.status])
    const csv = [headers, ...rows].map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `impound_records_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return {
    isLoggedIn, page, reportTab, records, nextId, currentTime,
    showModal, selectedRecord, showLogoutDialog, mobileMenuOpen,
    showReleaseDialog, releaseTarget, releaseMode,
    showEditModal, editTarget,
    showEditConfirmDialog, pendingEditData,
    showDeleteDialog, deleteTarget,
    showDetailsModal, detailRecord,
    supabaseConnected, supabaseSyncing,
    toast, hideToast,
    todayDate, todayStr, totalImpounded, totalReleased,
    activeImpounded, todayCount,
    violationTypes,
    login, confirmLogout, viewRecord, viewDetails, releaseVehicle, doConfirmedRelease,
    impoundVehicle, doConfirmedImpound,
    editRecord, updateRecord, requestUpdateRecord, doConfirmedUpdate, deleteRecord, doConfirmedDelete,
    saveRecord, downloadCSV,
    fetchFromSupabase, pushAllToSupabase,
  }
}
