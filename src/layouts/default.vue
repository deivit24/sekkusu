<template>
  <v-main>
    <router-view />
  </v-main>

  <AppFooter v-if="showFooter" />
</template>

<script setup>
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // Hide footer on specific paths (like '/client')
  const showFooter = computed(() => route.path !== '/client')
</script>
