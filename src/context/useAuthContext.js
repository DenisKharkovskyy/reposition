import * as React from 'react';
import createUseContext from 'constate';
import useAccountContext from './useAccountContext';
import useApiContext from './useApiContext';

export default createUseContext(useAuth);

function useAuth() {
  const [{ initialized, loading, loadError, profile }, setState] = React.useState(() => ({
    initialized: false,
    loading: false,
    loadError: null,
    profile: null,
  }));
  const profileRef = React.useRef(null);
  const {
    initialized: accInitialized,
    exist: accExist,
    setTokens,
    removeTokens,
  } = useAccountContext();
  const api = useApiContext();

  const authorized = Boolean(profile);

  React.useEffect(() => {
    if (profile && profileRef.current) {
      profileRef.current = null;
    }
  }, [profile]);

  const init = React.useCallback(async () => {
    if (accExist) {
      if (profileRef.current) {
        const profile = profileRef.current;
        setState(state => ({
          ...state,
          initialized: true,
          loading: false,
          loadError: null,
          profile,
        }));

        return;
      }

      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));

      let res;
      try {
        res = await api.get('users/profile');
      } catch (err) {
        setState(state => ({
          ...state,
          loading: false,
          loadError: err,
          profile: null,
        }));
        return;
      }

      const profile = res.data.data;
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        profile,
      }));
    } else {
      setState(state => ({
        ...state,
        initialized: true,
        profile: null,
        loadError: null,
      }));
    }
  }, [api, accExist]);

  React.useEffect(() => {
    if (accInitialized) {
      init();
    }
  }, [accInitialized, init]);

  const login = React.useCallback(
    async loginData => {
      const res = await api.post('/users/sign_in', {
        data: {
          email: loginData.email,
          password: loginData.password,
        },
      });
      const { access_token: accessToken, refresh_token: refreshToken, ...profile } = res.data.data;

      profileRef.current = profile;
      setTokens(accessToken, refreshToken);
    },
    [setTokens, api]
  );

  const logout = removeTokens;

  return React.useMemo(
    () => ({
      initialized,
      loading,
      loadError,
      profile,
      authorized,
      login,
      logout,
    }),
    [initialized, loading, loadError, profile, authorized, login, logout]
  );
}
