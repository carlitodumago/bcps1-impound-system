<template>
  <div class="modal-bg" v-if="showDeleteDialog" @click.self="cancel" style="z-index:1200">
    <div class="modal" style="max-width:420px;padding:32px 28px;text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:rgba(192,57,43,0.12);border:2px solid rgba(192,57,43,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px">
        🗑️
      </div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">Delete Record</h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:6px">
        You are about to permanently delete the record for<br>
        <strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:18px">{{ deleteTarget?.plate }}</strong>
      </p>
      <p style="font-size:11px;color:rgba(192,57,43,0.9);margin-bottom:20px;font-weight:600">⚠️ This action cannot be undone. Enter password to confirm.</p>
      <p style="margin:0 0 20px;font-size:14px;color:var(--gray)">This action cannot be undone. Are you sure you want to permanently delete vehicle plate <strong>{{ deleteTarget?.plate }}</strong> from the database?</p>

      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-secondary" style="flex:1;justify-content:center;padding:11px 20px" @click="cancel">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Cancel
        </button>
        <button class="btn btn-danger" style="flex:1;justify-content:center;padding:11px 20px;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;border:none;box-shadow:0 2px 12px rgba(192,57,43,0.35)" @click="confirm">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete Record
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImpoundStore } from '../composables/useImpoundStore.js'

const { showDeleteDialog, deleteTarget, doConfirmedDelete } = useImpoundStore()

function confirm() {
  doConfirmedDelete()
}

function cancel() {
  showDeleteDialog.value = false
}
</script>
