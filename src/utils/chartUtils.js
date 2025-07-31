export const prepareChartData = (data, key = 'quantity', groupField = 'last_change_date') => {
  const aggregatedData = data.reduce((acc, item) => {
    const group = item[groupField] || 'Неизвестно';
    const value = parseFloat(item[key]) || 0;
    acc[group] = (acc[group] || 0) + value;
    return acc;
  }, {});

  return {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: `Сумма по ${key === 'quantity' ? 'количеству' : key === 'price' ? 'цене' : 'значению'}`,
        data: Object.values(aggregatedData),
        borderColor: '#42A5F5',
        fill: false,
      },
    ],
  };
};