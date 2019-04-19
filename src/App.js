import React, { Component } from "react";

const CLIENT_ID = "YCUSnajluQMAHR32DnJhupUYJddjZQ";
const REDIRECT_URI = "https://tomcheng.github.io/allocation-reports";

class App extends Component {
  render() {
    return (
      <div>
        <a
          href={`https://login.questrade.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`}
        >
          Authorize
        </a>
      </div>
    );
  }
}

export default App;
