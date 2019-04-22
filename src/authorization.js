export let accessToken = null;
export let apiServer = null;

export const initializeAPI = () => {
  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (!search) {
    return;
  }

  const hashObject = JSON.parse('{"' + search + '"}', (key, value) =>
    key === "" ? value : decodeURIComponent(value)
  );

  accessToken = hashObject.access_token;
  apiServer = hashObject.api_server;

  // window.location.hash = "";
};
