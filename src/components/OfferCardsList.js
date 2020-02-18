import React from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames';
import { differenceInDays, differenceInHours, parseISO, format } from 'date-fns/';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import EditIcon from '@material-ui/icons/Edit';
import UpdateIcon from '@material-ui/icons/Update';
import MailIcon from '@material-ui/icons/MailOutline';

import locationDist from '../assets/img/location-dist.svg';
import SwapIcon from 'assets/img/swap.svg';

import InquiriesDialog from 'components/InquiriesDialog';
import {
  PREVIOUS_OFFERS,
  OFFERS_CREATED,
  EXPIRED_OFFERS,
  DELETED_OFFERS,
} from 'constants/offerSubtitle';

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
    maxWidth: 1045,
    margin: '12px 0',
    padding: '18px 0px',
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
});

export default function OfferCardList({ offers, isNewOffer, isBrowseOfferPage, offersSubtitle }) {
  const classes = useStyles();

  const moreThanOneOffer = offers.length > 1;

  function parseDate(date) {
    return format(parseISO(date), 'd MMM yyyy');
  }

  function getTimeLeftToExpiration(date) {
    const days = differenceInDays(parseISO(date), new Date());
    const hours = differenceInHours(parseISO(date), new Date());

    const leftMoreThanADay = days > 0;
    return (
      <>
        <UpdateIcon
          className={classNames(
            classes.offerContactIcons,
            !leftMoreThanADay && classes.offerExpirationColor
          )}
        />
        <Typography variant="caption" style={{ color: leftMoreThanADay ? '#7b7b7b' : '#e53411' }}>
          {isNaN(hours) || hours < 0
            ? 'expired'
            : days > 0
            ? `${days} days left`
            : `${hours} hrs left`}
        </Typography>
      </>
    );
  }

  function renderOfferCardOptionsTitle(title, offerData, gridSize) {
    return offerData ? (
      <Grid item xs={gridSize}>
        <Typography variant="caption" className={classes.offerCardFieldOption}>
          {title}
        </Typography>
        <Typography variant="subtitle1">{offerData}</Typography>
      </Grid>
    ) : (
      <Typography variant="caption" className={classes.offerCardFieldOption}>
        {title}
      </Typography>
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

  const labelGridSize = isBrowseOfferPage ? 3 : 2;

  const [isOpenInquiriesDialog, setOpenInquiriesDialog] = React.useState(false);
  const [chosenOffer, setChosenOffer] = React.useState(null);

  const handleCloseInquiriesDialog = () => {
    setOpenInquiriesDialog(false);
  };

  const handleOpenInquiriesDialog = offerId => {
    setChosenOffer(offerId);
    setOpenInquiriesDialog(true);
  };

  return (
    <section>
      {!isBrowseOfferPage && (
        <Typography style={{ margin: '24px 0px' }}>
          {isNewOffer ? (
            <>
              <strong>1 new</strong> offer created
            </>
          ) : (
            <>
              {offersSubtitle === PREVIOUS_OFFERS && (
                <>
                  <strong>{`${offers.length} previous `}</strong>
                  {`${moreThanOneOffer ? 'offers' : 'offer'} created`}
                </>
              )}
              {offersSubtitle === OFFERS_CREATED && (
                <>
                  <strong>{`${offers.length} `}</strong>
                  {`${moreThanOneOffer ? 'offers' : 'offer'} created`}
                </>
              )}
              {offersSubtitle === EXPIRED_OFFERS && (
                <>
                  <strong>{`${offers.length} `}</strong>
                  {` expired ${moreThanOneOffer ? 'offers' : 'offer'}`}
                </>
              )}
              {offersSubtitle === DELETED_OFFERS && (
                <>
                  <strong>{`${offers.length} `}</strong>
                  {` deleted ${moreThanOneOffer ? 'offers' : 'offer'}`}
                </>
              )}
            </>
          )}
        </Typography>
      )}
      {!!offers.length
        ? offers.map(offer => (
            <Card
              key={offer.id}
              className={classNames(classes.offerCard, isNewOffer && classes.newOfferCard)}
            >
              <Grid container>
                <Grid item xs={9} container>
                  <Grid
                    item
                    xs={1}
                    container
                    justify="center"
                    alignItems="flex-start"
                    style={{ display: 'flex' }}
                  >
                    <Icon className={classes.locationDist} />
                  </Grid>
                  <Grid item xs={11} container justify="space-between" direction="column">
                    <Grid item>
                      {offer.origin_terminal && (
                        <Typography style={{ fontSize: 18 }}>
                          {offer.origin_terminal.port_name} ({offer.origin_terminal.name})
                        </Typography>
                      )}
                    </Grid>
                    <Grid item style={{ marginTop: 10 }}>
                      {offer.destination_terminal && (
                        <Typography style={{ fontSize: 18 }}>
                          {offer.destination_terminal.port_name} ({offer.destination_terminal.name})
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item container style={{ marginLeft: 30, paddingTop: 20 }}>
                    {!isBrowseOfferPage &&
                      renderOfferCardOptionsTitle('SERVICE', offer.service_code, labelGridSize)}
                    {renderOfferCardOptionsTitle(
                      'EST. DEPARTURE',
                      parseDate(offer.etd_at),
                      labelGridSize
                    )}
                    {renderOfferCardOptionsTitle(
                      'EST. ARRIVAL',
                      parseDate(offer.eta_at),
                      labelGridSize
                    )}
                    {isBrowseOfferPage &&
                      renderOfferCardOptionsTitle(
                        'SHIPPING LINE',
                        !!offer.company_name ? offer.company_name : 'Undisclosed',
                        labelGridSize
                      )}
                    {!isBrowseOfferPage && offer.whitelist_owners && (
                      <Grid item xs={labelGridSize}>
                        {renderOfferCardOptionsTitle('COMPANIES')}
                        <Typography variant="subtitle1">
                          {!!offer.whitelist_owners.length
                            ? `${offer.whitelist_owners.length} selected`
                            : 'Undisclosed'}
                        </Typography>
                      </Grid>
                    )}
                    {offer.teu_visible && renderOfferCardOptionsTitle('TEUs', offer.nb_teu, 1)}
                    {!isBrowseOfferPage && (
                      <Grid item xs={3}>
                        {renderOfferCardOptionsTitle('OFFER OPTIONS')}
                        <Typography variant="subtitle1">
                          {renderOfferCardAdditionalOptions(offer)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  style={{
                    borderLeft: 'solid 1px rgba(216, 216, 216, 0.37)',
                    paddingLeft: 30,
                  }}
                  item
                  xs={3}
                  container
                  justify="space-between"
                  direction="column"
                >
                  {!isBrowseOfferPage && (
                    <Grid item container justify="flex-end" style={{ margin: '-6px 0px -12px' }}>
                      <Link to={`/edit-offer?id=${offer.id}`}>
                        <IconButton
                          className={classNames(classes.greenIconButton, classes.editOfferButton)}
                        >
                          <EditIcon style={{ color: '#006960', height: 18 }} />
                        </IconButton>
                      </Link>
                    </Grid>
                  )}
                  {!!offer.price_teu && (
                    <Grid item>
                      <Typography className={classes.offerPrice}>
                        {`US$ ${offer.price_teu} `}
                        <span className={classes.offerPriceUnit}>/TEU</span>
                      </Typography>
                    </Grid>
                  )}
                  {!!offer.price_feu && (
                    <Grid item>
                      <Typography className={classes.offerPrice}>
                        {`US$ ${offer.price_feu} `}
                        <span className={classes.offerPriceUnit}>/FEU</span>
                      </Typography>
                    </Grid>
                  )}
                  <Grid item container alignItems="center">
                    {getTimeLeftToExpiration(offer.expiry_offer_at)}
                  </Grid>
                  <Grid item container alignItems="center">
                    {isBrowseOfferPage ? (
                      <Button
                        style={{
                          marginRight: 24,
                          height: 47,
                        }}
                        fullWidth
                        variant="contained"
                        onClick={() => handleOpenInquiriesDialog(offer.id)}
                      >
                        Contact
                      </Button>
                    ) : (
                      <>
                        <MailIcon className={classes.offerContactIcons} />
                        <Typography variant="caption" style={{ color: '#7b7b7b' }}>
                          {offer.contact_email}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  {isBrowseOfferPage && offer.for_swap && (
                    <Icon className={classes.cornerSwapLabel} />
                  )}
                </Grid>
              </Grid>
            </Card>
          ))
        : null}
      <InquiriesDialog
        offerId={chosenOffer}
        open={isOpenInquiriesDialog}
        onClose={handleCloseInquiriesDialog}
      />
    </section>
  );
}
