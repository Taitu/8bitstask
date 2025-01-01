<template>
  <main class="main">
    <router-view />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCurrenciesStore } from '@/stores/currencies'

const currenciesStore = useCurrenciesStore()

onMounted(() => {
  currenciesStore.fetchCurrencies()
})
</script>

<style lang="scss" scoped>
.main {
  max-width: 720px;
  margin: 50px auto;
  padding: 0 15px;
}
</style>
