<script setup>
import { computed, onMounted } from 'vue';
import { useSalesStore } from '../stores/sales';
import DataTable from '../components/DataTable.vue';
import DataChart from '../components/DataChart.vue';
import DataFilters from '../components/DataFilters.vue';
import DataPagination from '../components/DataPagination.vue';
import { ElAlert } from 'element-plus';

const store = useSalesStore();

onMounted(() => {
  store.fetchSales();
});

const warehouses = computed(() => [...new Set(store.sales.map(sale => sale.warehouse_name))]);
const regions = computed(() => [...new Set(store.sales.map(sale => sale.region_name))]);

const columns = [
  { prop: 'sale_id', label: 'ID продажи', width: 150 },
  { prop: 'date', label: 'Дата', width: 150 },
  { prop: 'last_change_date', label: 'Дата изменения', width: 150 },
  { prop: 'total_price', label: 'Цена', width: 120, formatter: row => `${parseFloat(row.total_price).toFixed(2)} ₽` },
  { prop: 'price_with_disc', label: 'Цена со скидкой', width: 150, formatter: row => `${parseFloat(row.price_with_disc).toFixed(2)} ₽` },
  { prop: 'for_pay', label: 'К оплате', width: 120, formatter: row => `${parseFloat(row.for_pay).toFixed(2)} ₽` },
  { prop: 'warehouse_name', label: 'Склад', width: 200 },
  { prop: 'region_name', label: 'Регион', width: 200 },
  { prop: 'is_realization', label: 'Реализация', width: 120, formatter: row => row.is_realization ? 'Да' : 'Нет' },
];
</script>

<template>
  <div class="sales-page">
    <h1>Продажи</h1>

    <DataFilters
      :filters="store.filters"
      :updateFilters="store.updateFilters"
      :warehouses="warehouses"
      :regions="regions"
    />
    <el-alert v-if="store.error" :title="store.error" type="error" show-icon closable />
    <template v-if="store.sales.length">
      <DataChart :data="store.sales" chartKey="for_pay" dateField="last_change_date" />
      <DataTable :data="store.sales" :loading="store.loading" :columns="columns" />
    </template>
    <div v-else-if="store.loading" class="loading">Загрузка...</div>
    <div v-else>Нет данных для отображения</div>
    <DataPagination :meta="store.meta" :filters="store.filters" :updateFilters="store.updateFilters" />
  </div>
</template>

<style scoped>
.sales-page {
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 20px;
}
</style>