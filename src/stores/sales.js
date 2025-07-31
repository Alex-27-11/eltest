import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getSales } from '../api/sales';
import { formatDate, validateDate, handleError, applyFilters } from './utils/storeUtils';

export const useSalesStore = defineStore('sales', () => {
  const sales = ref([]);
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
    region: null,
  });

  const fetchSales = async () => {
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

      const response = await getSales({
        dateFrom,
        dateTo,
        page: filters.value.page,
        limit: filters.value.limit,
        region: filters.value.region,
      });
      const data = response.data || [];
      sales.value = applyFilters(data, filters.value);
      meta.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      };
    } catch (err) {
      error.value = handleError(err);
      sales.value = [];
    } finally {
      loading.value = false;
    }
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    fetchSales();
  };

  return { sales, meta, loading, error, filters, fetchSales, updateFilters };
});