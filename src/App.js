import React, { useEffect } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import flatten from "lodash/flatten";
import map from "lodash/map";
import omitBy from "lodash/omitBy";
import pickBy from "lodash/pickBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import uniq from "lodash/uniq";
import { useLocalStorage } from "./hooks";
import { initializeAPI } from "./authorization";
import { getAccounts, getSymbols } from "./repository";
import { BREAKDOWNS } from "./constants";
import Account from "./Account";
import { Subheading } from "./styleComponents";
import { formatMoney } from "./utils";
import LineItem from "./LineItem";
import moment from "moment";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const AUTHORIZATION_URL = `https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`;
const TAX_RATE = 20;

initializeAPI();

const Container = styled.div`
  padding: 20px 30px;
`;

const Total = styled.h1`
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

const App = () => {
  const [isPostTax, setIsPostTax] = useLocalStorage("__port-post-tax__", true);
  const [lastUpdated, setLastUpdated] = useLocalStorage(
    "__port-last-updated__",
    null
  );
  const [accounts, setAccounts] = useLocalStorage("__port-accounts__", null);
  const [balances, setBalances] = useLocalStorage("__port-balances__", {});
  const [positions, setPositions] = useLocalStorage("__port-positions__", {});
  const [symbols, setSymbols] = useLocalStorage("__port-symbols__", {});
  const [quotes, setQuotes] = useLocalStorage("__port-quotes__", {});

  const fetchData = async () => {
    const { accounts, balances, positions } = await getAccounts();

    const symbolIDs = uniq(
      flatten(Object.values(positions)).map(position => position.symbolId)
    );

    const { symbols, quotes } = await getSymbols(symbolIDs);

    setSymbols(symbols);
    setQuotes(quotes);
    setPositions(positions);
    setBalances(balances);
    setAccounts(accounts);
    setLastUpdated(new Date().getTime());
  };

  useEffect(() => {
    if (!accounts) {
      fetchData();
    }
  }, []);

  const handleRefresh = async () => {
    try {
      setAccounts(null);
      await fetchData();
    } catch (e) {
      if (e.message.includes("401")) {
        window.location.href = AUTHORIZATION_URL;
      } else {
        console.log(e);
      }
    }
  };

  const togglePostTax = () => {
    setIsPostTax(!isPostTax);
  };

  const rrspAccountNumbers = (accounts || [])
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

  const combinedPositions = {};
  (accounts || []).forEach(account => {
    const multiplier =
      isPostTax && account.type === "RRSP" ? 1 - TAX_RATE / 100 : 1;
    positions[account.number].forEach(position => {
      combinedPositions[position.symbol] =
        (combinedPositions[position.symbol] || 0) +
        position.currentMarketValue * multiplier;
    });
  });
  const combinedPositionsArr = sortBy(
    map(combinedPositions, (value, symbol) => ({
      value,
      symbol
    })),
    "value"
  ).reverse();

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

  if (!accounts) {
    return <a href={AUTHORIZATION_URL}>Authorize</a>;
  }

  return (
    <Container>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <label>
          <input type="checkbox" checked={isPostTax} onChange={togglePostTax} />{" "}
          Post tax ({TAX_RATE}%)
        </label>
      </div>
      <Total>{formatMoney(overallTotal)}</Total>
      <Subheading>Positions</Subheading>
      {combinedPositionsArr.map(({ value, symbol }) => (
        <LineItem
          key={symbol}
          label={symbol}
          amount={value}
          total={overallTotal - (rrspCash + nonRrspCash)}
        />
      ))}
      <Subheading>Asset Classes</Subheading>
      <LineItem
        label="Stocks"
        amount={rrspStocks + nonRrspStocks}
        total={overallTotal}
      />
      <LineItem
        label="Bonds"
        amount={rrspBonds + nonRrspBonds}
        total={overallTotal}
      />
      <LineItem
        label="Cash"
        amount={rrspCash + nonRrspCash}
        total={overallTotal}
      />
      <Subheading>Accounts</Subheading>
      {accounts.map(account => (
        <LineItem
          key={account.number}
          label={account.type}
          amount={
            balances[account.number].totalEquity *
            (account.type === "RRSP" ? postTaxAdjustment : 1)
          }
          total={overallTotal}
        />
      ))}
      {accounts.map(account => (
        <Account
          key={account.number}
          account={account}
          balance={balances[account.number]}
          positions={positions[account.number]}
          postTaxAdjustment={account.type === "RRSP" ? postTaxAdjustment : 1}
          symbols={symbols}
          quotes={quotes}
        />
      ))}
      <div style={{ marginTop: 40, textAlign: "center" }}>
        {lastUpdated && (
          <span>Last updated {moment(lastUpdated).fromNow()}</span>
        )}{" "}
        <button type="button" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
    </Container>
  );
};

export default App;
