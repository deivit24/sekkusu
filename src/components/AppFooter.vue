<template>
  <v-footer app class="d-flex align-center justify-start px-4" height="40">
    <v-btn
      class="ml-2"
      icon
      size="small"
      variant="text"
      @click="auth.user ? auth.logout() : router.push('/')"
    >
      <v-icon class="mr-2" :icon="auth.user ? 'mdi-logout' : 'mdi-login'" />
      {{ auth.user ? 'Logout' : 'Login' }}
    </v-btn>
  </v-footer>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const auth = useAuthStore()
  const router = useRouter()
</script>
