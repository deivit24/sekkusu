<template>
  <v-card class="pa-4 mb-4 terminal-card">
    <div class="terminal-header">Add New Offering</div>

    <v-text-field
      v-model="form.name"
      label="Offering Name"
      placeholder="e.g. Car Wash, Tennis Lessons"
      hide-details
      variant="underlined"
      class="terminal-input"
    />

    <v-textarea
      v-model="form.description"
      label="Offering Description"
      placeholder="Brief description..."
      rows="3"
      auto-grow
      hide-details
      variant="underlined"
      class="terminal-input"
    />

    <v-btn color="primary" class="mt-4" @click="submit">
      Add Offering
    </v-btn>
  </v-card>
</template>

<script setup>
  import { reactive } from 'vue'

  const emit = defineEmits(['add'])

  const form = reactive({
    name: '',
    description: '',
  })

  const submit = () => {
    if (!form.name || !form.description) return
    emit('add', form.name, form.description)
    form.name = ''
    form.description = ''
  }
</script>

<style scoped>
.terminal-card {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Fira Code', 'Courier New', monospace;
  border-radius: 8px;
  box-shadow: 0 0 10px #000;
}

.terminal-header {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #00ff87;
}

.terminal-input .v-input__control {
  color: #d4d4d4;
}

.terminal-input input,
.terminal-input textarea {
  font-family: 'Fira Code', 'Courier New', monospace;
  color: #d4d4d4 !important;
}
</style>
