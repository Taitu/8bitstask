<template>
  <div v-for="item in marketsTableHead" :key="item.key"  class="market-list__cell" @click="sortBy(item.key)">
    {{ item.text }}
    <span v-if="sortKey === item.key">
      {{ sortDirection == 'asc' ? '&#8595;' : '&#8593;'  }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  sortKey: {
    type: String,
    required: true
  },
  sortDirection: {
    type: String,
    required: true
  },
  sortBy: {
    type: Function,
    required: true
  }
})
const marketsTableHead = [
  {key: 'coin', text: 'Coin'},
  {key: 'price', text: 'Price'},
  {key: 'offer', text: 'Best Offer'},
  {key: 'change', text: '24h Change'},
  {key: 'volume', text: 'Volume'},
]
</script>