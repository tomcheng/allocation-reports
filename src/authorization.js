export const getAuthorizationToken = () => {
  const search = window.location.hash
    .substring(1)
    .replace(/&/g, '","')
    .replace(/=/g, '":"');

  if (!search) {
    return { accessToken: null, apiServer: null };
  }

  const hashObject = JSON.parse('{"' + search + '"}', (key, value) =>
    key === "" ? value : decodeURIComponent(value)
  );

  window.location.hash = "";

  return {
    accessToken: hashObject.access_token,
    apiServer: hashObject.api_server
  };
};
