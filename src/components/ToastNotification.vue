<template>
  <Transition name="toast-slide">
    <div v-if="toast.show" class="toast-wrap" :class="`toast-${toast.type}`">
      <div class="toast-icon">{{ iconMap[toast.type] }}</div>
      <div class="toast-body">
        <div class="toast-title">{{ toast.title }}</div>
        <div class="toast-msg">{{ toast.message }}</div>
      </div>
      <button class="toast-close" @click="hideToast">✕</button>
      <div class="toast-progress" :style="{ animationDuration: toast.duration + 'ms' }"></div>
    </div>
  </Transition>
</template>

<script setup>
import { useImpoundStore } from '../composables/useImpoundStore.js'
const { toast, hideToast } = useImpoundStore()

const iconMap = {
  success: '✅',
  warning: '⚠️',
  danger:  '🗑️',
  info:    'ℹ️',
}
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 14px;
  min-width: 300px;
  max-width: 420px;
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  background: rgba(18,22,36,0.95);
}
.toast-success { border-left: 4px solid #2ecc71 }
.toast-warning { border-left: 4px solid #f39c12 }
.toast-danger  { border-left: 4px solid #e74c3c }
.toast-info    { border-left: 4px solid #3498db }

.toast-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px }
.toast-body { flex: 1; min-width: 0 }
.toast-title {
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  margin-bottom: 3px;
}
.toast-msg {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  line-height: 1.4;
}
.toast-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  flex-shrink: 0;
  transition: color 0.15s;
}
.toast-close:hover { color: #fff }

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  animation: shrink linear forwards;
  border-radius: 0 0 14px 14px;
}
.toast-success .toast-progress { background: #2ecc71 }
.toast-warning .toast-progress { background: #f39c12 }
.toast-danger  .toast-progress { background: #e74c3c }
.toast-info    .toast-progress { background: #3498db }

@keyframes shrink {
  from { width: 100% }
  to   { width: 0% }
}

/* Slide-in from right */
.toast-slide-enter-active { transition: all 0.35s cubic-bezier(0.21,1.02,0.73,1) }
.toast-slide-leave-active { transition: all 0.25s ease-in }
.toast-slide-enter-from   { opacity: 0; transform: translateX(60px) scale(0.9) }
.toast-slide-leave-to     { opacity: 0; transform: translateX(60px) scale(0.9) }
</style>
