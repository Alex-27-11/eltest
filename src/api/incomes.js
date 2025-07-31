import api from './index';

export const getIncomes = async ({ dateFrom, dateTo, page = 1, limit = 500 }) => {
  const response = await api.get('/api/incomes', {
    params: { dateFrom, dateTo, page, limit },
  });
  return response.data;
};