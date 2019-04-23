import React from "react";
import styled from "styled-components";
import sumBy from "lodash/sumBy";
import AnimateHeight from "react-animate-height-auto";
import { BREAKDOWNS } from "./constants";
import { Subheading } from "./styleComponents";
import LineItem from "./LineItem";
import { useLocalStorage } from "./hooks";
import MoneyAmount from "./MoneyAmount";

const Heading = styled.h2`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  border-bottom: 2px solid #333;
  font-size: 18px;
  line-height: 24px;
  padding-bottom: 5px;
  margin-bottom: 0;
`;

const Account = ({
  account,
  balance,
  positions,
  postTaxAdjustment,
  isRedacted
}) => {
  const [isExpanded, setIsExpanded] = useLocalStorage(
    `__port-is-expanded-${account.number}__`,
    true
  );
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
      <Heading
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <span>{account.type}</span>
        <MoneyAmount amount={total} isRedacted={isRedacted} />
      </Heading>
      <AnimateHeight isExpanded={isExpanded}>
        <Subheading>Positions</Subheading>
        {positions.map(position => (
          <LineItem
            key={position.symbol}
            label={position.symbol}
            amount={position.currentMarketValue * postTaxAdjustment}
            total={total - cash}
            isRedacted={isRedacted}
          />
        ))}
        <Subheading>Asset Classes</Subheading>
        <LineItem
          label="Stocks"
          amount={stocks}
          total={total}
          isRedacted={isRedacted}
        />
        <LineItem
          label="Bonds"
          amount={bonds}
          total={total}
          isRedacted={isRedacted}
        />
        <LineItem
          label="Cash"
          amount={cash}
          total={total}
          isRedacted={isRedacted}
        />
      </AnimateHeight>
    </div>
  );
};

export default Account;
