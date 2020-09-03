import axios from 'axios';

export const serializeQueryString = (obj) => {
    const strArray = [];

    for (const [key, value] of Object.entries(obj)) {
        strArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }

    return strArray.join('&');
};

export const getSsoUser = async ({
    appId,
    appSecret,
    oauthUrl,
    micId,
    redirectUri,
    code,
    apiBaseUrl
}) => {
  const authorization = `Basic ${btoa(`${appId}.${micId}:${appSecret}`)}`;
  const tokenRequestconfig = {
    url: `${oauthUrl}/token`,
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: serializeQueryString({
      client_id: appId,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }),
  };
  const token = await axios(tokenRequestconfig);
  const userRequestconfig = {
    url: `${apiBaseUrl}/user/${appId}/login`,
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${appId}:${appSecret}`)}`,
      'Content-Type': 'application/json',
    },
    body: {
      _socialIdentity: {
        kinveyAuth: {
          access_token: token.data.access_token,
        },
      },
    },
  };
  const user = await axios(userRequestconfig);

  return user.data;
};
