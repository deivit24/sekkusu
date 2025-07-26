<template>
  <v-card class="pa-4 terminal-style">
    <h3>Services for {{ offering.name }}</h3>
    <v-divider class="mb-2" />
    <v-card
      v-for="service in services"
      :key="service.id"
      class="mb-2 pa-2 terminal-style-inner"
    >
      <div class="d-flex justify-space-between align-center">
        <div>
          <strong>{{ service.name }}</strong> - ${{ service.price }}
          <p class="text-caption">{{ service.description }}</p>
        </div>
        <div>
          <v-btn icon @click="$emit('remove', service.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
  defineProps({ offering: Object, services: Array })
  defineEmits(['toggle', 'remove'])
</script>

<style scoped>
.terminal-style {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Fira Code', monospace;
}

.terminal-style-inner {
  background-color: #2d2d2d;
  color: #dcdcdc;
}
</style>
