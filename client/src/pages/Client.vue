<template>
  <div class="d-flex justify-center pa-6">
    <div class="form-container">
      <h2 class="terminal-title">{{ title }}</h2>
      <h3 class="text-h6 mb-2">{{ selectedOffering.name }}</h3>
      <p class="text-body-2 text-grey mb-4">{{ selectedOffering.description }}</p>

      <v-card v-if="selectedOffering" class="pa-6 terminal-card">
        <!-- Service List -->
        <div
          v-for="service in selectedOffering.service || []"
          :key="service.id"
          class="mb-3"
        >
          <v-checkbox
            v-model="selectedIds"
            class="terminal-checkbox"
            hide-details
            :label="`${service.name} - $${service.price}`"
            :value="service.id"
          />
          <div class="terminal-description">
            {{ service.description }}
          </div>
        </div>

        <!-- Total -->
        <div
          v-if="selectedOffering.service?.length"
          class="mt-4 total-line"
        >
          <strong>Total:</strong> ${{ total }}
        </div>

        <!-- Full Name -->
        <v-text-field
          v-model="fullName"
          class="mt-6"
          label="Full Name"
          outlined
          required
        />

        <!-- Optional Comment -->
        <v-textarea
          v-model="comment"
          class="mt-4"
          label="Comment (optional)"
          outlined
          rows="3"
        />

        <!-- Submit Button -->
        <v-btn
          class="mt-6 terminal-submit-btn"
          color="primary"
          :disabled="!fullName"
          @click="handleSubmit"
        >
          Submit
        </v-btn>
      </v-card>
      <v-alert
        v-if="alert"
        class="mb-6"
        closable
        :text="alertSuccessMessage"
        title="Successfully Sent!"
        type="success"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import supabase from '@/service/supabase.js'
  import { useServiceStore } from '@/stores/service'

  const route = useRoute()
  const userId = route.query.userId
  const offeringId = ref(route.query.offeringId || null)

  const alert = ref(false)
  const alertSuccessMessage = ref('')
  const selectedOffering = ref({ name: '' })
  const selectedIds = ref([])
  const title = ref('Build your package')
  const fullName = ref('')
  const comment = ref('')

  const handleSubmit = async () => {
    const allServices = selectedOffering.value?.service || []
    const result = allServices.map(service => ({
      service_id: service.id,
      name: fullName.value,
      comment: comment.value,
      selected: selectedIds.value.includes(service.id),
    }))

    const { data, error } = await supabase
      .from('answers')
      .insert(result)
      .select()

    if (error) {
      console.log(error)
    } else {
      alert.value = true
      alertSuccessMessage.value = 'Your package has been successfully recorded. Your provider will reach out shortly'
      selectedIds.value = []
      fullName.value = ''
      comment.value = ''
      await load()
    }
  }

  const load = async () => {
    let { data, error } = await supabase
      .from('offering')
      .select(`
      id,
      name,
      description,
      service (
        id,
        name,
        description,
        price
      )
    `)
      .eq('id', offeringId.value)
      .eq('user_id', userId)

    if (error) {
      console.log(error)
    } else {
      selectedOffering.value = data[0]
    }
  }

  onMounted(load)

  const total = computed(() => {
    if (!selectedOffering.value) return 0
    return selectedOffering.value.service
      .filter(s => selectedIds.value.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0)
  })
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 700px;
}

.terminal-title {
  font-size: 24px;
  border-bottom: 1px solid #555;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  color: #9cdcfe;
  font-family: 'Fira Code', monospace;
}

.terminal-card {
  background-color: #252526;
  color: #d4d4d4;
  border: 1px solid #333;
  font-family: 'Fira Code', monospace;
}

.terminal-checkbox {
  margin-bottom: 0.5rem;
}

.terminal-description {
  margin-left: 2rem;
  font-size: 0.875rem;
  color: #ce9178;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.total-line {
  color: #b5cea8;
  font-size: 1rem;
}

.terminal-submit-btn {
  font-weight: bold;
  font-size: 16px;
  padding: 10px 24px;
  border-radius: 8px;
}
</style>
