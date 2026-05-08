<template>
  <div>
    <div class="page-header">
      <div class="breadcrumb"><span @click="page='dashboard'" style="cursor:pointer">Home</span> <span style="color:var(--gray)">›</span> Violation Types</div>
      <h1>Manage Violation Types</h1>
      <p>Add, edit, or remove violation types that appear in impound receipts</p>
    </div>

    <div style="max-width:640px">
      <div class="card">
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between">
          <div class="card-title">Violation Types <span style="font-size:12px;color:var(--gray);font-weight:400;margin-left:8px">{{ violationTypes.length }} total</span></div>
          <button class="btn btn-primary btn-sm" @click="startAdd" id="add-violation-type-btn">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Type
          </button>
        </div>

        <!-- Add new row -->
        <div v-if="addingNew" style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border2)">
          <input
            v-model="newTypeName"
            ref="addInput"
            placeholder="e.g. Jaywalking"
            @keyup.enter="confirmAdd"
            @keyup.escape="cancelAdd"
            style="flex:1"
            id="new-violation-type-input"
          />
          <button class="btn btn-success btn-sm" @click="confirmAdd" id="confirm-add-violation-btn">✓ Add</button>
          <button class="btn btn-secondary btn-sm" @click="cancelAdd">✕</button>
        </div>

        <!-- Empty state -->
        <div v-if="violationTypes.length === 0 && !addingNew" style="padding:40px;text-align:center;color:var(--gray)">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:0.3;margin-bottom:12px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>No violation types defined. Click <strong>Add Type</strong> to create one.</div>
        </div>

        <!-- Violation list -->
        <div v-for="(vio, idx) in violationTypes" :key="idx" class="vio-type-row" :id="`vio-type-row-${idx}`">
          <!-- Editing inline -->
          <template v-if="editingIdx === idx">
            <input
              v-model="editValue"
              :ref="el => { if (el) editInputEl = el }"
              @keyup.enter="confirmEdit(idx)"
              @keyup.escape="cancelEdit"
              style="flex:1;margin:0"
              :id="`edit-violation-input-${idx}`"
            />
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn btn-success btn-sm" @click="confirmEdit(idx)">✓ Save</button>
              <button class="btn btn-secondary btn-sm" @click="cancelEdit">✕</button>
            </div>
          </template>
          <!-- Normal display -->
          <template v-else>
            <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
              <span class="vio-type-num">{{ idx + 1 }}</span>
              <span class="vio-type-name">{{ vio }}</span>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="vio-action-btn edit-btn" @click="startEdit(idx)" :title="`Edit ${vio}`" :id="`edit-vio-btn-${idx}`">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="vio-action-btn delete-btn" @click="deleteType(idx)" :title="`Delete ${vio}`" :id="`delete-vio-btn-${idx}`">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete
              </button>
            </div>
          </template>
        </div>

        <!-- Footer info -->
        <div v-if="violationTypes.length > 0" style="padding:12px 0 0;border-top:1px solid var(--border2);margin-top:8px;font-size:12px;color:var(--gray)">
          Changes are saved automatically and will apply to all new receipts.
        </div>
      </div>

      <!-- Reset to defaults -->
      <div style="margin-top:16px;text-align:right">
        <button class="btn btn-secondary btn-sm" @click="resetToDefaults" id="reset-violations-btn" style="font-size:12px">
          ↺ Reset to Default List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useImpoundStore } from '../../composables/useImpoundStore.js'

const { page, violationTypes } = useImpoundStore()

const DEFAULT_VIOLATIONS = ['No Helmet','No License','Expired Registration','No Registration','Reckless Driving','Illegal Parking','DUI/DWI','Overloading','Obstruction of Traffic','Illegal Modification','Hit and Run','Other Traffic Violation']

// ── Add ──
const addingNew   = ref(false)
const newTypeName = ref('')
const addInput    = ref(null)

function startAdd() {
  addingNew.value   = true
  newTypeName.value = ''
  nextTick(() => addInput.value?.focus())
}
function confirmAdd() {
  const name = newTypeName.value.trim()
  if (!name) return
  if (violationTypes.value.includes(name)) {
    alert(`"${name}" already exists.`)
    return
  }
  violationTypes.value.push(name)
  newTypeName.value = ''
  addingNew.value   = false
}
function cancelAdd() {
  addingNew.value   = false
  newTypeName.value = ''
}

// ── Edit ──
const editingIdx  = ref(-1)
const editValue   = ref('')
let   editInputEl = null

function startEdit(idx) {
  editingIdx.value = idx
  editValue.value  = violationTypes.value[idx]
  nextTick(() => editInputEl?.focus())
}
function confirmEdit(idx) {
  const name = editValue.value.trim()
  if (!name) { alert('Violation type cannot be empty.'); return }
  if (violationTypes.value.some((v, i) => v === name && i !== idx)) {
    alert(`"${name}" already exists.`); return
  }
  violationTypes.value[idx] = name
  editingIdx.value = -1
}
function cancelEdit() { editingIdx.value = -1 }

// ── Delete ──
function deleteType(idx) {
  if (!confirm(`Delete "${violationTypes.value[idx]}"?`)) return
  violationTypes.value.splice(idx, 1)
  if (editingIdx.value === idx) editingIdx.value = -1
}

// ── Reset ──
function resetToDefaults() {
  if (!confirm('Reset violation types to the default list? This will remove any custom types.')) return
  violationTypes.value = [...DEFAULT_VIOLATIONS]
}
</script>

<style scoped>
.vio-type-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border2);
  transition: background 0.15s;
}
.vio-type-row:last-child { border-bottom: none; }
.vio-type-row:hover { background: rgba(255,255,255,0.02); border-radius: 6px; padding-left: 6px; padding-right: 6px; }

.vio-type-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(99,102,241,0.15);
  color: #818cf8;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.vio-type-name {
  font-size: 14px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vio-action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}
.edit-btn {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.25);
  color: #818cf8;
}
.edit-btn:hover {
  background: rgba(99,102,241,0.2);
  border-color: rgba(99,102,241,0.4);
}
.delete-btn {
  background: rgba(239,68,68,0.1);
  border-color: rgba(239,68,68,0.25);
  color: #f87171;
}
.delete-btn:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.4);
}
</style>
