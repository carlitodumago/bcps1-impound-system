<template>
  <div class="modal-bg" v-if="showReleaseDialog" @click.self="cancel" style="z-index:1200">
    <div class="modal" style="max-width:420px;padding:32px 28px;text-align:center">
      <div :style="{width:'64px',height:'64px',borderRadius:'50%',background: isRelease ? 'rgba(39,174,96,0.12)' : 'rgba(201,168,76,0.12)',border: isRelease ? '2px solid rgba(39,174,96,0.3)' : '2px solid rgba(201,168,76,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px'}">
        {{ isRelease ? '🔓' : '🚔' }}
      </div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">
        {{ isRelease ? 'Confirm Vehicle Release' : 'Confirm Re-Impound' }}
      </h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:6px">
        You are about to {{ isRelease ? 'release' : 're-impound' }} vehicle<br>
        <strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:18px">{{ releaseTarget?.plate }}</strong>
      </p>
      <p style="font-size:11px;color:rgba(136,146,164,0.7);margin-bottom:20px">Enter authorization password to proceed.</p>

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
          <button @click="showPw = !showPw" type="button" style="position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--gray);padding:4px"><svg v-if="showPw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg><svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-secondary" style="flex:1;justify-content:center;padding:11px 20px" @click="cancel">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Cancel
        </button>
        <button class="btn" :style="isRelease ? 'flex:1;justify-content:center;padding:11px 20px;background:linear-gradient(135deg,#1a7a4a,#27ae60);color:#fff;border:none;box-shadow:0 2px 12px rgba(39,174,96,0.35)' : 'flex:1;justify-content:center;padding:11px 20px;background:linear-gradient(135deg,#b8860b,#c9a84c);color:#fff;border:none;box-shadow:0 2px 12px rgba(201,168,76,0.35)'" @click="confirm">
          <svg v-if="isRelease" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {{ isRelease ? 'Release Vehicle' : 'Impound Vehicle' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useImpoundStore } from '../composables/useImpoundStore.js'

const { showReleaseDialog, releaseTarget, releaseMode, doConfirmedRelease, doConfirmedImpound } = useImpoundStore()

const isRelease = computed(() => releaseMode.value === 'release')
const password = ref('')
const showPw = ref(false)
const error = ref(false)
const pwInput = ref(null)

watch(showReleaseDialog, (val) => {
  if (val) {
    password.value = ''
    error.value = false
    showPw.value = false
    nextTick(() => pwInput.value?.focus())
  }
})

function confirm() {
  if (password.value === 'bcps1') {
    if (isRelease.value) {
      doConfirmedRelease()
    } else {
      doConfirmedImpound()
    }
    password.value = ''
    error.value = false
  } else {
    error.value = true
    password.value = ''
    setTimeout(() => error.value = false, 3500)
  }
}

function cancel() {
  showReleaseDialog.value = false
  password.value = ''
  error.value = false
}
</script>
