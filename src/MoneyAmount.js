import React from "react";
import { formatMoney } from "./utils";

const MoneyAmount = ({ amount, isRedacted }) =>
  isRedacted ? (
    <div
      style={{
        display: "inline-block",
        backgroundColor: "#333",
        width: "4em",
        height: "0.8em"
      }}
    />
  ) : (
    <div>{formatMoney(amount)}</div>
  );

export default MoneyAmount;
