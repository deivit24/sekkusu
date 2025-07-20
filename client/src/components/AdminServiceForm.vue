<template>
  <v-card class="pa-4 mb-4">
    <v-text-field v-model="name" label="Service Name" />
    <v-text-field v-model="description" label="Description" />
    <v-text-field v-model.number="price" label="Price" type="number" />
    <v-btn color="primary" @click="addService">Add Service</v-btn>
  </v-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useServiceStore } from '../stores/service'

  const serviceStore = useServiceStore()

  const name = ref('')
  const description = ref('')
  const price = ref(0)

  const addService = () => {
    if (!name.value || !price.value) return
    serviceStore.add({
      name: name.value,
      description: description.value,
      price: price.value,
    })
    name.value = ''
    description.value = ''
    price.value = 0
  }
</script>
