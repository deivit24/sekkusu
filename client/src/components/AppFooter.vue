<template>
  <v-footer app height="40" class="d-flex align-center justify-start px-4">
    <v-btn
      icon
      class="ml-2"
      variant="text"
      size="small"
      @click="auth.user ? auth.logout() : router.push('/')"

    >
      <v-icon class="mr-2" :icon="auth.user ? 'mdi-logout' : 'mdi-login'" />
      {{auth.user ? 'Logout' : 'Login'}}
    </v-btn>
  </v-footer>
</template>

<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'

  const auth = useAuthStore()
  const router = useRouter()
</script>
