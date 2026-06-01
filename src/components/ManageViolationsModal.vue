<template>
  <!-- Backdrop -->
  <div v-if="show" class="modal-bg" @click.self="$emit('close')" style="z-index:1200">
    <div class="modal" style="max-width:480px;padding:0;overflow:hidden;position:relative">

      <!-- Header -->
      <div class="modal-header" style="padding:16px 20px;margin-bottom:0;border-bottom:1px solid var(--border2)">
        <div>
          <h2 style="font-size:16px;margin:0">Manage Violation Types</h2>
          <p style="font-size:12px;color:var(--gray);margin:2px 0 0">Add, edit, or delete violation types</p>
        </div>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <!-- Body -->
      <div style="padding:16px 20px;max-height:60vh;overflow-y:auto;display:flex;flex-direction:column;gap:8px">

        <!-- Add new row -->
        <div v-if="addingNew" class="mv-add-row">
          <input
            v-model="newName"
            ref="addInputRef"
            placeholder="Enter violation type..."
            @keyup.enter="confirmAdd"
            @keyup.escape="cancelAdd"
            style="flex:1"
          />
          <button class="mv-btn mv-btn-success" @click="confirmAdd">✓</button>
          <button class="mv-btn mv-btn-muted" @click="cancelAdd">✕</button>
        </div>

        <!-- Empty state -->
        <div v-if="violationTypes.length === 0 && !addingNew"
             style="text-align:center;padding:32px 0;color:var(--gray);font-size:13px">
          No violation types yet. Click <strong>+ Add</strong> to create one.
        </div>

        <!-- List -->
        <div
          v-for="(vio, idx) in violationTypes"
          :key="idx"
          class="mv-row"
        >
          <!-- Editing -->
          <template v-if="editIdx === idx">
            <input
              v-model="editVal"
              :ref="el => { if (el) editInputRef = el }"
              @keyup.enter="confirmEdit(idx)"
              @keyup.escape="cancelEdit"
              style="flex:1"
            />
            <div style="display:flex;gap:6px">
              <button class="mv-btn mv-btn-success" @click="confirmEdit(idx)">✓</button>
              <button class="mv-btn mv-btn-muted"   @click="cancelEdit">✕</button>
            </div>
          </template>
          <!-- Normal -->
          <template v-else>
            <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
              <span class="mv-num">{{ idx + 1 }}</span>
              <span class="mv-name">{{ vio }}</span>
            </div>
            <div style="display:flex;gap:6px">
              <button class="mv-btn mv-btn-edit" @click="startEdit(idx)" title="Edit">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button class="mv-btn mv-btn-danger" @click="requestDelete(idx)" title="Delete">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Delete
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:12px 20px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border2);gap:8px">
        <button class="btn btn-primary btn-sm" @click="startAdd" style="display:flex;align-items:center;gap:5px">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New
        </button>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" @click="resetDefaults" style="font-size:11px">↺ Reset Defaults</button>
          <button class="btn btn-secondary btn-sm" @click="$emit('close')">Done</button>
        </div>
      </div>

      <!-- Delete Confirmation Overlay -->
      <div v-if="deleteConfirmIdx > -1" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.85);z-index:10;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)">
        <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:24px;text-align:center;max-width:320px;box-shadow:0 10px 25px rgba(0,0,0,0.5)">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#f87171" stroke-width="2" style="margin-bottom:12px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <h3 style="margin:0 0 8px;font-size:16px">Delete Violation Type?</h3>
          <p style="margin:0 0 20px;font-size:13px;color:var(--gray)">Are you sure you want to delete "<strong>{{ violationTypes[deleteConfirmIdx] }}</strong>"?</p>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
            <button class="btn btn-danger" @click="confirmDelete" style="background:#ef4444;border-color:#ef4444;color:white">Delete</button>
          </div>
        </div>
      </div>

      <!-- Reset Confirmation Overlay -->
      <div v-if="showResetConfirm" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.85);z-index:10;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(2px)">
        <div style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:24px;text-align:center;max-width:320px;box-shadow:0 10px 25px rgba(0,0,0,0.5)">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#f59e0b" stroke-width="2" style="margin-bottom:12px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3 style="margin:0 0 8px;font-size:16px">Reset to Defaults?</h3>
          <p style="margin:0 0 20px;font-size:13px;color:var(--gray)">This will remove any custom violation types you've added and restore the original 12 types. Are you sure?</p>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-secondary" @click="showResetConfirm = false">Cancel</button>
            <button class="btn btn-primary" @click="confirmReset" style="background:#f59e0b;border-color:#f59e0b;color:white">Yes, Reset</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useImpoundStore } from '../composables/useImpoundStore.js'

