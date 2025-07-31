<script setup>
import { computed, onMounted } from 'vue';
import { useIncomesStore } from '../stores/incomes';
import DataTable from '../components/DataTable.vue';
import DataChart from '../components/DataChart.vue';
import DataFilters from '../components/DataFilters.vue';
import DataPagination from '../components/DataPagination.vue';
import { ElAlert } from 'element-plus';

const store = useIncomesStore();

onMounted(() => {
  store.fetchIncomes();
});

const warehouses = computed(() => [...new Set(store.incomes.map(income => income.warehouse_name))]);

const columns = [
  { prop: 'income_id', label: 'ID дохода', width: 120 },
  { prop: 'date', label: 'Дата', width: 150 },
  { prop: 'last_change_date', label: 'Дата изменения', width: 150 },
  { prop: 'quantity', label: 'Количество', width: 120 },
  { prop: 'total_price', label: 'Цена', width: 120, formatter: row => `${parseFloat(row.total_price).toFixed(2)} ₽` },
  { prop: 'warehouse_name', label: 'Склад', width: 200 },
  { prop: 'date_close', label: 'Дата закрытия', width: 150 },
];
</script>

<template>
  <div class="incomes-page">
    <h1>Доходы</h1>

    <!-- Фильтры -->
    <DataFilters :filters="store.filters" :updateFilters="store.updateFilters" :warehouses="warehouses" />

    <!-- Ошибка -->
    <el-alert v-if="store.error" :title="store.error" type="error" show-icon closable />

    <!-- График и таблица рендерятся только если есть данные -->
    <template v-if="store.incomes.length">
      <DataChart :data="store.incomes" chartKey="quantity" dateField="last_change_date" />
      <DataTable :data="store.incomes" :loading="store.loading" :columns="columns" />
    </template>
    <div v-else-if="store.loading" class="loading">Загрузка...</div>
    <div v-else>Нет данных для отображения</div>

    <!-- Пагинация -->
    <DataPagination :meta="store.meta" :filters="store.filters" :updateFilters="store.updateFilters" />
  </div>
</template>

<style scoped>
.incomes-page {
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 20px;
}
</style>