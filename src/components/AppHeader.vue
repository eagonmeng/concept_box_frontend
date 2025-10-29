<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="logo">📦 ConceptBox</h1>
      </div>
      
      <div class="header-right">
        <span class="username">{{ authStore.username }}</span>
        
        <button 
          @click="toggleLogging" 
          :class="['btn', 'btn-ghost', 'btn-sm']"
          :title="loggingEnabled ? 'Disable logging' : 'Enable logging'"
        >
          {{ loggingEnabled ? '📝 Logging ON' : '📝 Logging OFF' }}
        </button>
        
        <button @click="handleLogout" class="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { logger } from '../services/logger'

const router = useRouter()
const authStore = useAuthStore()
const loggingEnabled = ref(logger.isEnabled())

const toggleLogging = () => {
  if (loggingEnabled.value) {
    logger.disable()
  } else {
    logger.enable()
  }
  loggingEnabled.value = logger.isEnabled()
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loggingEnabled.value = logger.isEnabled()
})
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  box-shadow: var(--shadow);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.875rem;
}
</style>

