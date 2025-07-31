<script setup>
import { ElPagination } from 'element-plus';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  meta: {
    type: Object,
    required: true,
    validator: (value) => ['current_page', 'last_page', 'per_page', 'total'].every(key => key in value),
  },
  filters: {
    type: Object,
    required: true,
    validator: (value) => ['page', 'limit'].every(key => key in value),
  },
  updateFilters: { type: Function, required: true },
});

const pageSizeOptions = [50, 100, 200, 500];

const handlePageChange = useDebounceFn((page) => {
  props.updateFilters({ page });
}, 300);

const handlePageSizeChange = (limit) => {
  props.updateFilters({ limit, page: 1 });
};
</script>

<template>
  <el-pagination
    v-model:current-page="props.filters.page"
    :page-size="typeof props.meta.per_page === 'string' ? Number(props.meta.per_page) : props.meta.per_page"
    :total="props.meta.total"
    :page-sizes="pageSizeOptions"
    layout="total, sizes, prev, pager, next"
    @current-change="handlePageChange"
    @size-change="handlePageSizeChange"
  />
</template>

<style scoped>
@media (max-width: 768px) {
  .el-pagination {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>