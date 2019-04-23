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
import LineItem from "./LineItem";
import moment from "moment";
import MoneyAmount from "./MoneyAmount";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const AUTHORIZATION_URL = `https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`;
const TAX_RATE = 20;

initializeAPI();

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  padding: 30px 30px 20px;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
`;

const Total = styled.h1`
  margin-top: 0;
  margin-bottom: 30px;
  text-align: center;
`;

const StyledButton = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  font-size: inherit;
  line-height: inherit;
  text-decoration: underline;
  background-color: transparent;
`;

const Footer = styled.div`
  text-align: center;
  padding: 15px 0;
  border-top: 1px solid #ccc;
`;

const FooterLabel = styled.label`
  margin: 0 10px;
`;

const App = () => {
  const [isPostTax, setIsPostTax] = useLocalStorage("__port-post-tax__", true);
  const [isRedacted, setIsRedacted] = useLocalStorage(
    "__port-redacted__",
    false
  );
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

  const toggleRedacted = () => {
    setIsRedacted(!isRedacted);
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
      <Body>
        <Total>
          <MoneyAmount amount={overallTotal} isRedacted={isRedacted} />
        </Total>
        <Subheading>Positions</Subheading>
        {combinedPositionsArr.map(({ value, symbol }) => (
          <LineItem
            key={symbol}
            label={symbol}
            amount={value}
            total={overallTotal - (rrspCash + nonRrspCash)}
            isRedacted={isRedacted}
          />
        ))}
        <Subheading>Asset Classes</Subheading>
        <LineItem
          label="Stocks"
          amount={rrspStocks + nonRrspStocks}
          total={overallTotal}
          isRedacted={isRedacted}
        />
        <LineItem
          label="Bonds"
          amount={rrspBonds + nonRrspBonds}
          total={overallTotal}
          isRedacted={isRedacted}
        />
        <LineItem
          label="Cash"
          amount={rrspCash + nonRrspCash}
          total={overallTotal}
          isRedacted={isRedacted}
        />
        {accounts.map(account => (
          <Account
            key={account.number}
            account={account}
            balance={balances[account.number]}
            positions={positions[account.number]}
            postTaxAdjustment={account.type === "RRSP" ? postTaxAdjustment : 1}
            symbols={symbols}
            quotes={quotes}
            isRedacted={isRedacted}
          />
        ))}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          {lastUpdated && <span>Updated {moment(lastUpdated).fromNow()}.</span>}{" "}
          <StyledButton type="button" onClick={handleRefresh}>
            Refresh
          </StyledButton>
        </div>
      </Body>
      <Footer>
        <FooterLabel>
          <input type="checkbox" checked={isPostTax} onChange={togglePostTax} />{" "}
          Post tax ({TAX_RATE}%)
        </FooterLabel>
        <FooterLabel>
          <input
            type="checkbox"
            checked={isRedacted}
            onChange={toggleRedacted}
          />{" "}
          Redacted
        </FooterLabel>
      </Footer>
    </Container>
  );
};

export default App;
