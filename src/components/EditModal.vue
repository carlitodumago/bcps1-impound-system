<template>
  <div class="modal-bg" v-if="showEditModal" @click.self="showEditModal = false" style="z-index:1100">
    <div class="modal" style="max-width:700px;padding:0;overflow:hidden">
      <div class="modal-header" style="padding:16px 24px;margin-bottom:0;border-bottom:1px solid var(--border2)">
        <h2>Edit Record — {{ form.plate }}</h2>
        <button class="modal-close" @click="showEditModal = false">✕</button>
      </div>

      <div v-if="form" style="padding:20px 24px;max-height:65vh;overflow-y:auto">
        <div class="form-grid" style="margin-bottom:16px">
          <div class="form-group">
            <label>TYPE OF VEHICLE</label>
            <input v-model="form.type" placeholder="e.g. Motorcycle, Car, SUV..." />
          </div>
          <div class="form-group"><label>PLATE NUMBER</label><input v-model="form.plate" style="text-transform:uppercase" /></div>
          <div class="form-group"><label>COLOR</label><input v-model="form.color" /></div>
          <div class="form-group"><label>ENGINE NUMBER</label><input v-model="form.engineNo" style="text-transform:uppercase" /></div>
          <div class="form-group"><label>CHASSIS NUMBER</label><input v-model="form.chassisNo" style="text-transform:uppercase" /></div>
          <div class="form-group"><label>DATE APPREHENDED</label><DateInput v-model="form.date" /></div>
          <div class="form-group"><label>TIME</label><input type="time" v-model="form.time" /></div>
          <div class="form-group"><label>LOCATION</label><input v-model="form.location" /></div>
          <div class="form-group full">
            <label>VEHICLE PHOTO <span style="color:var(--gray);font-weight:400;font-size:11px">(Optional)</span></label>
            <div class="photo-upload-area" @click="$refs.editPhotoInput.click()" @dragover.prevent @drop.prevent="onPhotoDrop">
              <input ref="editPhotoInput" type="file" accept="image/*" style="display:none" @change="onPhotoSelect" />
              <div v-if="!form.photo" class="photo-placeholder">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Click or drag photo here</span>
              </div>
              <div v-else class="photo-preview-wrap">
                <img :src="form.photo" alt="Vehicle photo" class="photo-preview-img" />
                <button class="photo-remove-btn" @click.stop="form.photo = ''" title="Remove photo">✕</button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-grid" style="margin-bottom:16px">
          <div class="form-group full"><label>DRIVER'S NAME</label><input v-model="form.driver" /></div>
          <div class="form-group full"><label>DRIVER'S ADDRESS</label><input v-model="form.driverAddress" /></div>
          <div class="form-group full"><label>REGISTERED OWNER</label><input v-model="form.owner" /></div>
          <div class="form-group full"><label>OWNER'S ADDRESS</label><input v-model="form.ownerAddress" /></div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>VIOLATION 1</label>
            <select v-model="form.vio1">
              <option value="">-- Select --</option>
              <option v-for="v in violations" :key="v">{{ v }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>VIOLATION 2</label>
            <select v-model="form.vio2">
              <option value="">-- None --</option>
              <option v-for="v in violationTypes" :key="v">{{ v }}</option>
            </select>
          </div>
          <div class="form-group full"><OfficerMultiSelect :officer1="form.officer" :officer2="form.officer2" @update:officer1="form.officer=$event" @update:officer2="form.officer2=$event" /></div>
          <div class="form-group"><label>REMARKS</label><input v-model="form.remarks" /></div>
        </div>
      </div>

      <div style="padding:16px 24px;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid var(--border2)">
        <button class="btn btn-primary" @click="doUpdate">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Changes
        </button>
        <button class="btn btn-secondary" @click="showEditModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useImpoundStore } from '../composables/useImpoundStore.js'
import OfficerMultiSelect from './OfficerMultiSelect.vue'
import DateInput from './DateInput.vue'

const { showEditModal, editTarget, requestUpdateRecord, violationTypes } = useImpoundStore()

const form = ref({})

watch(editTarget, (val) => {
  if (val) {
    form.value = { ...val }
  }
})

function doUpdate() {
  if (!form.value.plate || !form.value.type || !form.value.driver) {
    alert('Please fill in required fields: Vehicle Type, Plate Number, and Driver Name.')
    return
  }
  requestUpdateRecord(form.value)
}

function onPhotoSelect(e) {
  const file = e.target.files?.[0]
  if (file) readPhotoFile(file)
}
function onPhotoDrop(e) {
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) readPhotoFile(file)
}
function readPhotoFile(file) {
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      const max = 800
      let w = img.width, h = img.height
      if (w > max || h > max) {
        if (w > h) { h = Math.round(h * max / w); w = max }
        else { w = Math.round(w * max / h); h = max }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      form.value.photo = canvas.toDataURL('image/jpeg', 0.7)
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}
</script>
