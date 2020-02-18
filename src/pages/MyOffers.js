import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import queryString from 'query-string';
import isFuture from 'date-fns/isFuture';
import parseISO from 'date-fns/parseISO';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

import ImportExportIcon from '@material-ui/icons/ImportExport';
import handHelloIcon from '../assets/img/hand_hello.svg';
import Layout from '../components/Layout';
import useApiContext from 'context/useApiContext';
import OfferCardsList from 'components/OfferCardsList';
import {
  PREVIOUS_OFFERS,
  OFFERS_CREATED,
  EXPIRED_OFFERS,
  DELETED_OFFERS,
} from 'constants/offerSubtitle';

const useStyles = makeStyles({
  content: {
    width: '100%',
    maxWidth: 1045,
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
    position: 'absolute',
    right: 0,
    top: '100px',
  },
  greenIconButton: {
    color: '#006960',
    background: 'rgba(3, 184, 168, 0.06)',
    width: 28,
    height: 28,
    borderRadius: '50%',
  },
  buttonBox: {
    width: 130,
    height: 40,
    textTransform: 'none',
  },
  handHelloIcon: {
    color: '#03b8a8',
    width: 65,
    height: 65,
    backgroundImage: `url('${handHelloIcon}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  subtitleEmpty: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 500,
    margin: '20px 0',
  },
});

const MyOffers = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const api = useApiContext();

  const [
    { offers, newOffer, restOffers, filteredOffers, loading, offersTitle, offersSubtitle },
    setState,
  ] = React.useState(() => ({
    offers: null,
    loading: false,
    loadError: null,
    newOfferId: null,
    newOffer: [],
    restOffers: [],
    filteredOffers: [],
    offersTitle: '',
    offersSubtitle: null,
  }));

  function handleOpenFilterMenu(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  function handleCloseFilterMenu(event) {
    setAnchorEl(null);
  }

  const getMyOffers = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      loading: true,
    }));

    try {
      const offers = await api.get('offers/my/');
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        offers: offers.data.data,
      }));
    } catch (err) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: err,
      }));
      return;
    }
  }, [api]);

  React.useEffect(() => {
    getMyOffers();
  }, [getMyOffers]);

  React.useEffect(() => {
    offers &&
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        newOfferId: queryString.parse(props.location.search).id,
        newOffer: offers.filter(
          offer => offer.id === Number(queryString.parse(props.location.search).id)
        ),
        restOffers: offers.filter(
          offer => offer.id !== Number(queryString.parse(props.location.search).id)
        ),
        filteredOffers: offers
          .filter(offer => offer.id !== Number(queryString.parse(props.location.search).id))
          .filter(offer => !offer.deleted_at)
          .filter(offer => isFuture(parseISO(offer.expiry_offer_at))),
        offersTitle: 'My offers',
        offersSubtitle: queryString.parse(props.location.search).id
          ? PREVIOUS_OFFERS
          : OFFERS_CREATED,
      }));
    // eslint-disable-next-line
  }, [offers, props.location]);

  const handleFilterByMyOffers = () => {
    props.location.search !== '' && props.history.push('/my-offers');
    setState(state => ({
      ...state,
      filteredOffers: restOffers
        .filter(offer => !offer.deleted_at)
        .filter(offer => isFuture(parseISO(offer.expiry_offer_at))),
      offersTitle: 'My offers',
      offersSubtitle: OFFERS_CREATED,
    }));
    handleCloseFilterMenu();
  };
  const handleFilterByMyTeamOffers = () => {
    // TODO: waiting when api and task be done
    props.location.search !== '' && props.history.push('/my-offers');
    setState(state => ({
      ...state,
      filteredOffers: restOffers.filter(
        offer => !offer.deleted_at || isFuture(parseISO(offer.expiry_offer_at))
      ),
      offersTitle: 'My team offers',
      offersSubtitle: OFFERS_CREATED,
    }));
    handleCloseFilterMenu();
  };

  const handleFilterByExpired = () => {
    props.location.search !== '' && props.history.push('/my-offers');
    setState(state => ({
      ...state,
      filteredOffers: restOffers
        .filter(offer => !isFuture(parseISO(offer.expiry_offer_at)))
        .filter(offer => !offer.deleted_at),
      offersTitle: 'My expired offers',
      offersSubtitle: EXPIRED_OFFERS,
    }));
    handleCloseFilterMenu();
  };

  const handleFilterByDeleted = () => {
    props.location.search !== '' && props.history.push('/my-offers');
    setState(state => ({
      ...state,
      filteredOffers: restOffers
        .filter(offer => offer.deleted_at)
        .filter(offer => isFuture(parseISO(offer.expiry_offer_at))),

      offersTitle: 'My deleted offers',
      offersSubtitle: DELETED_OFFERS,
    }));
    handleCloseFilterMenu();
  };

  const openFilterMenu = Boolean(anchorEl);

  return (
    <Layout>
      <main className={classes.content}>
        <Typography style={{ marginBottom: 32, fontWeight: 600 }} variant="h4">
          {offersTitle}
        </Typography>
        {loading ? (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <CircularProgress style={{ margin: 'auto' }} />
          </div>
        ) : (
          <>
            {(!!newOffer.length || !!restOffers.length) && (
              <div className={classes.filtersBlock}>
                <Button classes={{ root: classes.buttonBox }} onClick={handleOpenFilterMenu}>
                  <ImportExportIcon className={classes.greenIconButton} />
                  <Typography style={{ color: '#006960', marginLeft: 12 }}>Filter by</Typography>
                </Button>
                <Button classes={{ root: classes.buttonBox }}>
                  <ImportExportIcon size="medium" className={classes.greenIconButton} />
                  <Typography style={{ color: '#006960', marginLeft: 12 }}>Sort by</Typography>
                </Button>
              </div>
            )}
            {!!newOffer.length && <OfferCardsList offers={newOffer} isNewOffer />}
            {!!filteredOffers.length && (
              <OfferCardsList offersSubtitle={offersSubtitle} offers={filteredOffers} />
            )}
            {!newOffer.length && !filteredOffers.length && (
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginTop: '25%',
                }}
              >
                <Icon className={classes.handHelloIcon} />

                <>
                  {!(!!newOffer.length || !!restOffers.length) && (
                    <>
                      <Typography className={classes.subtitleEmpty} variant="h5">
                        You don’t have any offer!
                      </Typography>
                      <Link style={{ textDecoration: 'none' }} to="/create-offer">
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            width: 217,
                            height: 47,
                            color: '#FFFF',
                            backgroundColor: '#00d1be',
                          }}
                        >
                          Create Offer
                        </Button>
                      </Link>
                    </>
                  )}
                  {offersSubtitle === OFFERS_CREATED && (!!newOffer.length || !!restOffers.length) && (
                    <>
                      <Typography className={classes.subtitleEmpty} variant="h5">
                        You don’t have any offer!
                      </Typography>
                      <Typography className={classes.subtitleEmpty} variant="h6">
                        Use Filter by to show other types of offers
                      </Typography>
                    </>
                  )}
                  {offersSubtitle === EXPIRED_OFFERS && (
                    <>
                      <Typography className={classes.subtitleEmpty} variant="h5">
                        You don’t have any expired offer!
                      </Typography>
                      <Typography className={classes.subtitleEmpty} variant="h6">
                        Use Filter by to show other types of offers
                      </Typography>
                    </>
                  )}
                  {offersSubtitle === DELETED_OFFERS && (
                    <>
                      <Typography className={classes.subtitleEmpty} variant="h5">
                        You don’t have any deleted offer!
                      </Typography>
                      <Typography className={classes.subtitleEmpty} variant="h6">
                        Use Filter by to show other types of offers
                      </Typography>
                    </>
                  )}
                </>
              </div>
            )}
            <Popover
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              anchorEl={anchorEl}
              open={openFilterMenu}
              onClose={handleCloseFilterMenu}
            >
              <MenuItem onClick={handleFilterByMyOffers}>My offers</MenuItem>
              <MenuItem onClick={handleFilterByMyTeamOffers}>My team offers</MenuItem>
              <MenuItem onClick={handleFilterByExpired}>Expired Offers</MenuItem>
              <MenuItem onClick={handleFilterByDeleted}>Deleted Offers</MenuItem>
            </Popover>
          </>
        )}
      </main>
    </Layout>
  );
};

export default withRouter(MyOffers);
