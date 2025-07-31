<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { prepareChartData } from '../utils/chartUtils';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
  data: { type: Array, required: true },
  chartKey: { type: String, default: 'quantity' },
  dateField: { type: String, default: 'last_change_date' },
});

const chartData = computed(() => prepareChartData(props.data, props.chartKey, props.dateField));
</script>

<template>
  <div class="chart">
    <Line :data="chartData" :options="{ responsive: true }" />
  </div>
</template>

<style scoped>
.chart {
  max-width: 600px;
  margin-bottom: 20px;
}
</style>