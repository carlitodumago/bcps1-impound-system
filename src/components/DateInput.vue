<template>
  <div style="position:relative">
    <!-- Visible text input showing MM/DD/YYYY -->
    <input
      type="text"
      :value="displayValue"
      @input="onTextInput"
      @blur="onBlur"
      :placeholder="placeholder || 'MM/DD/YYYY'"
      maxlength="10"
      style="width:100%;padding-right:32px"
    />
    <!-- SVG Calendar Icon -->
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--gray)">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
    <!-- Hidden native date picker for calendar icon -->
    <input
      type="date"
      :value="modelValue"
      @change="onDateChange"
      tabindex="-1"
      style="position:absolute;right:0;top:0;width:32px;height:100%;opacity:0;cursor:pointer;padding:0;border:none"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({ modelValue: String, placeholder: String })
const emit = defineEmits(['update:modelValue'])

// Convert YYYY-MM-DD → MM/DD/YYYY for display
function toDisplay(iso) {
  if (!iso) return ''
  const p = iso.split('-')
  return p.length === 3 ? `${p[1]}/${p[2]}/${p[0]}` : iso
}

// Convert MM/DD/YYYY → YYYY-MM-DD for storage
function toISO(display) {
  const p = display.replace(/\D/g, '')
  if (p.length >= 8) {
    const mm = p.slice(0,2), dd = p.slice(2,4), yyyy = p.slice(4,8)
    return `${yyyy}-${mm}-${dd}`
  }
  return ''
}

const rawInput = ref('')
const focused = ref(false)

const displayValue = computed(() => toDisplay(props.modelValue))

function onTextInput(e) {
  let val = e.target.value.replace(/\D/g, '')
  if (val.length > 8) val = val.slice(0, 8)
  let formatted = val
  if (val.length > 4) formatted = `${val.slice(0,2)}/${val.slice(2,4)}/${val.slice(4)}`
  else if (val.length > 2) formatted = `${val.slice(0,2)}/${val.slice(2)}`
  e.target.value = formatted
  if (val.length === 8) {
    const iso = toISO(formatted)
    if (iso) emit('update:modelValue', iso)
  }
}

function onBlur(e) {
  const val = e.target.value.replace(/\D/g, '')
  if (val.length === 8) {
    const iso = toISO(e.target.value)
    if (iso) emit('update:modelValue', iso)
  } else if (val.length === 0) {
    emit('update:modelValue', '')
  } else {
    // Restore display
    e.target.value = displayValue.value
  }
}

function onDateChange(e) {
  emit('update:modelValue', e.target.value)
}
</script>
