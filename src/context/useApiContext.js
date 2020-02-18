import * as React from 'react';
import createUseContext from 'constate';
import debouncePromise from 'p-debounce';
import useAccountContext from './useAccountContext';

const AUTH_ERROR_STATUS_CODES = [401, 403, 422];

export default createUseContext(useApi);

/**
 * @returns {import('axios').AxiosInstance}
 */
function useApi({ axiosInstance: api }) {
  const refreshInterceptorRef = React.useRef(null);
  const {
    exist: accExist,
    accessToken,
    refreshToken,
    setAccessToken,
    removeTokens,
  } = useAccountContext();

  const refreshAccessToken = React.useCallback(
    debouncePromise(async () => {
      const res = await api.put('/tokens/refresh', { refresh_token: refreshToken });
      setAccessToken(res.data.accessToken);
    }, 500),
    [api, refreshToken, setAccessToken]
  );

  const handleResponseErrorWithRefreshing = React.useCallback(
    async err => {
      if (!isAuthErrorRelatedStatusCode(err.response.status)) {
        throw err;
      }

      const cleanAccAndThrow = () => {
        // Remove account after error handled in scope above
        setTimeout(() => removeTokens(), 0);
        throw err;
      };

      if (err.config.skipTokenRefresh) {
        cleanAccAndThrow();
      }

      try {
        // Refresh access token(by refreshToken)
        await refreshAccessToken();
        // Try to send the request again(after access token updated)
        return api({
          ...err.config,
          skipTokenRefresh: true,
        });
      } catch (_err) {
        cleanAccAndThrow();
      }
    },
    [api, removeTokens, refreshAccessToken]
  );

  if (api) {
    if (accExist) {
      api.defaults.headers.common['Auth-Token'] = accessToken;
    } else {
      delete api.defaults.headers.common['Auth-Token'];
    }

    if (refreshInterceptorRef.current) {
      api.interceptors.response.eject(refreshInterceptorRef.current);
    }

    refreshInterceptorRef.current = accExist
      ? api.interceptors.response.use(res => res, handleResponseErrorWithRefreshing)
      : null;
  }

  return api;
}

function isAuthErrorRelatedStatusCode(statusCode) {
  return AUTH_ERROR_STATUS_CODES.includes(statusCode);
}
