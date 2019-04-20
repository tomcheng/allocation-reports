import React from "react";
import sumBy from "lodash/sumBy";
import { BREAKDOWNS } from "./constants";
import { formatMoney, formatPercent } from "./utils";

const Account = ({ account, balance, positions }) => {
  const stocks = sumBy(
    positions,
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
  );
  const bonds = sumBy(
    positions,
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
  );
  const cash = balance.cash;
  const total = stocks + bonds + cash;

  return (
    <div key={account.number}>
      <h2>{account.type}</h2>
      {positions.map(position => (
        <div key={position.symbol}>
          {position.symbol}: {formatMoney(position.currentMarketValue)}
        </div>
      ))}
      <div>Cash: {formatMoney(cash)}</div>
      <div>Breakdown</div>
      <div>Stocks: {formatPercent(stocks / total)}</div>
      <div>Bonds: {formatPercent(bonds / total)}</div>
      <div>Cash: {formatPercent(cash / total)}</div>
    </div>
  );
};

export default Account;
