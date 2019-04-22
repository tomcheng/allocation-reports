import React, { useEffect } from "react";
import styled from "styled-components";
import flatMap from "lodash/flatMap";
import flatten from "lodash/flatten";
import omitBy from "lodash/omitBy";
import pickBy from "lodash/pickBy";
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

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const TAX_RATE = 20;

initializeAPI();

const Container = styled.div`
  padding: 20px 30px;
`;

const Options = styled.div`
  text-align: right;
`;

const Total = styled.h1`
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const App = () => {
  const [isPostTax, setIsPostTax] = useLocalStorage("__port-post-tax__", true);
  const [accounts, setAccounts] = useLocalStorage("__port-accounts__", null);
  const [balances, setBalances] = useLocalStorage("__port-balances__", {});
  const [positions, setPositions] = useLocalStorage("__port-positions__", {});
  const [symbols, setSymbols] = useLocalStorage("__port-symbols__", {});
  const [quotes, setQuotes] = useLocalStorage("__port-quotes__", {});

  useEffect(() => {
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
    };

    if (!accounts) {
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
      <Options>
        <label>
          <input type="checkbox" checked={isPostTax} onChange={togglePostTax} />{" "}
          Adjust for post tax amounts
        </label>
      </Options>
      <Total>{formatMoney(overallTotal)}</Total>
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
    </Container>
  );
};

export default App;
