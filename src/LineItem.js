import React from "react";
import { Flex, SecondaryText } from "./styleComponents";
import { formatMoney, formatPercent } from "./utils";

const LineItem = ({ label, amount, total }) => (
  <Flex style={{ marginBottom: 3 }}>
    <div>
      <div>{label}</div>
    </div>
    <Flex style={{ alignItems: "baseline" }}>
      <div>{formatMoney(amount)}</div>
      <SecondaryText style={{ width: 50, textAlign: "right" }}>
        {formatPercent(amount / total)}
      </SecondaryText>
    </Flex>
  </Flex>
);

export default LineItem;
