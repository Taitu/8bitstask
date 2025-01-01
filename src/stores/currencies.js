import { defineStore } from 'pinia'

export const useCurrenciesStore = defineStore('currencies', {
  state: () => ({
    currencies: [],
    error: null,
    loading: false
  }),
  actions: {
    async fetchCurrencies() {
      this.loading = true
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/currencies`)
        const data = await response.json()
        this.currencies = data
        this.error = null
      } catch (error) {
        this.error = 'Something happened. Please try it later...'
      } finally {
        this.loading = false
      }
    }
  }
})
