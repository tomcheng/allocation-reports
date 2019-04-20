import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import sumBy from "lodash/sumBy";
import { getAuthorizationToken } from "./authorization";
import { getAccounts } from "./repository";
import { BREAKDOWNS } from "./constants";
import Account from "./Account";
import { Flex, Subheading } from "./styleComponents";
import { formatMoney, formatPercent } from "./utils";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const { accessToken, apiServer } = getAuthorizationToken() || {};

const Container = styled.div`
  padding: 20px 30px;
`;

const Heading = styled.h1`
  margin-top: 0;
`;

const App = () => {
  const [accounts, setAccounts] = useState(null);
  const [balances, setBalances] = useState({});
  const [positions, setPositions] = useState({});

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

    fetchData();
  }, []);

  const isLoaded = !!accounts;

  const overallStocks = sumBy(
    flatMap(Object.values(positions)),
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
  );
  const overallBonds = sumBy(
    flatMap(Object.values(positions)),
    position => position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
  );
  const overallCash = sumBy(Object.values(balances), "cash");
  const overallTotal = overallStocks + overallBonds + overallCash;

  return (
    <Container>
      {isLoaded ? (
        <Fragment>
          <Heading>Overall</Heading>
          <Subheading>Accounts</Subheading>
          {accounts.map(account => (
            <Flex key={account.number}>
              <span>{account.type}</span>
              <span>{formatMoney(balances[account.number].totalEquity)}</span>
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
          <Subheading>Asset Classes</Subheading>
          <Flex>
            <span>Stocks</span>
            <span>{formatPercent(overallStocks / overallTotal)}</span>
          </Flex>
          <Flex>
            <span>Bonds</span>
            <span>{formatPercent(overallBonds / overallTotal)}</span>
          </Flex>
          <Flex>
            <span>Cash</span>
            <span>{formatPercent(overallCash / overallTotal)}</span>
          </Flex>
          {accounts.map(account => (
            <Account
              key={account.number}
              account={account}
              balance={balances[account.number]}
              positions={positions[account.number]}
            />
          ))}
        </Fragment>
      ) : (
        <a
          href={`https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`}
        >
          Authorize
        </a>
      )}
    </Container>
  );
};

export default App;
