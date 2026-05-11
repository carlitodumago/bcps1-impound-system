<template>
  <div id="login-screen">
    <div style="position:absolute;inset:0;background-image:radial-gradient(1px 1px at 15% 25%,rgba(201,168,76,0.25) 0%,transparent 100%),radial-gradient(1px 1px at 75% 15%,rgba(201,168,76,0.2) 0%,transparent 100%),radial-gradient(2px 2px at 55% 65%,rgba(201,168,76,0.12) 0%,transparent 100%),radial-gradient(1px 1px at 35% 85%,rgba(255,255,255,0.08) 0%,transparent 100%);pointer-events:none"></div>
    <div class="login-card">
      <div class="login-stars"></div>
      <div class="login-logo">
        <div class="login-logo-badge" style="background: transparent;">
          <img src="/logo-pnp-icon.png" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div class="login-title">
          <strong>BCPS 1</strong>
          <span>Butuan City Police Station 1 — Impound System</span>
        </div>
      </div>
      <div class="login-divider"></div>
      <div class="login-heading">🔒 AUTHORIZED ACCESS ONLY</div>
      <div v-if="error" class="login-error">
        <span>⚠️</span><span>{{ errorMsg || 'Invalid username or password.' }}</span>
      </div>
      <div class="login-form-group">
        <label>Username</label>
        <div class="login-input-wrap">
          <span class="input-icon">👤</span>
          <input type="text" v-model="username" placeholder="Enter username" autocomplete="username" @keydown.enter="doLogin" />
        </div>
      </div>
      <div class="login-form-group">
        <label>Password</label>
        <div class="login-input-wrap">
          <span class="input-icon">🔑</span>
          <input :type="showPw ? 'text' : 'password'" v-model="password" placeholder="Enter password" autocomplete="current-password" @keydown.enter="doLogin" />
          <button class="login-toggle-pw" type="button" @click="showPw = !showPw"><svg v-if="showPw" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg><svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px">
        <input type="checkbox" id="remember-me" v-model="remember" style="width:15px;height:15px;accent-color:var(--gold);cursor:pointer;flex-shrink:0">
        <label for="remember-me" style="font-size:12px;color:var(--gray);cursor:pointer;letter-spacing:0.3px;margin:0;font-weight:400">Remember username &amp; password</label>
      </div>
      <button class="login-btn" :disabled="loading" @click="doLogin">
        {{ loading ? '✓ ACCESS GRANTED...' : '🚔 LOGIN TO SYSTEM' }}
      </button>
      <div class="login-footer">
        <span>BCPO Impound Management System v2.0</span><br>
        Butuan City Police Office — Station 1<br>
        Unauthorized access is strictly prohibited.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase.js'
const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const remember = ref(false)
const showPw   = ref(false)
const error    = ref(false)
const errorMsg = ref('')
const loading  = ref(false)

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('bcpo_remember'))
    if (saved?.user && saved?.pass) {
      username.value = saved.user
      password.value = saved.pass
      remember.value = true
    }
  } catch {}
})

async function doLogin() {
  if (!username.value || !password.value) {
    errorMsg.value = 'Please enter both username and password.'
    error.value = true
    setTimeout(() => error.value = false, 3500)
    return
  }
  
  loading.value = true
  error.value = false
  
  // Query custom admin_users table in Supabase
  const { data, error: err } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username.value)
    .eq('password', password.value)
    .single()

  if (err || !data) {
    loading.value = false
    errorMsg.value = 'Invalid username or password. Please try again.'
    error.value = true
    password.value = ''
    setTimeout(() => error.value = false, 3500)
  } else {
    if (remember.value) {
      try { localStorage.setItem('bcpo_remember', JSON.stringify({ user: username.value, pass: password.value })) } catch {}
    } else {
      try { localStorage.removeItem('bcpo_remember') } catch {}
    }
    emit('login', data)
  }
}
</script>
