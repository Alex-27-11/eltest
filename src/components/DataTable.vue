<script setup>
import { ElTable, ElTableColumn } from 'element-plus';

defineProps({
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] },
});

const defaultColumns = [
  { prop: 'income_id', label: 'ID', width: 100 },
  { prop: 'date', label: 'Дата', width: 150 },
  { prop: 'last_change_date', label: 'Дата изменения', width: 150 },
  { prop: 'quantity', label: 'Количество', width: 120 },
  { prop: 'total_price', label: 'Цена', width: 120, formatter: row => `${parseFloat(row.total_price).toFixed(2)} ₽` },
  { prop: 'warehouse_name', label: 'Склад', width: 200 },
];
</script>

<template>
  <el-table :data="data" v-loading="loading" style="width: 100%">
    <el-table-column
      v-for="column in columns.length ? columns : defaultColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
    >
      <template v-if="column.formatter" #default="{ row }">
        {{ column.formatter(row) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>