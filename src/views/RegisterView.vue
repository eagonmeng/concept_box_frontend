<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="text-center mb-4">
        <h1 class="logo-large">📦 ConceptBox</h1>
        <p class="text-muted">Secure File Storage & Sharing</p>
      </div>

      <h2>Create Account</h2>

      <div v-if="error" class="alert alert-error" role="alert">
        <span class="alert-icon">⚠️</span>
        <span class="alert-message">{{ error }}</span>
      </div>

      <div v-if="success" class="alert alert-success" role="alert">
        <span class="alert-icon">✓</span>
        <span class="alert-message">{{ success }}</span>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="Choose a username"
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
            placeholder="Choose a password"
            required
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm your password"
            required
            autocomplete="new-password"
          />
        </div>

        <button 
          type="submit" 
          class="btn btn-primary"
          style="width: 100%"
          :disabled="loading"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <div class="auth-footer">
        <p class="text-sm text-muted">
          Already have an account?
          <router-link to="/login" class="link">Login here</router-link>
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
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleRegister = async () => {
  loading.value = true
  error.value = null
  success.value = null

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    loading.value = false
    return
  }

  try {
    await authStore.register(username.value, password.value)
    success.value = 'Account created successfully! Redirecting to login...'
    
    // Clear form
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
    
    // Redirect after short delay
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    // Provide user-friendly error messages
    error.value = err.message || 'Registration failed. Please try again.'
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

