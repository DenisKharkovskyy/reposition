import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Clear from '@material-ui/icons/Clear';

import queryString from 'query-string';
import useApiContext from 'context/useApiContext';
import { format } from 'date-fns/';

const useStyles = makeStyles(theme => ({
  title: {
    color: '#7b7b7b',
    fontSize: 14,
  },
  text: {
    fontSize: 14,
  },
  submitButton: {
    width: 217,
    height: 47,
    color: '#FFFF',
    backgroundColor: '#00d1be',
    alignSelf: 'center',
    margin: '20px 0',
  },
}));

function ConfirmOfferDialog(props) {
  const { onClose, selectedValue, open, info } = props;
  const classes = useStyles();
  const api = useApiContext();

  const [, setState] = React.useState(() => ({}));

  const handleSendClick = props => {
    let offer;
    props.info.isEditOffer
      ? (offer = {
          origin_terminal_id: props.info.chosenLoadingPort.terminal.id,
          destination_terminal_id: props.info.chosenDischargePort.terminal.id,
          service_code: props.info.chosenService.service_code,
          etd_at: props.info.selectedLoadingDate.toISOString(),
          eta_at: props.info.selectedDischargeDate.toISOString(),
          nb_teu: Number(props.info.availableTEU),
          teu_visible: props.info.VisibleAvailableTEU,
          for_sale: props.info.OfferForSale,
          for_swap: props.info.OfferForSwap,
          price_teu: Number(props.info.priceTEU),
          price_feu: Number(props.info.priceFEU),
          whitelist_owners:
            props.info.EmptiesWantToCarry === 'allCompanies'
              ? props.info.companies
              : props.info.selectedCompany,
          expiry_offer_at: props.info.selectedOpenUntilDate.toISOString(),
          contact_email: props.info.emailContact,
          company_visible: props.info.companyVisible,
          id: props.info.editOfferId,
        })
      : (offer = {
          origin_terminal_id: props.info.chosenLoadingPort.terminal.id,
          destination_terminal_id: props.info.chosenDischargePort.terminal.id,
          service_code: props.info.chosenService.service_code,
          etd_at: props.info.selectedLoadingDate.toISOString(),
          eta_at: props.info.selectedDischargeDate.toISOString(),
          nb_teu: Number(props.info.availableTEU),
          teu_visible: props.info.VisibleAvailableTEU,
          for_sale: props.info.OfferForSale,
          for_swap: props.info.OfferForSwap,
          price_teu: Number(props.info.priceTEU),
          price_feu: Number(props.info.priceFEU),
          whitelist_owners:
            props.info.EmptiesWantToCarry === 'allCompanies'
              ? props.info.companies
              : props.info.selectedCompany,
          expiry_offer_at: props.info.selectedOpenUntilDate.toISOString(),
          contact_email: props.info.emailContact,
          company_visible: props.info.companyVisible,
        });
    props.info.isEditOffer ? sendEditOffer(offer, props.info.editOfferId) : sendOffer(offer);
  };
  const handleDeleteClick = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      loading: true,
    }));

    try {
      await api.delete(`offers/${props.info.editOfferId}`);
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
      }));
      props.history.push('/my-offers');
    } catch (err) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: err,
      }));
    }
    // eslint-disable-next-line
  }, [api]);

  const sendOffer = React.useCallback(
    async offer => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));

      try {
        const newOffer = await api.post('offers/', { data: { ...offer } });
        setState(state => ({
          ...state,
          loading: false,
          loadError: null,
          newOffer: newOffer.data.data,
        }));
        props.history.push(`/my-offers?${queryString.stringify(newOffer.data.data)}`);
      } catch (err) {
        setState(state => ({
          ...state,
          loading: false,
          loadError: err,
        }));
      }
    },
    // eslint-disable-next-line
    [api]
  );

  const sendEditOffer = React.useCallback(
    async (offer, editOfferId) => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));

      try {
        const newOffer = await api.put(`offers/${editOfferId}`, { data: { ...offer } });
        setState(state => ({
          ...state,
          loading: false,
          loadError: null,
          newOffer: newOffer.data.data,
        }));
        props.history.push(`/my-offers?id=${newOffer.data.data.id}`);
      } catch (err) {
        setState(state => ({
          ...state,
          loading: false,
          loadError: err,
        }));
      }
    },
    // eslint-disable-next-line
    [api]
  );

  function handleClose() {
    onClose(selectedValue);
  }
  return (
    <Dialog onClose={handleClose} open={open}>
      <Button onClick={handleClose} style={{ position: 'absolute', right: 26, top: 26, zIndex: 1 }}>
        <Clear />
      </Button>
      <Grid
        container
        item
        style={{ padding: '25px 50px', position: 'relative', margin: 0, width: 458 }}
        spacing={2}
      >
        <Grid item xs={12}>
          <DialogTitle style={{ fontSize: 28, textAlign: 'center' }}>
            {info.isDeleteOffer ? 'Delete offer' : 'Confirm Offer Details'}
          </DialogTitle>
          <Divider />
        </Grid>
        <Grid item className={classes.title} xs={4}>
          Service
        </Grid>

        <Grid className={classes.text} item xs={8}>
          {info.chosenService.service_code}
        </Grid>
        <Grid className={classes.title} item xs={4}>
          Port of Loading
        </Grid>
        <Grid lassName={classes.text} item xs={8}>
          <Typography className={classes.text}>
            {info.chosenLoadingPort.terminal.port_name}
            {', '}
            {info.chosenLoadingPort.terminal.name}
          </Typography>
        </Grid>
        <Grid className={classes.title} item xs={4}>
          Port of Discharge
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {info.chosenDischargePort.terminal.port_name}
          {', '}
          {info.chosenDischargePort.terminal.name}
        </Grid>
        <Grid className={classes.title} item xs={4}>
          ETD
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {format(info.selectedLoadingDate, 'd MMM yyyy')}
        </Grid>
        <Grid className={classes.title} item xs={4}>
          ETA
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {format(info.selectedDischargeDate, 'd MMM yyyy')}
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid className={classes.title} item xs={4}>
          Available TEUs
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {info.availableTEU} TEUs
        </Grid>
        {(info.OfferForSale || info.OfferForSwap) && (
          <>
            <Grid className={classes.title} item xs={4}>
              Offer Options
            </Grid>
            <Grid className={classes.text} item xs={8}>
              {info.OfferForSale && !info.OfferForSwap && (
                <Typography className={classes.text}>Offer for Sale</Typography>
              )}
              {!info.OfferForSale && info.OfferForSwap && (
                <Typography className={classes.text}>Offer for Slot Swap</Typography>
              )}
              {info.OfferForSale && info.OfferForSwap && (
                <Typography className={classes.text}>Offer for Sale and Slot Swap</Typography>
              )}
            </Grid>
          </>
        )}

        {(info.priceTEU || info.priceTEU) && (
          <>
            <Grid className={classes.title} item xs={4}>
              Price
            </Grid>
            <Grid className={classes.text} item xs={8}>
              {info.priceTEU && (
                <Typography className={classes.text}> US$ {info.priceTEU}/TEU </Typography>
              )}
              {info.priceFEU && (
                <Typography className={classes.text}> US$ {info.priceFEU}/FEU </Typography>
              )}
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid className={classes.title} item xs={4}>
          Companies
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {info.EmptiesWantToCarry === 'allCompanies' && (
            <Typography className={classes.text}>Open to all companies</Typography>
          )}
          {info.EmptiesWantToCarry === 'selectedCompany' &&
            Object.entries(info.selectedCompany).length !== 0 && (
              <Typography className={classes.text}>
                {info.selectedCompany
                  .map(company => {
                    if (typeof company === 'string') {
                      return company;
                    } else return company.name;
                  })
                  .join(', ')}
              </Typography>
            )}
        </Grid>
        <Grid className={classes.title} item xs={4}>
          Expiry Date
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {format(info.selectedOpenUntilDate, 'd MMM yyyy')}
        </Grid>

        <Grid className={classes.title} item xs={4}>
          Email
        </Grid>
        <Grid className={classes.text} item xs={8}>
          {info.emailContact}
        </Grid>
      </Grid>
      {(info.VisibleAvailableTEU || info.companyVisible) && (
        <Grid
          container
          style={{ width: 458, padding: '25px 50px', backgroundColor: 'rgba(216, 216, 216, 0.37)' }}
        >
          <Grid container justify="center" alignItems="center" item xs={2}>
            <CheckCircle style={{ color: '#006960' }} />
          </Grid>
          <Grid className={classes.text} item xs={10}>
            {info.VisibleAvailableTEU && !info.companyVisible && (
              <Typography className={classes.text}>
                Available TEUs will be visible in my slot offer listing.
              </Typography>
            )}
            {!info.VisibleAvailableTEU && info.companyVisible && (
              <Typography className={classes.text}>
                Company name will be visible in my slot offer listing.
              </Typography>
            )}
            {info.VisibleAvailableTEU && info.companyVisible && (
              <Typography className={classes.text}>
                Available TEUs and Company name will be visible in my slot offer listing.
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
      {info.isDeleteOffer ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          onClick={() => handleDeleteClick(props)}
        >
          Delete Offer
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          onClick={() => handleSendClick(props)}
        >
          {props.info.isEditOffer ? 'Edit Offer' : 'Create Offer'}
        </Button>
      )}
    </Dialog>
  );
}

ConfirmOfferDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withRouter(ConfirmOfferDialog);
