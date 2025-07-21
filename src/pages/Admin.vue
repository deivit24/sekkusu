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
      <v-tabs v-if="selectedOffering" v-model="tab" class="mt-4">
        <v-tab value="share">Share</v-tab>
        <v-tab value="answers">Answers</v-tab>
      </v-tabs>
      <!-- Share Link -->
      <v-window v-model="tab" class="mt-4">
        <!-- Share Tab Content -->
        <v-window-item value="share">
          <div v-if="selectedOffering">
            <h3 class="text-subtitle-1">Share this link with your client:</h3>
            <v-sheet class="pa-3 rounded mt-2 d-flex justify-space-between align-center" color="#1e1e1e">
              <code class="text-mono">{{ clientLink }}</code>
              <v-btn icon @click="copyText(clientLink)">
                <v-icon size="small">mdi-content-copy</v-icon>
              </v-btn>
            </v-sheet>

            <!-- Add Service -->
            <ServiceForm
              class="mt-6"
              :offering="selectedOffering"
              @add="addService"
            />

            <!-- Service List -->
            <ServiceList
              class="mt-4"
              :offering="selectedOffering"
              :services="services"
              @remove="remove"
              @toggle="toggle"
            />
          </div>
        </v-window-item>

        <!-- Answers Tab Content -->
        <v-window-item value="answers">
          <div class="mt-4">
            <h3 class="text-subtitle-1 mb-4">Answers</h3>

            <v-card
              v-for="(entry, index) in answers"
              :key="index"
              class="mb-4 pa-4"
              color="#1e1e1e"
              elevation="2"
            >
              <div class="text-h6 d-flex justify-space-between align-center">
                <span>{{ entry.name }}</span>
              </div>

              <div class="text-caption mb-3 text-grey-lighten-1">
                {{ new Date(entry.created_at).toLocaleString() }}
              </div>

              <v-list class="bg-transparent" density="compact">
                <v-list-item
                  v-for="(ans, i) in entry.answers"
                  :key="ans.id"
                  class="bg-grey-darken-4 rounded mb-2"
                >
                  <v-list-item-content>
                    <v-list-item-title class="text-white font-weight-bold d-flex justify-space-between">
                      <span>{{ ans.service }}</span>
                      <span class="text-success">${{ Number(ans.price).toFixed(2) }}</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <!-- 💰 Total Price -->
              <div class="mt-4 text-right text-white font-weight-bold">
                Total: ${{ entry.answers.reduce((sum, a) => sum + Number(a.price), 0).toFixed(2) }}
              </div>
              <!-- Entry-level comment -->
              <div class="mt-1 text-grey-lighten-1">
                {{ entry.comment || "No comment" }}
              </div>
            </v-card>

          </div>

        </v-window-item>
      </v-window>
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

  const tab = ref('share')
  const newOfferingName = ref('')
  const selectedOfferingId = ref(null)
  const selectedOffering = ref(null)
  const offerings = ref([])
  const services = ref([])
  const answers = ref([])
  const copyText = async textToCopy => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      console.log('Text copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const offeringOptions = async () => {
    let { data, error } = await supabase
      .from('offering')
      .select('*')
      .eq('user_id', auth.user.id)
    offerings.value = data
  }

  function groupAnswersByNameAndTime (offerings) {
    const grouped = {}

    for (const offering of offerings) {
      const serviceName = offering.name
      const servicePrice = offering.price
      const serviceCommet = offering.answers[0].comment

      for (const answer of offering.answers) {
        if (!answer.selected) continue

        const key = `${answer.name.trim()}_${answer.created_at}`

        if (!grouped[key]) {
          grouped[key] = {
            name: answer.name.trim(),
            comment: answer.comment,
            created_at: answer.created_at,
            answers: [],
          }
        }

        grouped[key].answers.push({
          id: answer.id,
          service: serviceName,
          price: servicePrice,
          selected: answer.selected,
          created_at: answer.created_at,
        })
      }
    }

    // Optional: sort by created_at ascending
    return Object.values(grouped).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    )
  }

  const getAnswers = async offeringId => {
    let { data, error } = await supabase
      .from('service')
      .select(`
        id,
        name,
        description,
        price,
        answers (
          id,
          name,
          selected,
          comment,
          created_at
        )
      `)
      .eq('offering_id', offeringId)

    answers.value = groupAnswersByNameAndTime(data)
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
        await getAnswers(newVal)
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
