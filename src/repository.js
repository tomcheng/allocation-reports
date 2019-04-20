import axios from "axios";
import find from "lodash/find";

export const getAccounts = async ({ accessToken, apiServer }) => {
  const getResource = resource =>
    axios.get(
      `https://cors-anywhere.herokuapp.com/${apiServer}v1/${resource}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Access-Control-Allow-Origin": "*"
        }
      }
    );

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
      positions[account.number] = positionsResp.data.positions;
    })
  );

  return { accounts, balances, positions };
};
