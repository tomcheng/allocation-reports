export const formatMoney = num =>
  "$" +
  Math.round(num)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatPercent = num => (num * 100).toFixed(1) + "%";
