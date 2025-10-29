import { defineStore } from 'pinia'
import { fileAPI } from '../services/api'
import { useAuthStore } from './auth'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [],
    sharedWithMe: [],
    loading: false,
    loadingShared: false,
    error: null,
    sharedError: null
  }),

  actions: {
    async fetchFiles() {
      const authStore = useAuthStore()
      
      if (!authStore.session) {
        this.error = 'Not authenticated'
        return
      }

      this.loading = true
      this.error = null

      try {
        const data = await fileAPI.listMyFiles(authStore.session)
        this.files = data.results || []
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSharedFiles() {
      const authStore = useAuthStore()
      
      if (!authStore.session) {
        this.sharedError = 'Not authenticated'
        return
      }

      this.loadingShared = true
      this.sharedError = null

      try {
        const data = await fileAPI.listSharedWithMe(authStore.session)
        this.sharedWithMe = data.results || []
      } catch (error) {
        this.sharedError = error.message
        throw error
      } finally {
        this.loadingShared = false
      }
    },

    async fetchAllFiles() {
      // Fetch both my files and shared files in parallel
      await Promise.all([
        this.fetchFiles(),
        this.fetchSharedFiles()
      ])
    },

    async uploadFile(file) {
      const authStore = useAuthStore()
      
      if (!authStore.session) {
        throw new Error('Not authenticated')
      }

      const result = await fileAPI.uploadFile(authStore.session, file)
      
      // Refresh file lists
      await this.fetchAllFiles()
      
      return result
    },

    async downloadFile(fileId, filename) {
      const authStore = useAuthStore()
      
      if (!authStore.session) {
        throw new Error('Not authenticated')
      }

      await fileAPI.downloadFile(authStore.session, fileId, filename)
    }
  }
})

