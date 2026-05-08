<template>
  <div class="modal-bg" v-if="showLogoutDialog" @click.self="showLogoutDialog = false" style="z-index:1100">
    <div class="modal" style="max-width:400px;padding:32px 28px;text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:rgba(192,57,43,0.12);border:2px solid rgba(192,57,43,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px">🔓</div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">Confirm Logout</h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:8px">Are you sure you want to log out of the<br><strong style="color:var(--gold2)">BCPO Station 1 Impound System</strong>?</p>
      <p style="font-size:11px;color:rgba(136,146,164,0.7);margin-bottom:28px">Your session will be ended and you will be returned to the login page.</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-secondary" style="flex:1;justify-content:center;padding:11px 20px" @click="showLogoutDialog = false">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Cancel
        </button>
        <button class="btn btn-danger" style="flex:1;justify-content:center;padding:11px 20px;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;border:none;box-shadow:0 2px 12px rgba(192,57,43,0.35)" @click="emit('confirm')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImpoundStore } from '../composables/useImpoundStore.js'
const emit = defineEmits(['confirm'])
const { showLogoutDialog } = useImpoundStore()
</script>
