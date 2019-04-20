export const formatMoney = num =>
  "$" + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatPercent = num => (num * 100).toFixed(1) + "%";
