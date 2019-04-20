import React from "react";
import styled from "styled-components";
import sumBy from "lodash/sumBy";
import { BREAKDOWNS } from "./constants";
import { formatMoney, formatPercent } from "./utils";
import { Flex, Subheading } from "./styleComponents";

const Heading = styled.h2`
  margin-top: 30px;
  margin-bottom: 10px;
`;

const Account = ({ account, balance, positions, postTaxAdjustment }) => {
  const stocks =
    sumBy(
      positions,
      position =>
        position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
    ) * postTaxAdjustment;
  const bonds =
    sumBy(
      positions,
      position =>
        position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
    ) * postTaxAdjustment;
  const cash = balance.cash * postTaxAdjustment;
  const total = stocks + bonds + cash;

  return (
    <div key={account.number}>
      <Heading>{account.type}</Heading>
      <Subheading>Asset Classes</Subheading>
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
      <Subheading>Positions</Subheading>
      {positions.map(position => (
        <Flex key={position.symbol}>
          <span>{position.symbol}</span>
          <span>
            {formatMoney(position.currentMarketValue * postTaxAdjustment)}
          </span>
        </Flex>
      ))}
      <Flex>
        <span>Cash</span>
        <span>{formatMoney(balance.cash * postTaxAdjustment)}</span>
      </Flex>
    </div>
  );
};

export default Account;
