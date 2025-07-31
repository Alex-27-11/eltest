<script setup>
import { computed, onMounted } from 'vue';
import { useStocksStore } from '../stores/stocks';
import DataTable from '../components/DataTable.vue';
import DataChart from '../components/DataChart.vue';
import DataFilters from '../components/DataFilters.vue';
import DataPagination from '../components/DataPagination.vue';
import { ElAlert } from 'element-plus';

const store = useStocksStore();

onMounted(() => {
  store.fetchStocks();
});

const warehouses = computed(() => [...new Set(store.stocks.map(stock => stock.warehouse_name))]);

const columns = [
  { prop: 'nm_id', label: 'ID номенклатуры', width: 150 },
  { prop: 'date', label: 'Дата', width: 150 },
  { prop: 'quantity', label: 'Количество', width: 120 },
  { prop: 'price', label: 'Цена', width: 120, formatter: row => `${parseFloat(row.price).toFixed(2)} ₽` },
  { prop: 'discount', label: 'Скидка (%)', width: 120 },
  { prop: 'warehouse_name', label: 'Склад', width: 200 },
  { prop: 'sc_code', label: 'Код склада', width: 150 },
];
</script>

<template>
  <div class="stocks-page">
    <h1>Склады</h1>

    <DataFilters
      :filters="store.filters"
      :updateFilters="store.updateFilters"
      :warehouses="warehouses"
      :singleDate="true"
    />
    <el-alert v-if="store.error" :title="store.error" type="error" show-icon closable />
    <template v-if="store.stocks.length">
      <DataChart :data="store.stocks" chartKey="quantity" dateField="warehouse_name" />
      <DataTable :data="store.stocks" :loading="store.loading" :columns="columns" />
    </template>
    <div v-else-if="store.loading" class="loading">Загрузка...</div>
    <div v-else>Нет данных для отображения</div>
    <DataPagination :meta="store.meta" :filters="store.filters" :updateFilters="store.updateFilters" />
  </div>
</template>

<style scoped>
.stocks-page {
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 20px;
}
</style>