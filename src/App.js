import React from 'react';
import { Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';

import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';

import useAccountContext from 'context/useAccountContext';
import useApiContext from 'context/useApiContext';
import useAuthContext from 'context/useAuthContext';

import LandingPage from './pages/LandingPage';
import SearchOffers from './pages/SearchOffers';
import MyOffers from 'pages/MyOffers';
import CreateOffer from 'pages/CreateOffer';
import SearchAlerts from 'pages/SearchAlerts';
import EditOffer from 'pages/EditOffer';
import Profile from 'pages/Profile';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.reposition.it/api/v1/';

function RestrictedRoute(props) {
  const auth = useAuthContext();

  // if (!auth.initialized) {
  //   return null;
  // }

  // if (auth.loading) {
  //   return <div>Loading...</div>;
  // }

  // if (auth.initError instanceof Error) {
  //   return <div>Error: {auth.initError.message}</div>;
  // }

  return props.switchRoute({ auth, props });
}

const SwitchRoute = withRouter(({ auth, routeComponent, ...props }) => {
  if (!auth.authorized) {
    props.location.pathname !== '/' && props.history.push('/');
    return <Route {...props} component={LandingPage} />;
  }

  if (props.location.pathname === '/') {
    props.history.push(auth.profile.role === 'capacity' ? '/my-offers' : '/browse-offers');
  }

  if (auth.profile.role === 'equipment') {
    return <Route {...props} component={routeComponent} />;
  }
  if (auth.profile.role === 'capacity') {
    return <Route {...props} component={routeComponent} />;
  }
});

const Router = () => (
  <Switch>
    <RestrictedRoute
      path="/create-offer"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: CreateOffer, ...props })}
    />
    <RestrictedRoute
      path="/my-offers"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: MyOffers, ...props })}
    />
    <RestrictedRoute
      path="/browse-offers"
      switchRoute={props => SwitchRoute({ routeComponent: SearchOffers, ...props })}
    />
    <RestrictedRoute
      path="/search-alerts"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: SearchAlerts, ...props })}
    />
    <RestrictedRoute
      path="/edit-offer"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: EditOffer, ...props })}
    />
    <RestrictedRoute
      path="/profile"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: Profile, ...props })}
    />
    <RestrictedRoute
      path="/"
      exact
      switchRoute={props => SwitchRoute({ routeComponent: null, ...props })}
    />
  </Switch>
);

function App() {
  const api = axios.create({ baseURL: API_BASE_URL });

  const theme = createMuiTheme({
    palette: {
      primary: { main: teal[800] },
      secondary: { main: teal[300] },
    },
    overrides: {
      MuiIconButton: {
        label: { flexDirection: 'column' },
      },
      PrivateNotchedOutline: {
        root: {
          borderWidth: 2,
        },
      },
      MuiOutlinedInput: {
        root: {
          '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
            borderColor: teal[800],
          },
        },
      },
      MuiButton: {
        containedSecondary: {
          backgroundColor: '#00d1be',
          color: '#fff',
        },
        contained: {
          color: '#009688',
          backgroundColor: '#ffffff',
          boxShadow:
            '0px 1px 2px 0px #009688, 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);',
        },
      },
    },
    typography: {
      fontFamily: ['Rubik', 'sans-serif'].join(','),
    },
  });

  return (
    <useAccountContext.Provider>
      <useApiContext.Provider axiosInstance={api}>
        <useAuthContext.Provider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </useAuthContext.Provider>
      </useApiContext.Provider>
    </useAccountContext.Provider>
  );
}

export default App;
