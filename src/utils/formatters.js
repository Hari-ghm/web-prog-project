export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatPercentage = (num) => {
  if (num === null || num === undefined) return '0%';
  const prefix = num > 0 ? '+' : '';
  return `${prefix}${Number(num).toFixed(1)}%`;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};
