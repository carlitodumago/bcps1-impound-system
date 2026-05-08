<template>
  <div class="modal-bg" v-if="showEditConfirmDialog" @click.self="cancel" style="z-index:1300">
    <div class="modal" style="max-width:420px;padding:32px 28px;text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:rgba(26,115,232,0.12);border:2px solid rgba(26,115,232,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px">
        ✏️
      </div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">Confirm Changes</h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:6px">
        You are about to save changes to the record for<br>
        <strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:18px">{{ pendingEditData?.plate }}</strong>
      </p>
      <p style="font-size:11px;color:rgba(26,115,232,0.9);margin-bottom:20px;font-weight:600">🔐 Enter your authorization password to apply the changes.</p>

      <div v-if="error" style="background:rgba(192,57,43,0.15);border:1px solid rgba(192,57,43,0.4);border-radius:8px;padding:10px 14px;font-size:12px;color:#ef5350;margin-bottom:16px;display:flex;align-items:center;gap:8px">
        <span>⚠️</span><span>Incorrect password. Please try again.</span>
      </div>

      <div style="text-align:left;margin-bottom:20px">
        <label style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;display:block">Authorization Password</label>
        <div style="position:relative">
          <input
            :type="showPw ? 'text' : 'password'"
            v-model="password"
            placeholder="Enter password"
            @keydown.enter="confirm"
            ref="pwInput"
            style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.14);border-radius:9px;padding:11px 40px 11px 14px;font-size:13px;color:var(--white);font-family:'Inter',sans-serif"
          />
          <button @click="showPw = !showPw" type="button" style="position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--gray);padding:4px">
            <svg v-if="showPw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>

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
import { ref, nextTick, watch } from 'vue'
import { useImpoundStore } from '../composables/useImpoundStore.js'

const { showEditConfirmDialog, pendingEditData, doConfirmedUpdate } = useImpoundStore()

const password = ref('')
const showPw = ref(false)
const error = ref(false)
const pwInput = ref(null)

watch(showEditConfirmDialog, (val) => {
  if (val) {
    password.value = ''
    error.value = false
    showPw.value = false
    nextTick(() => pwInput.value?.focus())
  }
})

function confirm() {
  if (password.value === 'bcps1') {
    doConfirmedUpdate()
    password.value = ''
    error.value = false
  } else {
    error.value = true
    password.value = ''
    setTimeout(() => error.value = false, 3500)
  }
}

function cancel() {
  showEditConfirmDialog.value = false
  password.value = ''
  error.value = false
}
</script>
