import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import Layout from '../components/Layout';
import useApiContext from 'context/useApiContext';
import SearchAlertsList from 'components/SearchAlertsList';

const useStyles = makeStyles({
  content: {
    width: '100%',
    maxWidth: 1120,
    paddingTop: 32,
    margin: 'auto',
    minHeight: 'calc(100vh - 112px)',
    position: 'relative',
  },
  filtersBlock: {
    display: 'flex',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    color: '#006960',
    width: 210,
    position: 'absolute',
    right: 0,
    top: '100px',
  },
  greenIconButton: {
    backgroundColor: 'rgba(3, 184, 168, 0.06)',
  },
});

const SearchAlerts = () => {
  const classes = useStyles();

  const api = useApiContext();

  const [{ searchAlerts, alertAvailableOffersList, snackBarOpen }, setState] = React.useState(
    () => ({
      searchAlerts: null,
      loading: false,
      loadError: null,
      alertAvailableOffersList: null,
      snackBarOpen: false,
    })
  );

  const getMySearchAlerts = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      loading: true,
    }));

    try {
      const searchAlerts = await api.get('/search_alerts/');
      await setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        searchAlerts: searchAlerts.data.data,
      }));

      getNewOffersForAlerts();
    } catch (err) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: err,
      }));
      return;
    }
    // eslint-disable-next-line
  }, [api]);

  const getNewOffersForAlerts = React.useCallback(() => {
    searchAlerts.map(async offer => {
      try {
        const response = await api.get(`/search_alerts/${offer.id}/offers`);
        await setState(state => ({
          ...state,
          alertAvailableOffersList: {
            ...state.alertAvailableOffersList,
            [offer.id]: response.data.data,
          },
        }));
      } catch (error) {
        console.error('Something went wrong', error);
      }
      setState(state => ({
        ...state,
        alertAvailableOffersList: { ...state.alertAvailableOffersList, id: null },
      }));
    });
    // eslint-disable-next-line
  }, [searchAlerts]);

  const deleteAlert = React.useCallback(async id => {
    try {
      await api.delete(`/search_alerts/${id}`);
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
      }));
    } catch (error) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: error,
      }));
    }
    getMySearchAlerts();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    getMySearchAlerts();
  }, [getMySearchAlerts]);

  React.useEffect(() => {
    if (searchAlerts && !!searchAlerts.length) {
      getNewOffersForAlerts();
    }
  }, [getNewOffersForAlerts, searchAlerts]);

  function handleOpenDeleteSnackBar() {
    setState(state => ({
      ...state,
      snackBarOpen: true,
    }));
  }

  function handleCloseDeleteSnackBar() {
    setState(state => ({ ...state, snackBarOpen: false }));
  }

  function handleDeleteAlert(id) {
    deleteAlert(id);
    handleOpenDeleteSnackBar();
  }

  return (
    <Layout>
      <main className={classes.content}>
        <Typography style={{ marginBottom: 32, fontWeight: 600 }} variant="h4">
          My Search Alerts
        </Typography>
        {searchAlerts && (
          <SearchAlertsList
            searchAlerts={searchAlerts}
            alertAvailableOffersList={alertAvailableOffersList}
            handleDeleteAlert={handleDeleteAlert}
          />
        )}
        <Snackbar
          open={snackBarOpen}
          onClose={handleCloseDeleteSnackBar}
          message={<span id="message-id">Search Alert deleted successfully</span>}
        />
      </main>
    </Layout>
  );
};

export default SearchAlerts;
