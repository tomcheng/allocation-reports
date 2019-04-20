import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import sumBy from "lodash/sumBy";
import { getAuthorizationToken } from "./authorization";
import { getAccounts } from "./repository";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const { accessToken, apiServer } = getAuthorizationToken();

const BREAKDOWNS = {
  "VEQT.TO": {
    stocks: 1,
    bonds: 0
  },
  "VBAL.TO": {
    stocks: 0.6,
    bonds: 0.4
  },
  "VGRO.TO": {
    stocks: 0.8,
    bonds: 0.2
  }
};

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
      <a
        href={`https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`}
      >
        Authorize
      </a>
      {isLoaded &&
        accounts.map(account => {
          const stocks = sumBy(
            positions[account.number],
            position =>
              position.currentMarketValue * BREAKDOWNS[position.symbol].stocks
          );
          const bonds = sumBy(
            positions[account.number],
            position =>
              position.currentMarketValue * BREAKDOWNS[position.symbol].bonds
          );
          const cash = balances[account.number].cash;
          const total = stocks + bonds + cash;
          return (
            <div key={account.number}>
              <div>{account.type}</div>
              {positions[account.number].map(position => (
                <div key={position.symbol}>
                  {position.symbol} {position.currentMarketValue}
                </div>
              ))}
              <div>Cash: {cash}</div>
              <div>Breakdown</div>
              <div>Stocks: {((stocks / total) * 100).toFixed(1)}%</div>
              <div>Bonds: {((bonds / total) * 100).toFixed(1)}%</div>
              <div>Cash: {((cash / total) * 100).toFixed(1)}%</div>
            </div>
          );
        })}
      {isLoaded && (
        <Fragment>
          <div>Overall Breakdown</div>
          <div>
            Stocks: {((overallStocks / overallTotal) * 100).toFixed(1)}%
          </div>
          <div>Bonds: {((overallBonds / overallTotal) * 100).toFixed(1)}%</div>
          <div>Cash: {((overallCash / overallTotal) * 100).toFixed(1)}%</div>
        </Fragment>
      )}
      <div>v 0.0.4</div>
    </Container>
  );
};

export default App;
