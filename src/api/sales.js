import api from './index';

export const getSales = async ({ dateFrom, dateTo, page = 1, limit = 500, region }) => {
  const response = await api.get('/api/sales', {
    params: { dateFrom, dateTo, page, limit, region_name: region },
  });
  return response.data;
};