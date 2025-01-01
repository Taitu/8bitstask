<template>
  <div class="chart-container" ref="chartContainer">
    <Chart
      :size="{ width: chartWidth, height: chartHeight }"
      :data="graphData"
      :margin="{
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      }"
      direction="horizontal"
      :axis="axis"
    >
      <template #layers>
        <Grid strokeDasharray="1,1" />
        <Line :dataKeys="['name', 'price']" :lineStyle="{stroke: '#2962ff'}" />
      </template>

      <template #widgets>
        <Tooltip
          borderColor="#48CAE4"
          :config="{
            name: { hide: true },
            price: { color: '#2962ff' }
          }"
        />
      </template>
    </Chart>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { Chart, Grid, Line, Tooltip } from 'vue3-charts'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

const chartContainer = ref(null)
const chartWidth = ref(640)
const chartHeight = ref(420)

const graphData = computed(() =>
  props.detail.priceHistory.map((value, index) => ({ name: index + 1, price: parseFloat(value) }))
)

const min = computed(() => {
  const min = Math.min(...props.detail.priceHistory)
  return min - (min * 0.01)
})

const max = computed(() => {
  const max = Math.max(...props.detail.priceHistory)
  return max + (max * 0.01)
})

const axis = ref({
  primary: {
    type: 'band',
    format: (val) => val
  },
  secondary: {
    domain: [min.value, max.value],
    type: 'linear',
    ticks: 20
  }
})

onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    if (chartContainer.value) {
      chartWidth.value = chartContainer.value.clientWidth
      chartHeight.value = chartContainer.value.clientHeight
    }
  })

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }

  return () => {
    resizeObserver.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 420px;
}
</style>
