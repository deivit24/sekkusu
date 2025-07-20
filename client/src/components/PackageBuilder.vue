<template>
  <v-card class="pa-4">
    <v-checkbox
      v-for="service in serviceStore.activeServices"
      :key="service.id"
      v-model="selectedIds"
      :label="`${service.name} - $${service.price}`"
      :value="service.id"
    />
    <p class="mt-4"><strong>Total:</strong> ${{ total }}</p>
  </v-card>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useServiceStore } from '../stores/service'

  const serviceStore = useServiceStore()
  const selectedIds = ref([])

  const total = computed(() =>
    serviceStore.services
      .filter(s => selectedIds.value.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0)
  )
</script>
