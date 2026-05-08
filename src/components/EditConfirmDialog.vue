<template>
  <div class="modal-bg" v-if="showEditConfirmDialog" @click.self="cancel" style="z-index:1300">
    <div class="modal" style="max-width:420px;padding:32px 28px;text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:rgba(26,115,232,0.12);border:2px solid rgba(26,115,232,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px">
        ✏️
      </div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">Confirm Changes</h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:20px">
        You are about to save changes to the record for<br>
        <strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:18px">{{ pendingEditData?.plate }}</strong>
      </p>

      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-secondary" style="flex:1;justify-content:center;padding:11px 20px" @click="cancel">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Cancel
        </button>
        <button class="btn btn-primary" style="flex:1;justify-content:center;padding:11px 20px" @click="confirm">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImpoundStore } from '../composables/useImpoundStore.js'

const { showEditConfirmDialog, pendingEditData, doConfirmedUpdate } = useImpoundStore()

function confirm() {
  doConfirmedUpdate()
}

function cancel() {
  showEditConfirmDialog.value = false
}
</script>
