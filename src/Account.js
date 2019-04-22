import React from "react";
import styled from "styled-components";
import sumBy from "lodash/sumBy";
import { BREAKDOWNS } from "./constants";
import { Subheading } from "./styleComponents";
import LineItem from "./LineItem";

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
      <LineItem label="Stocks" amount={stocks} total={total} />
      <LineItem label="Bonds" amount={bonds} total={total} />
      <LineItem label="Cash" amount={cash} total={total} />
      <Subheading>Positions</Subheading>
      {positions.map(position => (
        <LineItem
          key={position.symbol}
          label={position.symbol}
          amount={position.currentMarketValue * postTaxAdjustment}
          total={total - cash}
        />
      ))}
    </div>
  );
};

export default Account;
