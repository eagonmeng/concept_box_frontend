<template>
  <div class="file-card card">
    <div class="file-preview">
      <!-- Image preview -->
      <div v-if="isImage(file.filename)" class="image-preview-container">
        <img 
          v-if="previewURL && !imageError"
          :src="previewURL"
          :alt="file.filename"
          class="image-preview"
          @error="imageError = true"
        />
        <div v-else-if="loadingPreview" class="preview-loading">
          <div class="spinner-sm"></div>
        </div>
        <div v-else class="file-icon">
          {{ getFileIcon(file.filename) }}
        </div>
      </div>
      
      <!-- PDF preview indicator -->
      <div v-else-if="isPDF(file.filename)" class="document-preview">
        <div class="file-icon-large">📄</div>
        <span class="file-type-badge">PDF</span>
      </div>
      
      <!-- Video preview indicator -->
      <div v-else-if="isVideo(file.filename)" class="document-preview">
        <div class="file-icon-large">🎥</div>
        <span class="file-type-badge">{{ getFileExtension(file.filename).toUpperCase() }}</span>
      </div>
      
      <!-- Audio preview indicator -->
      <div v-else-if="isAudio(file.filename)" class="document-preview">
        <div class="file-icon-large">🎵</div>
        <span class="file-type-badge">{{ getFileExtension(file.filename).toUpperCase() }}</span>
      </div>
      
      <!-- Archive preview indicator -->
      <div v-else-if="isArchive(file.filename)" class="document-preview">
        <div class="file-icon-large">📦</div>
        <span class="file-type-badge">{{ getFileExtension(file.filename).toUpperCase() }}</span>
      </div>
      
      <!-- Default icon for other files -->
      <div v-else class="file-icon">
        {{ getFileIcon(file.filename) }}
      </div>
    </div>
    
    <div class="file-info">
      <h3 class="file-name" :title="file.filename">{{ file.filename }}</h3>
      <p class="file-owner text-sm">
        <span class="owner-label">Shared by:</span>
        <span class="owner-name">{{ file.ownerUsername }}</span>
      </p>
      <p class="file-id text-sm text-muted">ID: {{ file.file.slice(0, 8) }}...</p>
    </div>

    <div class="file-actions">
      <button 
        @click="$emit('download', file)"
        class="btn btn-primary btn-sm"
        title="Download file"
      >
        ⬇️ Download
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { fileAPI } from '../services/api'

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

defineEmits(['download'])

const authStore = useAuthStore()
const previewURL = ref(null)
const loadingPreview = ref(false)
const imageError = ref(false)

const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

const isImage = (filename) => {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)
}

const isPDF = (filename) => {
  return getFileExtension(filename) === 'pdf'
}

const isVideo = (filename) => {
  const ext = getFileExtension(filename)
  return ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'].includes(ext)
}

const isAudio = (filename) => {
  const ext = getFileExtension(filename)
  return ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(ext)
}

const isArchive = (filename) => {
  const ext = getFileExtension(filename)
  return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)
}

const getFileIcon = (filename) => {
  const ext = getFileExtension(filename)
  
  const iconMap = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📝',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    webp: '🖼️',
    mp4: '🎥',
    mov: '🎥',
    avi: '🎥',
    mp3: '🎵',
    wav: '🎵',
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    xlsx: '📊',
    xls: '📊',
    csv: '📊',
    ppt: '📊',
    pptx: '📊'
  }
  
  return iconMap[ext] || '📁'
}

// Load image preview on mount
onMounted(async () => {
  if (isImage(props.file.filename)) {
    loadingPreview.value = true
    try {
      previewURL.value = await fileAPI.getPreviewURL(authStore.session, props.file.file)
    } catch (error) {
      console.error('Failed to load image preview:', error)
      imageError.value = true
    } finally {
      loadingPreview.value = false
    }
  }
})
</script>

<style scoped>
.file-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.file-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  border-radius: var(--radius);
  overflow: hidden;
}

.image-preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner-sm {
  border: 2px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.document-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
}

.file-icon {
  font-size: 3rem;
  text-align: center;
  padding: 1rem 0;
}

.file-icon-large {
  font-size: 4rem;
  line-height: 1;
}

.file-type-badge {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 1rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-owner {
  margin: 0.5rem 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.owner-label {
  color: var(--gray-500);
  font-size: 0.75rem;
}

.owner-name {
  color: var(--primary);
  font-weight: 600;
}

.file-id {
  margin: 0.25rem 0 0;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}
</style>

