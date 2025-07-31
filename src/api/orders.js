import api from './index';

export const getOrders = async ({ dateFrom, dateTo, page = 1, limit = 500 }) => {
  const response = await api.get('/api/orders', {
    params: { dateFrom, dateTo, page, limit },
  });
  return response.data;
};