<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content card">
      <div class="modal-header">
        <h2>Share File</h2>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <div class="file-info-box">
          <p class="text-sm text-muted">Sharing:</p>
          <p class="file-name">{{ file.filename }}</p>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <form @submit.prevent="handleShare" class="share-form">
          <div class="form-group">
            <label class="form-label" for="username">Username to share with</label>
            <div class="input-group">
              <input
                id="username"
                v-model="shareUsername"
                type="text"
                class="form-input"
                placeholder="Enter username"
                required
                :disabled="loading"
              />
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="loading || !shareUsername"
              >
                {{ loading ? 'Sharing...' : 'Share' }}
              </button>
            </div>
          </div>
        </form>

        <div v-if="sharedWith.length > 0" class="shared-list">
          <h3 class="text-sm">Shared with:</h3>
          <div class="shared-items">
            <div 
              v-for="(username, index) in sharedWith" 
              :key="index"
              class="shared-item"
            >
              <span>{{ username }}</span>
              <button 
                @click="handleRevoke(username)"
                class="btn btn-danger btn-sm"
                :disabled="revoking"
                title="Revoke access"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { sharingAPI } from '../services/api'

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const authStore = useAuthStore()

const shareUsername = ref('')
const sharedWith = ref([])
const loading = ref(false)
const revoking = ref(false)
const error = ref(null)
const success = ref(null)

const handleShare = async () => {
  if (!shareUsername.value.trim()) return

  loading.value = true
  error.value = null
  success.value = null

  try {
    await sharingAPI.shareFile(
      authStore.session,
      props.file.file,
      shareUsername.value
    )
    
    success.value = `Successfully shared with ${shareUsername.value}`
    
    // Add to shared list if not already there
    if (!sharedWith.value.includes(shareUsername.value)) {
      sharedWith.value.push(shareUsername.value)
    }
    
    // Clear input
    shareUsername.value = ''
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = null
    }, 3000)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleRevoke = async (username) => {
  if (!confirm(`Revoke access for ${username}?`)) return

  revoking.value = true
  error.value = null
  success.value = null

  try {
    await sharingAPI.revokeAccess(
      authStore.session,
      props.file.file,
      username
    )
    
    success.value = `Access revoked for ${username}`
    
    // Remove from shared list
    sharedWith.value = sharedWith.value.filter(u => u !== username)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = null
    }, 3000)
  } catch (err) {
    error.value = err.message
  } finally {
    revoking.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--gray-500);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
}

.close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-info-box {
  background: var(--gray-50);
  padding: 1rem;
  border-radius: var(--radius);
}

.file-info-box p {
  margin: 0;
}

.file-name {
  font-weight: 500;
  word-break: break-all;
}

.share-form {
  margin: 0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group .form-input {
  flex: 1;
}

.shared-list h3 {
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
}

.shared-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shared-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--gray-50);
  border-radius: var(--radius);
}

.shared-item span {
  font-weight: 500;
}
</style>