defineProps({ show: Boolean })
defineEmits(['close'])

const { violationTypes } = useImpoundStore()

const DEFAULT_VIOLATIONS = [
  'No Helmet','No License','Expired Registration','No Registration',
  'Reckless Driving','Illegal Parking','DUI/DWI','Overloading',
  'Obstruction of Traffic','Illegal Modification','Hit and Run','Other Traffic Violation'
]

// ── Add ──
const addingNew   = ref(false)
const newName     = ref('')
const addInputRef = ref(null)

function startAdd() {
  cancelEdit()
  addingNew.value = true
  newName.value   = ''
  nextTick(() => addInputRef.value?.focus())
}
function confirmAdd() {
  const name = newName.value.trim()
  if (!name) return
  if (violationTypes.value.includes(name)) { alert(`"${name}" already exists.`); return }
  violationTypes.value.push(name)
  newName.value   = ''
  addingNew.value = false
}
function cancelAdd() { addingNew.value = false; newName.value = '' }

// ── Edit ──
const editIdx     = ref(-1)
const editVal     = ref('')
let   editInputRef = null

function startEdit(idx) {
  cancelAdd()
  editIdx.value = idx
  editVal.value = violationTypes.value[idx]
  nextTick(() => editInputRef?.focus())
}
function confirmEdit(idx) {
  const name = editVal.value.trim()
  if (!name) { alert('Cannot be empty.'); return }
  if (violationTypes.value.some((v, i) => v === name && i !== idx)) {
    alert(`"${name}" already exists.`); return
  }
  violationTypes.value[idx] = name
  editIdx.value = -1
}
function cancelEdit() { editIdx.value = -1 }

// ── Delete ──
const deleteConfirmIdx = ref(-1)

function requestDelete(idx) {
  deleteConfirmIdx.value = idx
}

function confirmDelete() {
  if (deleteConfirmIdx.value > -1) {
    violationTypes.value.splice(deleteConfirmIdx.value, 1)
    if (editIdx.value === deleteConfirmIdx.value) editIdx.value = -1
    deleteConfirmIdx.value = -1
  }
}

function cancelDelete() {
  deleteConfirmIdx.value = -1
}

// ── Reset ──
const showResetConfirm = ref(false)

function resetDefaults() {
  showResetConfirm.value = true
}

function confirmReset() {
  violationTypes.value = [...DEFAULT_VIOLATIONS]
  editIdx.value = -1
  showResetConfirm.value = false
  cancelAdd()
}
</script>

<style scoped>
.mv-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 7px;
  border: 1px solid transparent;
  transition: background 0.12s, border-color 0.12s;
}
.mv-row:hover { background: rgba(255,255,255,0.04); border-color: var(--border2); }

.mv-add-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 7px;
  border: 1px solid rgba(99,102,241,0.35);
  background: rgba(99,102,241,0.06);
}

.mv-num {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(99,102,241,0.15);
  color: #818cf8;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mv-name {
  font-size: 13.5px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Action buttons */
.mv-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 9px;
  border-radius: 5px;
  font-size: 12px; font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.12s;
  flex-shrink: 0;
}
.mv-btn-edit   { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.25); color:#818cf8 }
.mv-btn-edit:hover { background:rgba(99,102,241,0.2); border-color:rgba(99,102,241,0.4) }
.mv-btn-danger { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.25); color:#f87171 }
.mv-btn-danger:hover { background:rgba(239,68,68,0.2); border-color:rgba(239,68,68,0.4) }
.mv-btn-success{ background:rgba(34,197,94,0.1); border-color:rgba(34,197,94,0.25); color:#4ade80 }
.mv-btn-success:hover { background:rgba(34,197,94,0.2) }
.mv-btn-muted  { background:rgba(255,255,255,0.05); border-color:var(--border2); color:var(--gray) }
.mv-btn-muted:hover { background:rgba(255,255,255,0.1) }
</style>
