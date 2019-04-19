const ACCESS_TOKEN_STORAGE_KEY = "questrade_access_token";

export const getAuthorizationToken = () => {
  // check for hash route
  if (window.location.hash[1] === "/") {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (!search) {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  const hashObject = JSON.parse('{"' + search + '"}', (key, value) =>
    key === "" ? value : decodeURIComponent(value)
  );

  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, hashObject.access_token);
  // window.location.hash = "";

  return {
    accessToken: hashObject.access_token,
    apiServer: hashObject.api_server
  };
};
