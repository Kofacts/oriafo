export function formatNaira(n) {
  const num = Number(n) || 0;
  const isNegative = num < 0;
  const absVal = Math.abs(num);
  const formatted = absVal.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  return (isNegative ? '-' : '') + '₦' + formatted;
}

export function formatDate(d) {
  if (!d) return 'No date';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return d;
  }
}
