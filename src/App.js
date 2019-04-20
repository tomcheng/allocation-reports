import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import sumBy from "lodash/sumBy";
import { getAuthorizationToken } from "./authorization";
import { getAccounts } from "./repository";
import { BREAKDOWNS } from "./constants";
import Account from "./Account";
import { formatMoney, formatPercent } from "./utils";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const { accessToken, apiServer } = getAuthorizationToken();

const Container = styled.div`
  padding: 20px 30px;
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
          <div>Overall Breakdown</div>
          <div>Total: {formatMoney(overallTotal)}</div>
          <div>Stocks: {formatPercent(overallStocks / overallTotal)}</div>
          <div>Bonds: {formatPercent(overallBonds / overallTotal)}</div>
          <div>Cash: {formatPercent(overallCash / overallTotal)}</div>
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
      <div>v 0.0.4</div>
    </Container>
  );
};

export default App;
