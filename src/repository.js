import axios from "axios";
import find from "lodash/find";
import sortBy from "lodash/sortBy";
import { accessToken, apiServer } from "./authorization";

const getResource = resource =>
  axios.get(`https://cors-anywhere.herokuapp.com/${apiServer}v1/${resource}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Access-Control-Allow-Origin": "*"
    }
  });

export const getAccounts = async () => {
  const accountsResp = await getResource("accounts");
  const accounts = accountsResp.data.accounts;

  const positions = {};
  const balances = {};

  await Promise.all(
    accounts.map(async account => {
      const [positionsResp, balancesResp] = await Promise.all([
        getResource(`accounts/${account.number}/positions`),
        getResource(`accounts/${account.number}/balances`)
      ]);

      balances[account.number] = find(balancesResp.data.combinedBalances, {
        currency: "CAD"
      });
      positions[account.number] = sortBy(
        positionsResp.data.positions,
        position => -position.currentMarketValue
      );
    })
  );

  return {
    accounts: sortBy(
      accounts,
      account => -balances[account.number].totalEquity
    ),
    balances,
    positions
  };
};

export const getSymbols = async symbolIDs => {
  const symbols = {};
  const quotes = {};

  const [symbolsResp, quotesResp] = await Promise.all([
    getResource(`symbols?ids=${symbolIDs.join(",")}`),
    getResource(`markets/quotes?ids=${symbolIDs.join(",")}`)
  ]);

  symbolIDs.forEach(id => {
    symbols[id] = find(symbolsResp.data.symbols, { symbolId: id });
    quotes[id] = find(quotesResp.data.quotes, { symbolId: id });
  });

  return { symbols, quotes };
};
