import * as React from 'react';
import createUseContext from 'constate';

export default createUseContext(useAccount);

function useAccount() {
  const [{ initialized, accessToken, refreshToken }, setState] = React.useState(() => ({
    initialized: false,
    accessToken: null,
    refreshToken: null,
  }));
  const exist = [initialized, accessToken, refreshToken].every(Boolean);

  // for every unique account - unique refreshToken
  const id = refreshToken;

  React.useEffect(() => {
    setState({
      initialized: true,
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    });
  }, []);

  React.useEffect(() => {
    if (!initialized) return;

    if (accessToken !== localStorage.getItem('accessToken')) {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    }

    if (refreshToken !== localStorage.getItem('refreshToken')) {
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    }
  }, [initialized, accessToken, refreshToken]);

  const setAccessToken = React.useCallback(
    accessToken => {
      setState(state => ({ ...state, accessToken }));
    },
    [setState]
  );

  const setTokens = React.useCallback(
    (accessToken, refreshToken) => {
      setState(state => ({ ...state, accessToken, refreshToken }));
    },
    [setState]
  );

  const removeTokens = React.useCallback(() => {
    setTokens(null, null);
  }, [setTokens]);

  return {
    initialized,
    accessToken,
    refreshToken,
    exist,
    id,
    setAccessToken,
    setTokens,
    removeTokens,
  };
}
