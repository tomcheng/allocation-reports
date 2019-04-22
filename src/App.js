import React, { useEffect, useState } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import omitBy from "lodash/omitBy";
import pickBy from "lodash/pickBy";
import sumBy from "lodash/sumBy";
import { useLocalStorage } from "./hooks";
import { getAuthorizationToken } from "./authorization";
import { getAccounts } from "./repository";
import { BREAKDOWNS } from "./constants";
import Account from "./Account";
import { Flex, Subheading } from "./styleComponents";
import { formatMoney, formatPercent } from "./utils";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const TAX_RATE = 20;

const { accessToken, apiServer } = getAuthorizationToken() || {};

const Container = styled.div`
  padding: 20px 30px;
`;

const Heading = styled.h1`
  margin-top: 0;
`;

const App = () => {
  const [accounts, setAccounts] = useLocalStorage("__port-accounts__", null);
  const [balances, setBalances] = useLocalStorage("__port-balances__", {});
  const [positions, setPositions] = useLocalStorage("__port-positions__", {});
  const [isPostTax, setIsPostTax] = useLocalStorage("__port-post-tax__", true);

  useEffect(() => {
    const fetchData = async () => {
      const { accounts, balances, positions } = await getAccounts({
        accessToken,
        apiServer
      });

      setPositions(positions);
      setBalances(balances);
      setAccounts(accounts);
    };

    if (!accounts && accessToken) {
      fetchData();
    }
  }, []);

  if (!accounts) {
    return (
      <a
        href={`https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`}
      >
        Authorize
      </a>
    );
  }

  const togglePostTax = () => {
    setIsPostTax(!isPostTax);
  };

  const rrspAccountNumbers = accounts
    .filter(account => account.type === "RRSP")
    .map(account => account.number);
  const rrspPositions = flatMap(
    Object.values(pickBy(positions, (v, k) => rrspAccountNumbers.includes(k)))
  );
  const nonRrspPositions = flatMap(
    Object.values(omitBy(positions, (v, k) => rrspAccountNumbers.includes(k)))
  );
  const rrspBalances = Object.values(
    pickBy(balances, (v, k) => rrspAccountNumbers.includes(k))
  );
  const nonRrspBalances = Object.values(
    omitBy(balances, (v, k) => rrspAccountNumbers.includes(k))
  );

  const postTaxAdjustment = isPostTax ? 1 - TAX_RATE / 100 : 1;

  const rrspStocks =
    sumBy(
      rrspPositions,
      position =>
        position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
    ) * postTaxAdjustment;
  const nonRrspStocks = sumBy(
    nonRrspPositions,
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
  );
  const rrspBonds =
    sumBy(
      rrspPositions,
      position =>
        position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
    ) * postTaxAdjustment;
  const nonRrspBonds = sumBy(
    nonRrspPositions,
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
  );
  const rrspCash = sumBy(rrspBalances, "cash") * postTaxAdjustment;
  const nonRrspCash = sumBy(nonRrspBalances, "cash");
  const overallTotal =
    rrspStocks +
    nonRrspStocks +
    rrspBonds +
    nonRrspBonds +
    rrspCash +
    nonRrspCash;

  return (
    <Container>
      <Heading>Portfolio Allocations</Heading>
      <label>
        <input type="checkbox" checked={isPostTax} onChange={togglePostTax} />{" "}
        Adjust for post tax amounts
      </label>
      <Subheading>Asset Classes</Subheading>
      <Flex>
        <span>Stocks</span>
        <span>
          {formatPercent((rrspStocks + nonRrspStocks) / overallTotal)}
        </span>
      </Flex>
      <Flex>
        <span>Bonds</span>
        <span>{formatPercent((rrspBonds + nonRrspBonds) / overallTotal)}</span>
      </Flex>
      <Flex>
        <span>Cash</span>
        <span>{formatPercent((rrspCash + nonRrspCash) / overallTotal)}</span>
      </Flex>
      <Subheading>Accounts</Subheading>
      {accounts.map(account => (
        <Flex key={account.number}>
          <span>{account.type}</span>
          <span>
            {formatMoney(
              balances[account.number].totalEquity *
                (account.type === "RRSP" ? postTaxAdjustment : 1)
            )}
          </span>
        </Flex>
      ))}
      <Flex style={{ justifyContent: "flex-end" }}>
        <span
          style={{
            borderTop: "1px solid #666",
            marginTop: 2,
            paddingTop: 2
          }}
        >
          {formatMoney(overallTotal)}
        </span>
      </Flex>
      {accounts.map(account => (
        <Account
          key={account.number}
          account={account}
          balance={balances[account.number]}
          positions={positions[account.number]}
          postTaxAdjustment={account.type === "RRSP" ? postTaxAdjustment : 1}
        />
      ))}
    </Container>
  );
};

export default App;
