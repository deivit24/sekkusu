// stores/offerings.js
import { defineStore } from 'pinia'

const STORAGE_KEY = 'offerings'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useServiceStore = defineStore('offering', {
  state: () => ({
    offerings: load()
  }),
  getters: {
    getById: state => id => {
      const offering = state.offerings.find(o => o.id === Number.parseInt(id))
      return offering
    },
  },
  actions: {
    addOffering(name, description, ownerId) {
      this.offerings.push({
        id: Date.now(),
        name,
        description,
        services: [],
        ownerId,
      })
      save(this.offerings)
    },
    addService(offeringId, service) {
      const offering = this.offerings.find(o => o.id === offeringId)
      if (offering) {
        offering.services.push({ ...service, id: Date.now(), isActive: true })
        save(this.offerings)
      }
    },
    toggleService(offeringId, serviceId) {
      const offering = this.offerings.find(o => o.id === offeringId)
      if (!offering) return
      const s = offering.services.find(s => s.id === serviceId)
      if (s) s.isActive = !s.isActive
      save(this.offerings)
    },
    removeService(offeringId, serviceId) {
      const offering = this.offerings.find(o => o.id === offeringId)
      if (!offering) return
      offering.services = offering.services.filter(s => s.id !== serviceId)
      save(this.offerings)
    },
    removeOffering(offeringId) {
      this.offerings = this.offerings.filter(o => o.id !== offeringId)
      save(this.offerings)
    }
  }
})
