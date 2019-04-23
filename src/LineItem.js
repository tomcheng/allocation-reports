import React from "react";
import { Flex, SecondaryText } from "./styleComponents";
import { formatPercent } from "./utils";
import MoneyAmount from "./MoneyAmount";

const LineItem = ({ label, amount, total, isRedacted }) => (
  <Flex style={{ marginBottom: 3 }}>
    <div>
      <div>{label}</div>
    </div>
    <Flex style={{ alignItems: "baseline" }}>
      <MoneyAmount amount={amount} isRedacted={isRedacted} />
      <SecondaryText style={{ width: 50, textAlign: "right" }}>
        {formatPercent(amount / total)}
      </SecondaryText>
    </Flex>
  </Flex>
);

export default LineItem;
