// Currency formatter
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Compact currency (e.g., $5.2K)
export function formatCompactCurrency(amount) {
  if (Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return formatCurrency(amount);
}

// Date formatting
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatShortDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export function formatMonth(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
  });
}

// Percentage
export function formatPercentage(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

// Number with commas
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Alias for formatPercentage
export const formatPercent = (value) => `${value.toFixed(1)}%`;
