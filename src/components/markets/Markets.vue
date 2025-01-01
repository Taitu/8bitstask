<template>
  <div class="markets-page">
    <div class="filter">
      <div v-if="currencyCode !== 'all' || query || sortKey !== 'price' || sortDirection !== 'asc'"
        class="filter__clear-all"
        @click="clearFilter">
        Reset search &#10005;
      </div>
      <div class="filter__item">
        <input :value="query" @input="e => changeQuery(e.target.value)" class="filter__control filter__control--input" placeholder="Type to search for tokens..." />
        <span v-if="query.length > 0" class="filter__item__close" @click="changeQuery('')">&#10005;</span>
      </div>
      <div v-if="!currenciesStore.error" class="filter__item filter__currency">
        <Loader v-if="currenciesStore.loading" />
        <select :value="currencyCode" @change="e => selectCurrency(e.target.value)" class="filter__control" aria-label="Currency">
          <option value="all">
            All currencies
          </option>
          <option v-for="currency in currenciesStore.currencies" :key="currency.code" :value="currency.code">
            {{ currency.code }}
          </option>
        </select>
      </div>
      <div class="filter__item filter__item--sorting">
        <select class="filter__control" :value="sortKey" aria-label="Currency" @change="e => sortBy(e.target.value)">
          <option v-for="item in marketsTableHeadMobile" :key="item.key" :value="item.key">
            {{ item.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="market-list">
      <div class="market-list__row market-list__head">
        <MarketTableHead :sortKey="sortKey" :sortDirection="sortDirection" :sortBy="sortBy" />
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
import { useRoute, useRouter } from 'vue-router'
import { createPollingGenerator } from '@/utils/polling'
import { useCurrenciesStore } from '@/stores/currencies'
import MarketItem from '@/components/markets/MarketItem.vue'
import Loader from '@/components/misc/Loader.vue'
import MarketTableHead from '@/components/markets/MarketTableHead.vue'

const route = useRoute()
const router = useRouter()

const currenciesStore = useCurrenciesStore()

const markets = ref(null)
const error = ref(null)
const currencyCode = ref(route.query.currencyCode || 'all')
const query = ref(route.query.query || '')
const sortKey = ref(route.query.sortKey || 'price')
const sortDirection = ref(route.query.sortDirection || 'asc')

const marketsTableHeadMobile = [
  {key: 'coin', text: 'Coin (A to Z)'},
  {key: 'coin', text: 'Coin (Z to A)'},
  {key: 'price', text: 'Price (High to Low)'},
  {key: 'price', text: 'Price (Low to High)'},
  {key: 'offer', text: 'Best Offer (High to Low)'},
  {key: 'offer', text: 'Best Offer (Low to High)'},
  {key: 'change', text: '24h Change (High to Low)'},
  {key: 'change', text: '24h Change (Low to High)'},
  {key: 'volume', text: 'Volume (High to Low)'},
  {key: 'volume', text: 'Volume (Low to High)'},
]

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

const sortBy = (key) => {
  if (sortKey.value.includes(key)) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  updateQuery({
    sortKey: sortKey.value,
    sortDirection: sortDirection.value
  })
}

const changeQuery = (_query) => {
  query.value = _query
  updateQuery({
    query: _query
  })
}

const selectCurrency = (_currency) => {
  currencyCode.value = _currency
  updateQuery({
    currencyCode: _currency
  })
}

const clearFilter = () => {
  currencyCode.value = 'all'
  query.value = ''
  sortKey.value = 'price'
  sortDirection.value = 'asc'
  router.push('/')
}

const updateQuery = (_query) => {
  router.push({
    query: {
      ...route.query,
      ..._query
    }
  })
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

const filteredMarkets = computed(() => {
  const filtered = markets.value.filter(market => {
    const matchesQuery = query.value.length <= market.pair.primary.length ?
    market.pair.primary.toLowerCase().includes(query.value.toLowerCase()) || market.pair.secondary.toLowerCase().includes(query.value.toLowerCase()) :
    query.value.toLowerCase().includes(market.pair.primary.toLowerCase()) || query.value.toLowerCase().includes(market.pair.secondary.toLowerCase())

    const matchesCurrency = currencyCode.value == 'all' || market.pair.primary === currencyCode.value || market.pair.secondary === currencyCode.value

    return matchesQuery && matchesCurrency
  })

  const order = sortDirection.value === 'asc' ? 1 : -1

  switch(sortKey.value) {
    case 'coin':
      return filtered.sort((a, b) => (a.pair.primary.localeCompare(b.pair.primary)) * order)
    case 'offer':
      return filtered.sort((a, b) => (b.price.bestOffer - a.price.bestOffer) * order)
    case 'change':
      return filtered.sort((a, b) => ((b.price.change.percent * (b.price.change.direction === 'Down' ? -1 : 1)) - (a.price.change.percent * (a.price.change.direction === 'Down' ? -1 : 1))) * order)
    case 'volume':
      return filtered.sort((a, b) => (b.volume.primary - a.volume.primary) * order)
    default:
      return filtered.sort((a, b) => (b.price.last - a.price.last) * order)
  }
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
    color: $gray-color;
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
      cursor: pointer;
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
      color: $gray-color;
    }
    &--up {
      .market-list__change__percentage {
        color: $green-color;
      }
    }
    &--down {
      .market-list__change__percentage {
        color: $red-color;
      }
    }
  }
}
.filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  position: relative;
  @media all and (max-width: 640px) {
    flex-direction: column;
  }

  &__clear-all {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -25px;
    color: $gray-color;
    font-size: 12px;
    text-decoration: underline;
  }
  &__control {
    font-size: 13px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0 10px;
    margin-left: 20px;
    @media all and (max-width: 640px) {
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
    &--sorting {
      @media all and (min-width: 768px) {
        display: none;
      }
    }
    &__close {
      cursor: pointer;
      color: $gray-color;
      font-weight: bold;
      font-size: 12px;
      position: absolute;
      right: 7px;
      top: 7px;
    }
  }
}
</style>
