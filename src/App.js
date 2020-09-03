import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import {
  company,
  oauthUrl,
  oauthRedirectUri,
  apiBaseUrl
} from './data';
import { serializeQueryString, getSsoUser } from './utils';

const { appId, appSecret } = company.backend;
const loginOIption = company.loginOptions.find(lo => lo.type === 'employeeSSO');

const getHref = () => {
  const queryStr = serializeQueryString({
    response_type: 'code',
    redirect_uri: oauthRedirectUri,
    client_id: `${appId}.${loginOIption.micId}`,
    scope: ['openid', 'profile', 'email'].join(' '),
  });

  return `${oauthUrl}/auth?${queryStr}`;
};

function App() {
  const [user, setUser] = useState({});
  const href = getHref();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const ssoLogin = async () => {
      const userData = await getSsoUser({
        appId,
        appSecret,
        oauthUrl,
        micId: loginOIption.micId,
        redirectUri: oauthRedirectUri,
        code,
        apiBaseUrl
      });

      setUser(userData);
    };

    if (code) {
      ssoLogin();
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>SSO Login Test</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Button href={href}>Login SSO</Button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>User</h2>
            {JSON.stringify(user)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
