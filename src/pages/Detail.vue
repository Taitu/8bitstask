<template>
  <div class="detail-page">
    <Loader v-if="loading" />
    <div v-if="error" class="error-title">
      {{ error }}
    </div>
    <div v-if="detail" class="detail-page__back">
      <router-link to="/" class="detail-page__back__link">
        &#8592; Go To Main Page
      </router-link>
    </div>
    <div v-if="detail" class="detail-page__info">
      <div class="detail-page__info__item">
        <span class="detail-page__info__item__label">Coin: </span>
        <span class="detail-page__info__item__value">{{ detail.pair.primary }}/{{ detail.pair.secondary }}</span>
      </div>
      <div class="detail-page__info__item">
        <span class="detail-page__info__item__label">Price: </span>
        <span class="detail-page__info__item__value">${{ detail.price.last }}</span>
      </div>
      <div class="detail-page__info__item">
        <span class="detail-page__info__item__label">Best offer: </span>
        <span class="detail-page__info__item__value">${{ detail.price.bestOffer }}</span>
      </div>
      <div class="detail-page__info__item">
        <span class="detail-page__info__item__label">24h Change: </span>
        <span v-if="detail.price.direction === 'Down'" class="detail-page__info__item__value detail-page__info__item__value--down">
          <span class="detail-page__info__item__value__percentage">-{{ detail.price.change.percent }}%&nbsp;</span>
          <span class="detail-page__info__item__value__amount">{{ detail.price.change.amount }}</span>
        </span>
        <span v-else class="detail-page__info__item__value detail-page__info__item__value--down">
          <span class="detail-page__info__item__value__percentage">{{ detail.price.change.percent }}%&nbsp;</span>
          <span class="detail-page__info__item__value__amount">{{ detail.price.change.amount }}</span>
        </span>
      </div>
      <div class="detail-page__info__item">
        <span class="detail-page__info__item__label">Volume: </span>
        <span class="detail-page__info__item__value">${{ detail.volume.secondary }}</span>
      </div>
    </div>
    <div class="detail-page__info__chart">
      <Chart v-if="detail" :detail="detail" />
    </div>
  </div>
</template>

<script setup>
import Chart from '@/components/charts/LinearChart.vue'
import Loader from '@/components/misc/Loader.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const code = route.params.code
const detail = ref(null)
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  fetchMarket()
})

const fetchMarket = async () => {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/market`)
    if (!response.ok) {
      error.value = 'Something happend. Please try later'
    }
    const list = await response.json()

    detail.value = list.find(item => item.pair.primary.toLowerCase() === code)
  } catch (error) {
    error.value = 'Something happend. Please try later'
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss">
.detail-page {
  .loader {
    position: fixed;
    z-index: 1;
  }
}
</style>

<style lang="scss" scoped>
.detail-page {
  &__back {
    margin-bottom: 20px;
    &__link {
      color: #000;
      text-decoration: none;
    }
  }
  &__info {
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, 1fr);
    @media all and (max-width: 480px) {
      grid-template-columns: repeat(1, 1fr);
    }

    &__item {
      font-size: 14px;
      &__label {
        font-weight: bold;
      }
    }
    &__chart {
      border-radius: 8px;
      margin-top: 50px;
      background-color: #fff;
    }
  }
}
</style>
