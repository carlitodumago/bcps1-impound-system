<template>
  <nav class="no-print">
    <div class="nav-inner">
      <div class="nav-logo">
        <div class="nav-logo-icon" style="background: transparent;">
          <img src="/logo-pnp-icon.png" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div class="nav-logo-text">
          <strong>BCPS 1</strong>
          <span>Butuan City Police Station 1</span>
        </div>
      </div>
      <div class="nav-links">
        <div v-for="link in links" :key="link.page" class="nav-link" :class="{ active: page === link.page }" @click="navigate(link.page, link.reset)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="link.icon"></svg>
          {{ link.label }}
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-badge"><span style="width:7px;height:7px;border-radius:50%;background:#27ae60;display:inline-block"></span> Online</div>
        <div class="nav-time">{{ currentTime }}</div>
        <button class="btn-logout" @click="emit('logout')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
      <div class="hamburger" :class="{ open: mobileMenuOpen }" @click="mobileMenuOpen = !mobileMenuOpen">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useImpoundStore } from '../composables/useImpoundStore.js'
const emit = defineEmits(['logout'])
const { page, currentTime, mobileMenuOpen } = useImpoundStore()

const links = [
  { page: 'dashboard', label: 'Dashboard',           icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
  { page: 'receipt',   label: 'Impounding Receipt',  icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
  { page: 'records',   label: 'Impound Records',      icon: '<path d="M3 3h18v18H3z"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>' },
  { page: 'reports',   label: 'Statistics & Reports', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { page: 'manual',    label: 'User Manual',          icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
  { page: 'backup',    label: 'Backup & Restore',     icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },
]

function navigate(p) {
  page.value = p
  mobileMenuOpen.value = false
}
</script>
