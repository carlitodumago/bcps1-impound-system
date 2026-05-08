<template>
  <div class="modal-bg" v-if="showReleaseDialog" @click.self="cancel" style="z-index:1200">
    <div class="modal" style="max-width:420px;padding:32px 28px;text-align:center">
      <div :style="{width:'64px',height:'64px',borderRadius:'50%',background: isRelease ? 'rgba(39,174,96,0.12)' : 'rgba(201,168,76,0.12)',border: isRelease ? '2px solid rgba(39,174,96,0.3)' : '2px solid rgba(201,168,76,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px'}">
        {{ isRelease ? '🔓' : '🚔' }}
      </div>
      <h2 style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:8px">
        {{ isRelease ? 'Confirm Vehicle Release' : 'Confirm Re-Impound' }}
      </h2>
      <p style="font-size:13px;color:var(--gray);line-height:1.6;margin-bottom:20px">
        You are about to {{ isRelease ? 'release' : 're-impound' }} vehicle<br>
        <strong style="color:var(--gold2);font-family:'Rajdhani',sans-serif;font-size:18px">{{ releaseTarget?.plate }}</strong>
      </p>

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
import { computed } from 'vue'
import { useImpoundStore } from '../composables/useImpoundStore.js'

const { showReleaseDialog, releaseTarget, releaseMode, doConfirmedRelease, doConfirmedImpound } = useImpoundStore()

const isRelease = computed(() => releaseMode.value === 'release')

function confirm() {
  if (isRelease.value) {
    doConfirmedRelease()
  } else {
    doConfirmedImpound()
  }
}

function cancel() {
  showReleaseDialog.value = false
}
</script>
