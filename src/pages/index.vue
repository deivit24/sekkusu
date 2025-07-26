<template>
  <div class="terminal-container">
    <h1 class="terminal-title">Welcome Service Creator</h1>

    <v-card class="terminal-card pa-6" elevation="8" max-width="600" min-width="400">
      <v-text-field
        v-model="email"
        dense
        label="Email"
        outlined
        required
        type="email"
      />

      <v-text-field
        v-model="password"
        class="mt-4"
        dense
        label="Password"
        outlined
        required
        type="password"
      />

      <v-alert
        v-if="errorMessage"
        class="mt-4"
        dense
        dismissible
        type="error"
        @input="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>

      <div class="button-row mt-6">
        <v-btn
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleLogin"
        >
          Login
        </v-btn>
        <v-btn
          color="secondary"
          :disabled="loading"
          :loading="loading"
          @click="handleSignUp"
        >
          Signup
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import supabase from '@/service/supabase.js'
  import { useAuthStore } from '@/stores/auth'

  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const loading = ref(false)

  const auth = useAuthStore()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = 'Please enter email and password.'
      return
    }
    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) {
        errorMessage.value = error.message
        loading.value = false
        return
      }

      if (data?.user) {
        auth.login(data.user.id)
        router.push('/admin')
      }
    } catch (error) {
      errorMessage.value = error.message || 'Unexpected error occurred'
    } finally {
      loading.value = false
    }
  }

  const handleSignUp = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = 'Please enter email and password.'
      return
    }
    loading.value = true
    errorMessage.value = ''

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) {
        errorMessage.value = error.message
        loading.value = false
        return
      }

      alert('Check your email for the confirmation link!')
    } catch (error) {
      errorMessage.value = error.message || 'Unexpected error occurred'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
.terminal-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
  font-family: 'Fira Code', monospace;
  padding: 2rem;
  color: #d4d4d4;
}

.terminal-title {
  font-size: 2rem;
  color: #9cdcfe;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 8px #569cd6;
}

.terminal-card {
  background-color: #252526 !important;
  color: #d4d4d4 !important;
  border: 1px solid #333;
  border-radius: 8px;
}

.button-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
