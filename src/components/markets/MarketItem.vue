<template>
  <div class="market-list__row market-list__body">
    <div class="market-list__cell">
      <router-link :to="`/detail/${market.pair.primary.toLowerCase()}`" class="market-list__cell__title">
        <span class="market-list__cell__label">Coin: </span>
        {{ market.pair.primary }}/{{ market.pair.secondary }}
      </router-link>
    </div>
    <div class="market-list__cell">
      <span class="market-list__cell__label">Price: </span>
      ${{ market.price.last }}
    </div>
    <div class="market-list__cell">
      <span class="market-list__cell__label">Best offer: </span>
      ${{ market.price.bestOffer}}
    </div>
    <div v-if="market.price.direction === 'Down'" class="market-list__cell market-list__change market-list__change--down">
      <span class="market-list__cell__label">24h Change: </span>
      <span class="market-list__change__percentage">-{{ market.price.change.percent }}%</span>
      <span class="market-list__change__amount">{{ market.price.change.amount }}</span>
    </div>
    <div v-else class="market-list__cell market-list__change market-list__change--up">
      <span class="market-list__cell__label">24h Change: </span>
      <span class="market-list__change__percentage">{{ market.price.change.percent }}%&nbsp;</span>
      <span class="market-list__change__amount">{{ market.price.change.amount }}</span>
    </div>
    <div class="market-list__cell">
      <span class="market-list__cell__label">Volume: </span>
      ${{ market.volume.secondary }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  market: Object,
  required: true
});

</script>

<style lang="scss" scoped>
.market-list {
  &__body {
    &:nth-child(odd) {
      background-color: #eee;
    }
  }
  &__cell {
    &__label {
      font-weight: bold;
      @media all and (min-width: 768px) {
        display: none;
      }
    }
    &__title {
      font-weight: bold;
      color: #000;
      text-decoration: none;
    }
  }
}
</style>
