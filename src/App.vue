<template>
  <LoginScreen v-if="!isLoggedIn" @login="login" />
  <template v-else>
    <div class="bg-pattern"></div>
    <div class="bg-stars"></div>
    <div id="app-shell">
      <NavBar @logout="showLogoutDialog = true" />
      <MobileNav @logout="showLogoutDialog = true" />
      <main>
        <Dashboard    v-if="page === 'dashboard'" />
        <ImpoundingReceipt v-if="page === 'receipt'" :print-area="recordPrintArea" />
        <ImpoundRecords v-if="page === 'records'" />
        <Reports      v-if="page === 'reports'" />
        <UserManual   v-if="page === 'manual'" />
        <BackupRestore v-if="page === 'backup'" />
      </main>
      <ViewModal />
      <LogoutDialog @confirm="confirmLogout" />
      <ReleaseDialog />
      <EditModal />
      <EditConfirmDialog />
      <DeleteDialog />
      <DetailsModal />
      <ToastNotification />
      <div class="patrol-gif pulse" style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:32px">🚔</div>
    </div>
  </template>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useImpoundStore } from './composables/useImpoundStore.js'
import LoginScreen     from './components/LoginScreen.vue'
import NavBar          from './components/NavBar.vue'
import MobileNav       from './components/MobileNav.vue'
import Dashboard       from './components/pages/Dashboard.vue'
import ImpoundingReceipt from './components/pages/ImpoundingReceipt.vue'
import ImpoundRecords  from './components/pages/ImpoundRecords.vue'
import Reports         from './components/pages/Reports.vue'
import UserManual      from './components/pages/UserManual.vue'
import BackupRestore   from './components/pages/BackupRestore.vue'
import ViewModal       from './components/ViewModal.vue'
import LogoutDialog    from './components/LogoutDialog.vue'
import ReleaseDialog   from './components/ReleaseDialog.vue'
import EditModal       from './components/EditModal.vue'
import EditConfirmDialog from './components/EditConfirmDialog.vue'
import DeleteDialog    from './components/DeleteDialog.vue'
import DetailsModal    from './components/DetailsModal.vue'
import ToastNotification from './components/ToastNotification.vue'

const store = useImpoundStore()
const { isLoggedIn, page, showLogoutDialog, login, confirmLogout } = store
</script>

<style>
#app-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#app-shell > main {
  flex: 1;
  padding: 28px 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
@media(max-width:1024px){ #app-shell > main{ padding:20px 16px } }
@media(max-width:768px){  #app-shell > main{ padding:16px 12px } }
</style>
