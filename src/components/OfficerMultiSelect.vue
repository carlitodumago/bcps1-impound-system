<template>
  <div class="officer-multi-wrap">
    <!-- Header with + button -->
    <div class="officer-multi-header">
      <span class="officer-multi-label">APPREHENDING OFFICER/S</span>
      <button type="button" class="btn-add-officer" @click="showAdd = !showAdd" :title="showAdd ? 'Close' : 'Manage officers'">
        {{ showAdd ? '✕' : '+' }}
      </button>
    </div>

    <!-- Add new officer inline -->
    <div v-if="showAdd" class="add-officer-row">
      <input
        ref="newInput"
        v-model="newName"
        class="add-officer-input"
        placeholder="Type new officer name then press Enter..."
        @keyup.enter="addOfficer"
        @keyup.escape="showAdd = false"
      />
      <button type="button" class="btn-confirm-add" @click="addOfficer" :disabled="!newName.trim()">Add</button>
    </div>

    <!-- Saved officers chips (shown when + is open) -->
    <div v-if="showAdd && officers.length" class="officer-list-manage">
      <div style="font-size:11px;color:var(--gray);margin-bottom:6px;font-weight:600">SAVED LIST — click ✕ to remove</div>
      <div class="officer-chips">
        <span v-for="o in officers" :key="o" class="officer-chip">
          {{ o }}
          <button type="button" @click="removeOfficer(o)" class="chip-remove">✕</button>
        </span>
      </div>
    </div>

    <!-- Two officer selectors from same list -->
    <div class="officer-selectors">
      <div class="officer-select-row">
        <label class="officer-num-label">1</label>
        <select :value="officer1" @change="$emit('update:officer1', $event.target.value)" class="officer-dropdown">
          <option value="">— Select Officer —</option>
          <option v-for="o in officers" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>
      <div class="officer-select-row">
        <label class="officer-num-label">2</label>
        <select :value="officer2" @change="$emit('update:officer2', $event.target.value)" class="officer-dropdown">
          <option value="">— None (Optional) —</option>
          <option v-for="o in officers" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ officer1: String, officer2: String })
const emit = defineEmits(['update:officer1', 'update:officer2'])

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

const officers = ref(loadOfficers())
const showAdd  = ref(false)
const newName  = ref('')
const newInput = ref(null)

watch(showAdd, async (v) => {
  if (v) { await nextTick(); newInput.value?.focus() }
})

function addOfficer() {
  const name = newName.value.trim()
  if (!name || officers.value.includes(name)) { newName.value = ''; return }
  officers.value.push(name)
  saveOfficers(officers.value)
  // Auto-select into the first empty slot
  if (!props?.officer1) emit('update:officer1', name)
  else if (!props?.officer2) emit('update:officer2', name)
  newName.value = ''
}

function removeOfficer(name) {
  officers.value = officers.value.filter(o => o !== name)
  saveOfficers(officers.value)
}

</script>

<style scoped>
.officer-multi-wrap { display:flex;flex-direction:column;gap:8px }
.officer-multi-header { display:flex;align-items:center;justify-content:space-between }
.officer-multi-label { font-size:11px;font-weight:700;color:var(--gold,#c9a84c);letter-spacing:1px }
.btn-add-officer {
  width:30px;height:30px;border-radius:7px;border:1px solid var(--gold,#c9a84c);
  background:rgba(201,168,76,0.12);color:var(--gold,#c9a84c);
  font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;transition:background 0.2s;line-height:1;
}
.btn-add-officer:hover { background:rgba(201,168,76,0.28) }
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
}
.btn-confirm-add:disabled { opacity:0.4;cursor:not-allowed }
.officer-list-manage {
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
  border-radius:8px;padding:10px;
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
  cursor:pointer;font-size:11px;padding:0;line-height:1;transition:color 0.15s;
}
.chip-remove:hover { color:#e74c3c }
.officer-selectors { display:flex;flex-direction:column;gap:6px }
.officer-select-row { display:flex;align-items:center;gap:8px }
.officer-num-label {
  width:20px;height:20px;border-radius:50%;
  background:rgba(201,168,76,0.18);color:var(--gold,#c9a84c);
  font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.officer-dropdown {
  flex:1;padding:8px 12px;border-radius:8px;
  background:var(--input-bg,rgba(255,255,255,0.06));
  border:1px solid var(--border2,rgba(255,255,255,0.1));
  color:#fff;font-size:13px;cursor:pointer;
}
.officer-dropdown:focus { outline:none;border-color:var(--gold,#c9a84c) }
</style>
