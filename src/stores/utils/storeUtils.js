import { ElMessage } from 'element-plus';

// Форматирование даты в YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0]; 
};

// Валидация даты
export const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Обработка ошибок
export const handleError = (err, defaultMessage = 'Ошибка при загрузке данных') => {
  let message = err.response?.data?.message || err.message || defaultMessage;
  if (err.response?.status === 400) {
    message = 'Некорректный запрос. Проверьте формат дат или допустимый диапазон.';
  }
  ElMessage.error(message);
  return message;
};

// Клиентская фильтрация
export const applyFilters = (data, filters) => {
  let filteredData = data;
  if (filters.warehouse) {
    filteredData = filteredData.filter(item => item.warehouse_name === filters.warehouse);
  }
  if (filters.region) {
    filteredData = filteredData.filter(item => item.region_name === filters.region);
  }
  return filteredData;
};

// Сегодняшняя дата
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};