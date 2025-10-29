<template>
  <div id="app">
    <AppHeader v-if="authStore.isAuthenticated" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import AppHeader from './components/AppHeader.vue'

const authStore = useAuthStore()
</script>

<style scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>

