import api from './index';

export const getStocks = async ({ dateFrom, page = 1, limit = 500 }) => {
  const response = await api.get('/api/stocks', {
    params: { dateFrom, page, limit },
  });
  return response.data;
};