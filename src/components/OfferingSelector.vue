<template>
  <div class="terminal-style">
    <v-select
      class="mb-4"
      hide-details
      item-title="name"
      item-value="id"
      :items="props.offerings"
      label="Select Offering"
      :model-value="props.modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'

  const props = defineProps({
    modelValue: [String, Number, null], // The selected offering ID
    offerings: Array,
  })

  defineEmits(['update:modelValue'])

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
