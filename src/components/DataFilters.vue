<script setup>
import { ref, watch } from 'vue';
import { ElDatePicker, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  filters: { type: Object, required: true },
  updateFilters: { type: Function, required: true },
  warehouses: { type: Array, default: () => [] },
  regions: { type: Array, default: () => [] },
  singleDate: { type: Boolean, default: false },
  pageSizeOptions: { type: Array, default: () => [50, 100, 200, 500] },
});

const dateRange = ref(props.singleDate ? props.filters.dateFrom : [props.filters.dateFrom, props.filters.dateTo]);

const applyFilters = useDebounceFn(() => {
  if (props.singleDate && !dateRange.value) {
    ElMessage.error('Выберите дату');
    return;
  }
  if (!props.singleDate) {
    if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
      ElMessage.error('Выберите диапазон дат');
      return;
    }
    if (new Date(dateRange.value[0]) > new Date(dateRange.value[1])) {
      ElMessage.error('Дата "от" не может быть позже даты "до"');
      return;
    }
  }
  props.updateFilters({
    dateFrom: props.singleDate ? dateRange.value : dateRange.value[0],
    dateTo: props.singleDate ? undefined : dateRange.value[1],
    page: 1,
  });
}, 300);

watch(
  () => (props.singleDate ? props.filters.dateFrom : [props.filters.dateFrom, props.filters.dateTo]),
  (newValue) => {
    dateRange.value = props.singleDate ? newValue : newValue;
  }
);
</script>

<template>
  <div class="filters">
    <el-date-picker
      v-if="singleDate"
      v-model="dateRange"
      type="date"
      placeholder="Выберите дату"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
    />
    <el-date-picker
      v-else
      v-model="dateRange"
      type="daterange"
      range-separator="до"
      start-placeholder="Дата от"
      end-placeholder="Дата до"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
    />
    <el-select
      v-model="filters.warehouse"
      placeholder="Выберите склад"
      clearable
      @change="() => updateFilters({ warehouse: filters.warehouse, page: 1 })"
    >
      <el-option v-for="warehouse in warehouses" :key="warehouse" :label="warehouse" :value="warehouse" />
    </el-select>
    <el-select
      v-if="regions.length"
      v-model="filters.region"
      placeholder="Выберите регион"
      clearable
      @change="() => updateFilters({ region: filters.region, page: 1 })"
    >
      <el-option v-for="region in regions" :key="region" :label="region" :value="region" />
    </el-select>
    <el-select
      v-model="filters.limit"
      placeholder="Записей на странице"
      @change="() => updateFilters({ limit: filters.limit, page: 1 })"
    >
      <el-option v-for="size in pageSizeOptions" :key="size" :label="size" :value="size" />
    </el-select>
    <el-button type="primary" @click="applyFilters">Применить</el-button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.filters > * {
  flex: 1 0 200px;
}
</style>