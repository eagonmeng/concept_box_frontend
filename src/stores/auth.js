import { defineStore } from 'pinia'
import { authAPI } from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: localStorage.getItem('conceptbox_session') || null,
    username: localStorage.getItem('conceptbox_username') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.session
  },

  actions: {
    async register(username, password) {
      const data = await authAPI.register(username, password)
      return data.user
    },

    async login(username, password) {
      const data = await authAPI.login(username, password)
      this.session = data.session
      this.username = username
      
      // Persist session
      localStorage.setItem('conceptbox_session', data.session)
      localStorage.setItem('conceptbox_username', username)
      
      return data
    },

    async logout() {
      if (this.session) {
        try {
          await authAPI.logout(this.session)
        } catch (error) {
          // Continue logout even if API call fails
          console.error('Logout API call failed:', error)
        }
      }
      
      this.session = null
      this.username = null
      
      localStorage.removeItem('conceptbox_session')
      localStorage.removeItem('conceptbox_username')
    }
  }
})

