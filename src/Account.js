import React from "react";
import styled from "styled-components";
import sumBy from "lodash/sumBy";
import { BREAKDOWNS } from "./constants";
import { formatMoney, formatPercent } from "./utils";

const Subheading = styled.div`
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 5px;
  margin-top: 10px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

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
      <Subheading>Positions</Subheading>
      {positions.map(position => (
        <Flex key={position.symbol}>
          <span>{position.symbol}</span>
          <span>{formatMoney(position.currentMarketValue)}</span>
        </Flex>
      ))}
      <Flex>
        <span>Cash</span>
        <span>{formatMoney(cash)}</span>
      </Flex>
      <Subheading>Breakdown</Subheading>
      <Flex>
        <span>Stocks</span>
        <span>{formatPercent(stocks / total)}</span>
      </Flex>
      <Flex>
        <span>Bonds</span>
        <span>{formatPercent(bonds / total)}</span>
      </Flex>
      <Flex>
        <span>Cash</span>
        <span>{formatPercent(cash / total)}</span>
      </Flex>
    </div>
  );
};

export default Account;
