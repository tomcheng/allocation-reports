import React, { useEffect } from "react";
import axios from "axios";
import { getAuthorizationToken } from "./authorization";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

const { accessToken, apiServer } = getAuthorizationToken();

const App = () => {
  useEffect(() => {
    console.log("make api call here.");
    axios.get(`${apiServer}v1/accounts`, {
      headers: { Host: apiServer, Authorization: `Bearer ${accessToken}` }
    });
  }, []);
  return (
    <div>
      <a
        href={`https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`}
      >
        Authorize
      </a>
    </div>
  );
};

export default App;
