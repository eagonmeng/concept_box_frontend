<template>
  <div class="files-view">
    <div class="page-header">
      <h1>My Files</h1>
      <div class="header-actions">
        <label class="btn btn-primary">
          <input
            type="file"
            @change="handleFileSelect"
            style="display: none"
            :disabled="uploading"
          />
          {{ uploading ? 'Uploading...' : '+ Upload File' }}
        </label>
      </div>
    </div>

    <div v-if="uploadError" class="alert alert-error">
      {{ uploadError }}
    </div>

    <div v-if="uploadSuccess" class="alert alert-success">
      {{ uploadSuccess }}
    </div>

    <!-- My Files Section -->
    <div class="section">
      <h2 class="section-title">My Files</h2>
      
      <div v-if="filesStore.loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <div v-else-if="filesStore.error" class="alert alert-error">
        {{ filesStore.error }}
      </div>

      <div v-else-if="filesStore.files.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3>No files yet</h3>
        <p>Upload your first file to get started</p>
      </div>

      <div v-else class="files-grid">
        <FileCard
          v-for="file in filesStore.files"
          :key="file.file"
          :file="file"
          @download="handleDownload"
          @share="openShareModal"
        />
      </div>
    </div>

    <!-- Shared With Me Section -->
    <div class="section" v-if="!filesStore.loadingShared || filesStore.sharedWithMe.length > 0">
      <h2 class="section-title">Shared With Me</h2>
      
      <div v-if="filesStore.loadingShared" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <div v-else-if="filesStore.sharedError" class="alert alert-error">
        {{ filesStore.sharedError }}
      </div>

      <div v-else-if="filesStore.sharedWithMe.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
        </svg>
        <h3>No shared files</h3>
        <p>Files that others share with you will appear here</p>
      </div>

      <div v-else class="files-grid">
        <SharedFileCard
          v-for="file in filesStore.sharedWithMe"
          :key="file.file"
          :file="file"
          @download="handleDownload"
        />
      </div>
    </div>

    <ShareModal
      v-if="shareModalFile"
      :file="shareModalFile"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFilesStore } from '../stores/files'
import FileCard from '../components/FileCard.vue'
import SharedFileCard from '../components/SharedFileCard.vue'
import ShareModal from '../components/ShareModal.vue'

const filesStore = useFilesStore()

const uploading = ref(false)
const uploadError = ref(null)
const uploadSuccess = ref(null)
const shareModalFile = ref(null)

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = null
  uploadSuccess.value = null

  try {
    await filesStore.uploadFile(file)
    uploadSuccess.value = `Successfully uploaded ${file.name}`
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      uploadSuccess.value = null
    }, 3000)
    
    // Clear file input
    event.target.value = ''
  } catch (error) {
    uploadError.value = error.message
  } finally {
    uploading.value = false
  }
}

const handleDownload = async (file) => {
  try {
    await filesStore.downloadFile(file.file, file.filename)
  } catch (error) {
    uploadError.value = `Download failed: ${error.message}`
  }
}

const openShareModal = (file) => {
  shareModalFile.value = file
}

const closeShareModal = () => {
  shareModalFile.value = null
}

onMounted(() => {
  filesStore.fetchAllFiles()
})
</script>

<style scoped>
.files-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .files-grid {
    grid-template-columns: 1fr;
  }
}
</style>

