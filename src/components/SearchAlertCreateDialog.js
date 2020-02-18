import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import useApiContext from 'context/useApiContext';

const useStyles = makeStyles(theme => ({
  rootDialog: {
    width: '100%',
  },
  paper: {
    width: 460,
    maxHeight: 750,
    padding: 40,
    position: 'relative',
    boxSizing: 'border-box',
  },
  closeButton: {
    position: 'absolute',
    top: 26,
    right: 26,
  },
  contentRoot: {
    padding: '24px 0px 16px',
  },
  fieldContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    margin: '8px 0px',
  },
  fieldLabel: {
    color: '#7b7b7b',
    width: 140,
    textAlign: 'left',
  },
  fieldLabelValue: {
    width: 210,
  },
  actionButtonRoot: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
}));

export default function SearchAlertCreateDialog({
  handleCloseCreateAlertDialog,
  showCreateAlertDialog,
  selectedOrigin,
  selectedDestination,
  ELD,
  LLD,
  onClose,
  selectedValue,
  filterOptions,
}) {
  const classes = useStyles();

  const api = useApiContext();

  const [{ snackBarOpen, ...state }, setState] = React.useState({
    emailNotification: true,
    newSearchAlert: {},
    loadingError: null,
    searchAlertId: null,
    snackBarOpen: false,
  });

  React.useEffect(() => {
    setState(state => ({
      ...state,
      newSearchAlert: {
        originable_id: selectedOrigin.id,
        originable_type: selectedOrigin.type,
        destination_id: selectedDestination.id,
        destination_type: selectedDestination.type,
        start_loading_on: ELD,
        end_loading_on: LLD,
        for_sale: filterOptions.showSale,
        for_swap: filterOptions.showSlotSwap,
        max_price_teu: filterOptions.maxTeuPrice,
        max_price_feu: filterOptions.maxFeuPrice,
        no_price: filterOptions.showWithoutPrice,
        min_eta_at: startOfDay(addDays(filterOptions.etaDates[0], filterOptions.etaValues[0])),
        max_eta_at: endOfDay(addDays(filterOptions.etaDates[0], filterOptions.etaValues[1])),
        whitelist_lines: filterOptions.selectedCompanies.length
          ? [...filterOptions.selectedCompanies]
          : 'Undisclosed',
        notification_email: state.emailNotification,
      },
    }));
  }, [
    selectedOrigin.id,
    selectedDestination.id,
    selectedDestination.type,
    selectedOrigin.type,
    ELD,
    LLD,
    filterOptions.etaDates,
    filterOptions.maxFeuPrice,
    filterOptions.maxTeuPrice,
    filterOptions.selectedCompanies,
    filterOptions.showSlotSwap,
    filterOptions.showSale,
    filterOptions.showWithoutPrice,
    filterOptions.etaValues,
  ]);

  function handleOpenSnackBar() {
    setState(state => ({
      ...state,
      snackBarOpen: true,
    }));
  }

  function handleCloseSnackBar() {
    setState(state => ({ ...state, snackBarOpen: false }));
  }

  const createSearchAlert = React.useCallback(
    async newAlert => {
      try {
        const searchAlertId = await api.post('search_alerts/', { data: { ...newAlert } });
        setState(state => ({
          ...state,
          loadingError: null,
          searchAlertId: searchAlertId,
        }));
      } catch (error) {
        setState(state => ({
          ...state,
          loadingError: error,
          searchAlertId: null,
        }));
      }
      handleOpenSnackBar();
      handleCloseCreateAlertDialog();
    },
    // eslint-disable-next-line
    [api]
  );

  const handleChangeCheckbox = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  function renderOptionsLabel(sale, slotSwap) {
    if (sale && slotSwap) {
      return 'Offer for Sale and Slot Swap';
    } else if (sale && !slotSwap) {
      return 'Offer for Sale';
    } else if (!sale && slotSwap) {
      return 'Offer for Slot Swap';
    } else return 'No options';
  }

  return (
    <>
      <Dialog
        onBackdropClick={handleCloseCreateAlertDialog}
        onClose={handleCloseCreateAlertDialog}
        classes={{ root: classes.rootDialog, paper: classes.paper }}
        open={showCreateAlertDialog}
      >
        <IconButton
          size="medium"
          className={classes.closeButton}
          onClick={handleCloseCreateAlertDialog}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle style={{ textAlign: 'center' }}>Create a Search Alert</DialogTitle>
        <DialogContent classes={{ root: classes.contentRoot }} dividers>
          <Grid container justify="center" align="center" direction="column">
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Origin
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {selectedOrigin.label}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Destination
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {selectedDestination.label}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Earliest loading date
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {format(new Date(ELD), 'd MMM yyyy')}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Latest loading date
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {format(new Date(LLD), 'd MMM yyyy')}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Est. arrival date
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {`${format(
                  startOfDay(addDays(filterOptions.etaDates[0], filterOptions.etaValues[0])),
                  'd MMM yyyy'
                )} - ${format(
                  endOfDay(addDays(filterOptions.etaDates[0], filterOptions.etaValues[1])),
                  'd MMM yyyy'
                )}`}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Offer options
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {renderOptionsLabel(filterOptions.showSale, filterOptions.showSlotSwap)}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Shipping lines
              </Typography>
              <Typography variant="body2" className={classes.fieldLabelValue}>
                {filterOptions.selectedCompanies.length
                  ? filterOptions.selectedCompanies.join(', ')
                  : 'Undisclosed'}
              </Typography>
            </Grid>
            <Grid className={classes.fieldContainer} item>
              <Typography variant="body2" className={classes.fieldLabel}>
                Price
              </Typography>
              <div className={classes.fieldContainer} style={{ flexDirection: 'column' }}>
                <Typography
                  variant="body2"
                  style={{ marginBottom: 16 }}
                  className={classes.fieldLabelValue}
                >
                  {`US$ ${filterOptions.maxTeuPrice}/TEU`}
                </Typography>
                <Typography variant="body2" className={classes.fieldLabelValue}>
                  {`US$ ${filterOptions.maxFeuPrice}/FEU`}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions classes={{ root: classes.actionButtonRoot }}>
          <div className={classes.checkboxContainer}>
            <Checkbox
              checked={state.emailNotification}
              onChange={handleChangeCheckbox('emailNotification')}
              value="emailNotification"
              color="primary"
            />
            <Typography variant="body2">Notify me via email if a new offer is posted.</Typography>
          </div>
          <Button
            onClick={() => createSearchAlert(state.newSearchAlert)}
            variant="contained"
            color="secondary"
          >
            Create search alert
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        message={<span id="message-id">Search Alert created successfully</span>}
      />
    </>
  );
}
