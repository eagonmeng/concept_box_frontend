<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="text-center mb-4">
        <h1 class="logo-large">📦 ConceptBox</h1>
        <p class="text-muted">Secure File Storage & Sharing</p>
      </div>

      <h2>Login</h2>

      <div v-if="error" class="alert alert-error" role="alert">
        <span class="alert-icon">⚠️</span>
        <span class="alert-message">{{ error }}</span>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="Enter your username"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary"
          style="width: 100%"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="auth-footer">
        <p class="text-sm text-muted">
          Don't have an account?
          <router-link to="/register" class="link">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    await authStore.login(username.value, password.value)
    router.push('/files')
  } catch (err) {
    // Provide user-friendly error messages
    error.value = err.message || 'Login failed. Please check your credentials and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
}

.logo-large {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.alert-message {
  flex: 1;
}
</style>

