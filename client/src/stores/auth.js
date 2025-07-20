// stores/auth.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import router from "@/router/index.js";

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user')) || null)

  function login (userId, email) {
    user.value = { id: userId, name: email }
  }

  function logout () {
    user.value = null
    router.push('/login')
  }

  // Persist to localStorage whenever user changes
  watch(user, (newVal) => {
    if (newVal) {
      localStorage.setItem('auth_user', JSON.stringify(newVal))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, { deep: true })

  return { user, login, logout }
})
