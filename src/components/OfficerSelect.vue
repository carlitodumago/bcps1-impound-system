<template>
  <div class="officer-select-wrap">
    <div class="officer-row">
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="officer-dropdown">
        <option value="">— Select Officer —</option>
        <option v-for="o in officers" :key="o" :value="o">{{ o }}</option>
      </select>
      <button type="button" class="btn-add-officer" @click="showAdd = !showAdd" :title="showAdd ? 'Cancel' : 'Add new officer'">
        {{ showAdd ? '✕' : '+' }}
      </button>
    </div>

    <div v-if="showAdd" class="add-officer-row">
      <input
        ref="newInput"
        v-model="newName"
        class="add-officer-input"
        placeholder="Enter officer name..."
        @keyup.enter="addOfficer"
        @keyup.escape="showAdd = false"
      />
      <button type="button" class="btn-confirm-add" @click="addOfficer" :disabled="!newName.trim()">Add</button>
    </div>

    <!-- Officer list management -->
    <div v-if="showAdd && officers.length" class="officer-list-manage">
      <div style="font-size:11px;color:var(--gray);margin-bottom:6px;font-weight:600;letter-spacing:0.5px">SAVED OFFICERS — click ✕ to remove</div>
      <div class="officer-chips">
        <span v-for="o in officers" :key="o" class="officer-chip">
          {{ o }}
          <button type="button" @click="removeOfficer(o)" class="chip-remove">✕</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ modelValue: String })
const emit  = defineEmits(['update:modelValue'])

const STORAGE_KEY = 'bcpo_officers'

function loadOfficers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}
function saveOfficers(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch {}
}

const officers  = ref(loadOfficers())
const showAdd   = ref(false)
const newName   = ref('')
const newInput  = ref(null)

watch(showAdd, async (v) => {
  if (v) { await nextTick(); newInput.value?.focus() }
})

function addOfficer() {
  const name = newName.value.trim()
  if (!name || officers.value.includes(name)) return
  officers.value.push(name)
  saveOfficers(officers.value)
  emit('update:modelValue', name)
  newName.value = ''
  showAdd.value = false
}

function removeOfficer(name) {
  officers.value = officers.value.filter(o => o !== name)
  saveOfficers(officers.value)
  if (props.modelValue === name) emit('update:modelValue', '')
}
</script>

<style scoped>
.officer-select-wrap { display:flex;flex-direction:column;gap:6px }
.officer-row { display:flex;gap:6px }
.officer-dropdown {
  flex:1;padding:8px 12px;border-radius:8px;
  background:var(--input-bg,rgba(255,255,255,0.06));
  border:1px solid var(--border2,rgba(255,255,255,0.1));
  color:#fff;font-size:13px;cursor:pointer;
}
.officer-dropdown:focus { outline:none;border-color:var(--gold,#c9a84c) }
.btn-add-officer {
  width:36px;height:36px;border-radius:8px;border:1px solid var(--gold,#c9a84c);
  background:rgba(201,168,76,0.12);color:var(--gold,#c9a84c);
  font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:background 0.2s;
}
.btn-add-officer:hover { background:rgba(201,168,76,0.25) }
.add-officer-row { display:flex;gap:6px }
.add-officer-input {
  flex:1;padding:7px 12px;border-radius:8px;
  background:rgba(255,255,255,0.06);border:1px solid var(--gold,#c9a84c);
  color:#fff;font-size:13px;
}
.add-officer-input:focus { outline:none }
.btn-confirm-add {
  padding:7px 14px;border-radius:8px;border:none;cursor:pointer;
  background:var(--gold,#c9a84c);color:#000;font-weight:700;font-size:13px;
  transition:opacity 0.2s;
}
.btn-confirm-add:disabled { opacity:0.4;cursor:not-allowed }
.officer-list-manage {
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
  border-radius:8px;padding:10px;margin-top:2px;
}
.officer-chips { display:flex;flex-wrap:wrap;gap:6px }
.officer-chip {
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 10px;border-radius:20px;
  background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);
  color:rgba(255,255,255,0.85);font-size:12px;
}
.chip-remove {
  background:none;border:none;color:rgba(255,255,255,0.45);
  cursor:pointer;font-size:11px;padding:0;line-height:1;
  transition:color 0.15s;
}
.chip-remove:hover { color:#e74c3c }
</style>
