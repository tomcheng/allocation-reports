const TOKEN_KEY = "__port-token__";
const API_SERVER_KEY = "__port-api-server__";

export let accessToken = null;
export let apiServer = null;

export const initializeAPI = () => {
  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (!search) {
    accessToken = localStorage.getItem(TOKEN_KEY);
    apiServer = localStorage.getItem(API_SERVER_KEY);
    return;
  }

  const hashObject = JSON.parse('{"' + search + '"}', (key, value) =>
    key === "" ? value : decodeURIComponent(value)
  );

  accessToken = hashObject.access_token;
  apiServer = hashObject.api_server;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(API_SERVER_KEY, apiServer);

  window.location.hash = "";
};
