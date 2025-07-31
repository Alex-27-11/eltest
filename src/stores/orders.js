import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getOrders } from '../api/orders';
import { formatDate, validateDate, handleError, applyFilters } from './utils/storeUtils';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([]);
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 100,
    total: 0,
  });
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    dateFrom: '2025-07-01',
    dateTo: '2025-07-30',
    page: 1,
    limit: 100,
    warehouse: null,
  });

  const fetchOrders = async () => {
    try {
      loading.value = true;
      error.value = null;

      const dateFrom = formatDate(filters.value.dateFrom);
      const dateTo = formatDate(filters.value.dateTo);

      if (!validateDate(dateFrom) || !validateDate(dateTo)) {
        throw new Error('Некорректный формат даты. Используйте YYYY-MM-DD.');
      }
      if (new Date(dateFrom) > new Date(dateTo)) {
        throw new Error('Дата "от" не может быть позже даты "до".');
      }

      const response = await getOrders({
        dateFrom,
        dateTo,
        page: filters.value.page,
        limit: filters.value.limit,
      });
      const data = response.data || [];
      orders.value = applyFilters(data, filters.value);
      meta.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      };
    } catch (err) {
      error.value = handleError(err);
      orders.value = [];
    } finally {
      loading.value = false;
    }
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    fetchOrders();
  };

  return { orders, meta, loading, error, filters, fetchOrders, updateFilters };
});