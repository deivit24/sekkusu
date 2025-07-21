<template>
  <v-card class="pa-4 mb-4 terminal-style">
    <h3>Add Service to {{ offering.name }}</h3>
    <v-text-field v-model="name" label="Service Name" />
    <v-text-field v-model="description" label="Description" />
    <v-text-field v-model.number="price" label="Price" type="number" />
    <v-btn color="success" @click="submit">Add Service</v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'

  defineProps({ offering: Object })
  const emit = defineEmits(['add'])

  const name = ref('')
  const description = ref('')
  const price = ref(0)

  const submit = () => {
    if (!name.value || !price.value) return
    emit('add', {
      name: name.value,
      description: description.value,
      price: price.value,
    })
    name.value = ''
    description.value = ''
    price.value = 0
  }
</script>

<style scoped>
.terminal-style {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Courier New', Courier, monospace;
  padding: 1rem;
  border-radius: 8px;
}
</style>
