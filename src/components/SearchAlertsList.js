import React from 'react';

import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { parseISO, format } from 'date-fns/';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import DeleteOutlined from '@material-ui/icons/DeleteOutlined';

import locationDist from '../assets/img/location-dist.svg';
import SwapIcon from 'assets/img/swap.svg';
import getPortLabel from 'utils/getPortLabel';

const useStyles = makeStyles({
  locationDist: {
    backgroundImage: `url('${locationDist}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: 9,
    height: 60,
  },
  greenIconButton: {
    backgroundColor: 'rgba(3, 184, 168, 0.06)',
  },
  editOfferButton: {
    width: 32,
    height: 32,
    marginRight: 12,
    padding: 0,
  },
  offerCard: {
    height: 178,
    margin: '12px 0',
    boxSizing: 'border-box',
    position: 'relative',
  },
  newOfferCard: {
    border: '2px solid #03b8a8',
  },
  offerCardFieldOption: {
    color: '#a8a8a8',
    marginBottom: 12,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: 600,
    color: '#006960',
  },
  offerPriceUnit: {
    fontSize: 14,
    fontWeight: 400,
  },
  offerContactIcons: {
    color: '#7b7b7b',
    width: 12,
    height: 13,
    marginRight: 10,
  },
  offerExpirationColor: {
    color: '#e53411',
  },
  cornerSwapLabel: {
    backgroundImage: `url('${SwapIcon}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: 70,
    height: 70,
    position: 'absolute',
    top: -15,
    right: -15,
  },
  optionWidth: {
    marginRight: 30,
  },
  gridLeftSideWrapper: {
    maxWidth: 920,
    padding: 20,
  },
  gridRightSideWrapper: {
    width: 230,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default function SearchAlertsCard({
  searchAlerts,
  isNewSearchAlert,
  alertAvailableOffersList,
  handleDeleteAlert,
}) {
  const classes = useStyles();

  const moreThanOneOffer = searchAlerts.length > 1;

  function parseDate(date) {
    return format(parseISO(date), 'd MMM yyyy');
  }

  // NOTE this function is temporary while we receive different date type from API
  function formatDate(date) {
    return format(new Date(date), 'd MMM yyyy');
  }

  function renderOfferCardOptionsTitle(title, offerData) {
    return (
      <Grid item className={classes.optionWidth}>
        <Typography variant="caption" className={classes.offerCardFieldOption}>
          {title}
        </Typography>
        <Typography variant="body2">{offerData}</Typography>
      </Grid>
    );
  }

  function renderOfferCardAdditionalOptions(offer) {
    const additionalOptions = [
      { title: 'for_sale', name: 'Sale' },
      { title: 'for_swap', name: 'Slot Swap' },
    ];
    return additionalOptions
      .filter(option => offer[option.title])
      .map(option => option.name)
      .join(' • ');
  }

  function renderMaxPrice(offer) {
    const PRICE_CONSTANTS = [
      { key: 'max_price_teu', unit: 'TEU' },
      { key: 'max_price_feu', unit: 'FEU' },
    ];
    return PRICE_CONSTANTS.map(el => `${offer[el.key]}/${el.unit}`).join(' • ');
  }

  return (
    <section>
      {
        <Typography style={{ margin: '24px 0px' }}>
          {isNewSearchAlert ? (
            <>
              <strong>1 new</strong> search alert created
            </>
          ) : (
            <>
              <strong>{`${searchAlerts.length} `}</strong>
              {`${moreThanOneOffer ? 'search alerts' : 'search alert'} created`}
            </>
          )}
        </Typography>
      }
      {!!searchAlerts.length
        ? searchAlerts.map(offer => {
            const loadingDates = [
              formatDate(offer.start_loading_on),
              formatDate(offer.end_loading_on),
            ].join(' - ');
            const arrivalDates = [parseDate(offer.min_eta_at), parseDate(offer.max_eta_at)].join(
              ' - '
            );

            let shippingLinesTitle = offer.whitelist_lines.slice(0, 2).join(', ');
            if (offer.whitelist_lines.length > 2) {
              shippingLinesTitle = shippingLinesTitle.concat(
                ` (+${offer.whitelist_lines.length - 2})`
              );
            }

            const originPortLabel = getPortLabel(offer.origin);
            const destinationPortLabel = getPortLabel(offer.destination);

            return (
              <Card
                key={offer.id}
                className={classNames(classes.offerCard, isNewSearchAlert && classes.newOfferCard)}
              >
                <Grid container wrap="nowrap" style={{ height: '100%' }}>
                  <Grid
                    item
                    className={classes.gridLeftSideWrapper}
                    direction="column"
                    container
                    wrap="nowrap"
                  >
                    <Grid container item style={{ display: 'flex' }}>
                      <Icon className={classes.locationDist} />
                      <Grid
                        item
                        xs={10}
                        style={{ paddingLeft: 16 }}
                        container
                        justify="space-between"
                        direction="column"
                      >
                        <Grid item>
                          {originPortLabel && (
                            <Typography style={{ fontSize: 18 }}>{originPortLabel}</Typography>
                          )}
                        </Grid>
                        <Grid item style={{ marginTop: 10 }}>
                          {destinationPortLabel && (
                            <Typography style={{ fontSize: 18 }}>{destinationPortLabel}</Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item container wrap="nowrap" style={{ marginLeft: 20, paddingTop: 20 }}>
                      {renderOfferCardOptionsTitle('LOADING DATES', loadingDates)}
                      {renderOfferCardOptionsTitle('EST. ARRIVAL DATES', arrivalDates)}
                      {renderOfferCardOptionsTitle(
                        'SHIPPING LINE',
                        !!shippingLinesTitle ? shippingLinesTitle : 'Undisclosed'
                      )}
                      {renderOfferCardOptionsTitle('MAX. PRICE (US$)', renderMaxPrice(offer))}
                      {renderOfferCardOptionsTitle(
                        'OFFER OPTIONS',
                        renderOfferCardAdditionalOptions(offer)
                      )}
                    </Grid>
                  </Grid>
                  <Grid
                    className={classes.gridRightSideWrapper}
                    style={{
                      background: !!searchAlerts.length
                        ? 'rgba(3, 184, 168, 0.06)'
                        : 'rgba(216, 216, 216, 0.08)',
                    }}
                    item
                    container
                    direction="column"
                  >
                    <Typography>
                      <strong style={{ marginRight: 5 }}>
                        {alertAvailableOffersList &&
                          alertAvailableOffersList[offer.id] &&
                          alertAvailableOffersList[offer.id].new &&
                          alertAvailableOffersList[offer.id].new.length}
                      </strong>
                      new offers available!
                    </Typography>
                    <Link style={{ textDecoration: 'none' }} to={`/browse-offers?id=${offer.id}`}>
                      <Button
                        color="primary"
                        style={{ background: '#00d1be', marginTop: 12 }}
                        variant="contained"
                      >
                        Search now
                      </Button>
                    </Link>
                    <IconButton
                      color="default"
                      style={{
                        textTransform: 'none',
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        alignItems: 'normal',
                      }}
                      size="small"
                      onClick={() => handleDeleteAlert(offer.id)}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            );
          })
        : null}
    </section>
  );
}
