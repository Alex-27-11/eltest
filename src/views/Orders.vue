<script setup>
import { computed, onMounted } from 'vue';
import { useOrdersStore } from '../stores/orders';
import DataTable from '../components/DataTable.vue';
import DataChart from '../components/DataChart.vue';
import DataFilters from '../components/DataFilters.vue';
import DataPagination from '../components/DataPagination.vue';
import { ElAlert } from 'element-plus';

const store = useOrdersStore();

onMounted(() => {
  store.fetchOrders();
});

const warehouses = computed(() => [...new Set(store.orders.map(order => order.warehouse_name))]);

const columns = [
  { prop: 'g_number', label: 'Номер заказа', width: 200 },
  { prop: 'date', label: 'Дата и время', width: 180 },
  { prop: 'last_change_date', label: 'Дата изменения', width: 150 },
  { prop: 'total_price', label: 'Цена', width: 120, formatter: row => `${parseFloat(row.total_price).toFixed(2)} ₽` },
  { prop: 'discount_percent', label: 'Скидка (%)', width: 120 },
  { prop: 'warehouse_name', label: 'Склад', width: 150 },
  { prop: 'oblast', label: 'Регион', width: 150 },
  { prop: 'is_cancel', label: 'Отменен', width: 100, formatter: row => row.is_cancel ? 'Да' : 'Нет' },
];
</script>

<template>
  <div class="orders-page">
    <h1>Заказы</h1>
    <DataFilters :filters="store.filters" :updateFilters="store.updateFilters" :warehouses="warehouses" />
    <el-alert v-if="store.error" :title="store.error" type="error" show-icon closable />
    <template v-if="store.orders.length">
      <DataChart :data="store.orders" chartKey="total_price" dateField="last_change_date" />
      <DataTable :data="store.orders" :loading="store.loading" :columns="columns" />
    </template>
    <div v-else-if="store.loading" class="loading">Загрузка...</div>
    <div v-else>Нет данных для отображения</div>
    <DataPagination :meta="store.meta" :filters="store.filters" :updateFilters="store.updateFilters" />
  </div>
</template>

<style scoped>
.orders-page {
  padding: 20px;
}
.loading {
  text-align: center;
  padding: 20px;
}
</style>