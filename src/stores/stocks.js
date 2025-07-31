import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getStocks } from '../api/stocks';
import { formatDate, validateDate, handleError, applyFilters, getTodayDate } from './utils/storeUtils';

export const useStocksStore = defineStore('stocks', () => {
  const stocks = ref([]);
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 100,
    total: 0,
  });
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    dateFrom: getTodayDate(),
    page: 1,
    limit: 100,
    warehouse: null,
  });

  const fetchStocks = async () => {
    try {
      loading.value = true;
      error.value = null;

      const dateFrom = formatDate(filters.value.dateFrom);
      if (!validateDate(dateFrom)) {
        throw new Error('Некорректный формат даты. Используйте YYYY-MM-DD.');
      }

      const response = await getStocks({
        dateFrom,
        page: filters.value.page,
        limit: filters.value.limit,
      });
      const data = response.data || [];
      stocks.value = applyFilters(data, filters.value);
      meta.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      };
    } catch (err) {
      error.value = handleError(err);
      stocks.value = [];
    } finally {
      loading.value = false;
    }
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    fetchStocks();
  };

  return { stocks, meta, loading, error, filters, fetchStocks, updateFilters };
});