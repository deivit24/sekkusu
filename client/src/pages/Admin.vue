<template>
  <div class="d-flex justify-center pa-6">
    <div class="admin-container">
      <h1 class="admin-title mb-6">Admin Panel</h1>

      <!-- Add Offering -->
      <OfferingForm v-model="newOfferingName" @add="addOffering" />

      <!-- Select Offering -->
      <OfferingSelector
        v-model="selectedOfferingId"
        class="mt-4"
        :offerings="offerings"
      />

      <!-- Share Link -->
      <div v-if="selectedOffering" class="mt-6">
        <h3 class="text-subtitle-1">Share this link with your client:</h3>
        <v-sheet class="pa-3 rounded mt-2 d-flex justify-space-between align-center" color="#1e1e1e">
          <code class="text-mono">{{ clientLink }}</code>
          <v-btn icon @click="copyText(clientLink)">
            <v-icon size="small">mdi-content-copy</v-icon>
          </v-btn>
        </v-sheet>
      </div>

      <!-- Delete Offering -->
      <v-btn
        v-if="selectedOffering"
        class="mt-4"
        color="red"
        @click="removeOffering"
      >
        Delete Offering
      </v-btn>

      <!-- Add Service -->
      <ServiceForm
        v-if="selectedOffering"
        class="mt-6"
        :offering="selectedOffering"
        @add="addService"
      />

      <!-- Service List -->
      <ServiceList
        v-if="selectedOffering"
        class="mt-4"
        :offering="selectedOffering"
        :services="services"
        @remove="remove"
        @toggle="toggle"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import OfferingForm from '@/components/OfferingForm.vue'
  import OfferingSelector from '@/components/OfferingSelector.vue'
  import ServiceForm from '@/components/ServiceForm.vue'
  import ServiceList from '@/components/ServiceList.vue'
  import supabase from '@/service/supabase.js'
  import { useAuthStore } from '@/stores/auth'
  import { useServiceStore } from '@/stores/service'

  const store = useServiceStore()
  const auth = useAuthStore()

  const newOfferingName = ref('')
  const selectedOfferingId = ref(null)
  const selectedOffering = ref(null)
  const offerings = ref([])
  const services = ref([])
  const copyText = async textToCopy => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      console.log('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const offeringOptions = async () => {
    let { data, error } = await supabase
      .from('offering')
      .select('*')
      .eq('user_id', auth.user.id)
    offerings.value = data
  }

  const getOfferingServices = async offeringId => {
    let { data, error } = await supabase
      .from('service')
      .select('*')
      .eq('offering_id', offeringId)

    selectedOffering.value = offerings.value.find(offering => offering.id === offeringId)
    services.value = data
  }

  onMounted(offeringOptions)

  const clientLink = computed(() => {
    const base = window.location.origin
    return `${base}/client?userId=${auth.user.id}&offeringId=${selectedOfferingId.value}`
  })

  watch(
    selectedOfferingId,
    async newVal => {
      if (newVal) {
        selectedOfferingId.value = newVal
        await getOfferingServices(newVal)
      }
    },
    { deep: true },
  )

  const addOffering = async (name, description) => {
    const { data, error } = await supabase
      .from('offering')
      .insert([{ name, description, user_id: auth.user.id }])
      .select()

    if (error) {
      console.error('Failed to create offering:', error)
    } else {
      offerings.value.push(data[0])
    }
  }

  const addService = async service => {
    service.offering_id = selectedOfferingId.value
    const { data, error } = await supabase.from('service').insert(service).select()
    if (!error) services.value.push(data[0])
  }

  const toggle = id => {
    store.toggleService(selectedOfferingId.value, id)
  }

  const remove = async id => {
    const { error } = await supabase.from('service').delete().eq('id', id)
    if (!error) services.value = services.value.filter(service => service.id !== id)
  }

  const removeOffering = () => {
    if (selectedOfferingId.value !== null) {
      store.removeOffering(selectedOfferingId.value)
      selectedOfferingId.value = null
    }
  }
</script>

<style scoped>
.admin-container {
  width: 100%;
  max-width: 800px;
}

.admin-title {
  font-size: 28px;
  font-weight: bold;
  color: #9cdcfe;
  font-family: 'Fira Code', monospace;
}

.text-mono {
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  color: #ce9178;
  word-break: break-all;
}
</style>
