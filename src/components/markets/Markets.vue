<template>
  <div class="markets-page">
    <div class="filter">
      <div class="filter__item">
        <input class="filter__control filter__control--input" v-model.trim="query" placeholder="Type to search for tokens..." />
        <span v-if="query.length > 0" class="filter__item__close" @click="query = ''">&#10005;</span>
      </div>
      <div v-if="!currenciesStore.error" class="filter__item filter__currency">
        <Loader v-if="currenciesStore.loading" />
        <select class="filter__control" v-model="currencyCode">
          <option :value="null">
            Select currency
          </option>
          <option v-for="currency in currenciesStore.currencies" :key="currency.code" :value="currency.code">
            {{ currency.code }}
          </option>
        </select>
      </div>
    </div>
    <div class="market-list">
      <div class="market-list__row market-list__head">
        <div class="market-list__cell">Coin</div>
        <div class="market-list__cell">Price</div>
        <div class="market-list__cell">Best Offer</div>
        <div class="market-list__cell">24h Change</div>
        <div class="market-list__cell">Volume</div>
      </div>
      <div v-if="markets" class="market-list__items">
        <div v-if="filteredMarkets.length === 0" class="market-list__empty">
          No data found...
        </div>
        <MarketItem v-for="market in filteredMarkets" :key="market.pair.primary" :market="market" />
      </div>
      <Loader size="20" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { createPollingGenerator } from '@/utils/polling'
import { useCurrenciesStore } from '@/stores/currencies'
import MarketItem from '@/components/markets/MarketItem.vue'
import Loader from '@/components/misc/Loader.vue'

const currenciesStore = useCurrenciesStore()

const markets = ref(null)
const currencyCode = ref(null)
const query = ref('')
const error = ref(null)

const pollingInterval = import.meta.env.VITE_POLLING_INTERVAL
let pollingAbortController

const pollMarkets = createPollingGenerator(`${import.meta.env.VITE_API_URL}/market`, pollingInterval)

const startPolling = async () => {
  pollingAbortController = new AbortController()
  const signal = pollingAbortController.signal
  const generator = pollMarkets()

  for await (const marketData of generator) {
    if (signal.aborted) {
      break
    }
    if (marketData.error) {
      error.value = marketData.error
      continue
    }
    markets.value = marketData
    error.value = null
  }
};

const stopPolling = () => {
  if (pollingAbortController) {
    pollingAbortController.abort()
  }
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

const filteredMarkets = computed(() => {
  return markets.value.filter(market => {
    const matchesQuery = query.value.length <= market.pair.primary.length ?
    market.pair.primary.toLowerCase().includes(query.value.toLowerCase()) || market.pair.secondary.toLowerCase().includes(query.value.toLowerCase()) :
    query.value.toLowerCase().includes(market.pair.primary.toLowerCase()) || query.value.toLowerCase().includes(market.pair.secondary.toLowerCase())

    const matchesCurrency = !currencyCode.value || market.pair.primary === currencyCode.value || market.pair.secondary === currencyCode.value

    return matchesQuery && matchesCurrency
  })
})
</script>

<style lang="scss">
.market-list {
  .loader {
    position: fixed;
    z-index: 1;
    top: 0;
  }
  &__items {
    + .loader {
      display: none;
    }
  }
  &__empty {
    text-align: center;
    padding-top: 20px;
    color: #5f6873;
    font-weight: bold;
  }
  &__row {
    padding: 15px;
    display: grid;
    gap: 6px; 
    grid-template-columns: repeat(5, 1fr);
    @media all and (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media all and (max-width: 480px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  &__head {
    background-color: #ccc;
    @media all and (max-width: 768px) {
      display: none;
    }
    .market-list__cell {
      font-weight: bold;
    }
  }
  &__cell {
    font-size: 13px;
    &--title {
      font-weight: bold;
    }
  }
  &__change {
    font-size: 12px;
    &__amount {
      color: #5f6873;
    }
    &--up {
      .market-list__change__percentage {
        color: $green-color;
      }
    }
    &--down {
      .market-list__change__percentage {
        color: #ff3d00;
      }
    }
  }
}
.filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  @media all and (max-width: 480px) {
    flex-direction: column;
  }
  &__control {
    font-size: 13px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0 10px;
    margin-left: 20px;
    @media all and (max-width: 480px) {
      width: 100%;
      margin-left: 0;
      margin-bottom: 10px;
    }
    &--input {
      min-width: 200px;
      padding-right: 25px;
    }
  }
  &__currency {
    position: relative;
    .loader {
      position: absolute;
    }
  }
  &__item {
    position: relative;
    &__close {
      cursor: pointer;
      color: #5f6873;
      font-weight: bold;
      font-size: 12px;
      position: absolute;
      right: 7px;
      top: 7px;
    }
  }
}
</style>
