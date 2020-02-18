import React from 'react';

import parseISO from 'date-fns/parseISO';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';
import DateFnsUtils from '@date-io/date-fns';

import { withFormik } from 'formik';
import validationSchema from 'utils/validationSchema';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Chip from '@material-ui/core/Chip';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ListItemText from '@material-ui/core/ListItemText';

import useApiContext from 'context/useApiContext';
import useAuthContext from 'context/useAuthContext';

import Layout from 'components/Layout';
import ConfirmOfferDialog from 'components/ConfirmOfferDialog';

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    maxWidth: 1120,
    paddingTop: 32,
    margin: 'auto',
    minHeight: 'calc(100vh - 112px)',
  },
  paper: {
    width: '100%',
    maxWidth: 1120,
    minHeight: '100vh',
    padding: 40,
    marginBottom: 20,
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  sectionTitle: {
    paddingLeft: 8,
    marginBottom: 27,
    paddingTop: 40,
  },
  customDisabled: {
    color: 'black !important',
  },
}));

const CreateOffer = props => {
  const { profile } = useAuthContext();
  const api = useApiContext();

  const [isOpenConfirmOfferDialog, setOpenConfirmOffer] = React.useState(false);

  const openDialog = () => {
    if (Object.entries(props.errors).length === 0) {
      setState(state => ({
        ...state,
        newState: state,
      }));
      setOpenConfirmOffer(true);
    }
  };

  const handleCloseConfirmOfferDialog = () => {
    setOpenConfirmOffer(false);
  };

  const [
    {
      services,
      chosenService,
      chosenServiceInfo,
      chosenLoadingPort,
      chosenDischargePort,
      availableTEU,
      VisibleAvailableTEU,
      OfferForSwap,
      OfferForSale,
      priceTEU,
      priceFEU,
      emailContact,
      companyVisible,
      EmptiesWantToCarry,
      companies,
      selectedLoadingDate,
      selectedOpenUntilDate,
      selectedCompany,
      selectedDischargeDate,
      newState,
      loadError,
    },
    setState,
  ] = React.useState(() => ({
    services: [],
    chosenService: '',
    availableTEU: '',
    chosenLoadingPort: '',
    chosenDischargePort: '',
    VisibleAvailableTEU: true,
    OfferForSwap: true,
    OfferForSale: true,
    chosenServiceInfo: [],
    priceTEU: '',
    priceFEU: '',
    emailContact: '',
    companyVisible: true,
    EmptiesWantToCarry: 'allCompanies',
    companies: null,
    selectedLoadingDate: null,
    selectedOpenUntilDate: null,
    loadError: null,
    newState: null,
    selectedCompany: [],
    selectedDischargeDate: null,
  }));

  const getServices = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      loading: true,
    }));

    try {
      const res = await api.get('line_services/');
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        services: res.data.data,
      }));
    } catch (err) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: err,
      }));
      return;
    }
  }, [setState, api]);

  const getCompanies = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      loading: true,
    }));

    try {
      const res = await api.get('companies/');
      setState(state => ({
        ...state,
        loading: false,
        loadError: null,
        companies: res.data.data.map(company => company.name),
      }));
    } catch (err) {
      setState(state => ({
        ...state,
        loading: false,
        loadError: err,
      }));
      return;
    }
  }, [setState, api]);

  const getServiceId = React.useCallback(
    async id => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));

      try {
        const res = await api.get(`line_services/${id}/`);

        setState(state => ({
          ...state,
          loading: false,
          loadError: null,
          chosenServiceInfo: res.data.data.line_service_stops,
        }));
      } catch (err) {
        setState(state => ({
          ...state,
          loading: false,
          loadError: err,
        }));
        return;
      }
    },
    [setState, api]
  );

  React.useEffect(() => {
    getServices();
    getCompanies();
  }, [getServices, getCompanies]);

  const classes = useStyles();

  const handleEventInputWithValidation = (name, withValidation) => event => {
    event.persist();
    setState(state => ({
      ...state,
      [name]: event.target.value,
    }));
    withValidation && props.setFieldValue(name, event.target.value);
  };

  const handleCheckedInputWithValidation = (name, withValidation) => event => {
    event.persist();
    setState(state => ({
      ...state,
      [name]: event.target.checked,
    }));
    withValidation && props.setFieldValue(name, event.target.checked);
  };

  const handleDateWithValidation = (name, withValidation) => date => {
    setState(state => ({
      ...state,
      [name]: date,
    }));
    withValidation && props.setFieldValue(name, date);
  };

  function handleSelectService(event) {
    setState(state => ({
      ...state,
      chosenService: event.target.value,
    }));
    props.setFieldValue('chosenService', event.target.value);
    getServiceId(event.target.value.id);
  }

  React.useEffect(() => {
    if (selectedLoadingDate && chosenLoadingPort && chosenDischargePort) {
      setState(state => ({
        ...state,
        selectedDischargeDate: addDays(
          selectedLoadingDate,
          differenceInDays(parseISO(chosenDischargePort.eta_at), parseISO(chosenLoadingPort.etd_at))
        ),
      }));
    }
  }, [chosenDischargePort, chosenLoadingPort, selectedLoadingDate]);

  React.useEffect(() => {
    setState(state => ({
      ...state,
      emailContact: profile.email,
    }));
    props.setFieldValue('emailContact', profile.email);
    // eslint-disable-next-line
  }, []);

  const { errors, touched, handleBlur, handleSubmit } = props;

  return (
    <Layout loadError={loadError}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <main className={classes.content}>
          <section>
            <Typography style={{ marginBottom: 32, fontWeight: 600 }} variant="h4">
              Create Slot Offer
            </Typography>
            <Paper className={classes.paper}>
              <form className={classes.form} noValidate>
                {/* service */}
                <Grid container style={{ marginBottom: 34, position: 'relative' }} spacing={2}>
                  <Typography
                    className={classes.sectionTitle}
                    style={{ paddingTop: 0 }}
                    variant="h5"
                  >
                    Location and Date Details of Slot Availability
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleSelectService}
                      style={{ width: 440 }}
                      value={chosenService}
                      onBlur={handleBlur}
                      select
                      label="Service"
                      autoFocus={true}
                      name="chosenService"
                      variant="outlined"
                      error={!!(errors.chosenService && touched.chosenService)}
                      helperText={
                        errors.chosenService && touched.chosenService && errors.chosenService
                      }
                    >
                      {services.map(item => (
                        <MenuItem key={item.id} value={item}>
                          {item.service_code}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {/* service */}

                  {/* port of loading */}
                  <Grid item xs={12} container>
                    <TextField
                      style={{ width: 440 }}
                      onBlur={handleBlur}
                      onChange={handleEventInputWithValidation('chosenLoadingPort', true)}
                      select
                      name="chosenLoadingPort"
                      value={chosenLoadingPort}
                      label="Port of Loading"
                      variant="outlined"
                      disabled={!chosenServiceInfo.length}
                      error={!!(errors.chosenLoadingPort && touched.chosenLoadingPort)}
                      helperText={
                        errors.chosenLoadingPort &&
                        touched.chosenLoadingPort &&
                        errors.chosenLoadingPort
                      }
                    >
                      {chosenServiceInfo.slice(0, -1).map(item => (
                        <MenuItem key={item.terminal.id} value={item}>
                          {item.terminal.port_name}, {item.terminal.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <KeyboardDatePicker
                      autoOk
                      style={{ marginLeft: 20, width: 191 }}
                      variant="inline"
                      inputVariant="outlined"
                      label="ETD"
                      disabled={!chosenServiceInfo.length}
                      format="dd/MM/yyyy"
                      minDate={new Date()}
                      value={selectedLoadingDate}
                      InputAdornmentProps={{ position: 'end' }}
                      onChange={handleDateWithValidation('selectedLoadingDate', true)}
                      error={!!(errors.selectedLoadingDate && touched.selectedLoadingDate)}
                      helperText={
                        errors.selectedLoadingDate &&
                        touched.selectedLoadingDate &&
                        errors.selectedLoadingDate
                      }
                    />
                  </Grid>
                  {/* port of loading */}

                  {/* port of Discharge */}
                  <Grid item xs={12} container>
                    <TextField
                      style={{ width: 440 }}
                      select
                      onBlur={handleBlur}
                      disabled={!(chosenLoadingPort && selectedLoadingDate)}
                      onChange={handleEventInputWithValidation('chosenDischargePort', true)}
                      value={chosenDischargePort}
                      label="Port of Discharge"
                      variant="outlined"
                      error={!!(errors.chosenDischargePort && touched.chosenDischargePort)}
                      helperText={
                        errors.chosenDischargePort &&
                        touched.chosenDischargePort &&
                        errors.chosenDischargePort
                      }
                    >
                      {!!chosenServiceInfo &&
                        chosenServiceInfo &&
                        chosenServiceInfo
                          .filter(item => item.position > chosenLoadingPort.position)
                          .map(item => (
                            <MenuItem key={item.terminal.id} value={item}>
                              {item.terminal.port_name}, {item.terminal.name}
                            </MenuItem>
                          ))}
                    </TextField>
                    <KeyboardDatePicker
                      autoOk
                      InputProps={{ classes: { disabled: classes.customDisabled } }}
                      style={{ marginLeft: 20, width: 191 }}
                      variant="inline"
                      minDate={new Date()}
                      inputVariant="outlined"
                      label="ETA"
                      disabled
                      className={classes.new}
                      format="dd/MM/yyyy"
                      value={selectedDischargeDate}
                      InputAdornmentProps={{
                        position: 'end',
                      }}
                    />
                  </Grid>
                  {/* port of Discharge */}

                  {/* Available TEUs */}
                  <Typography className={classes.sectionTitle} variant="h5">
                    Available TEUs
                  </Typography>
                  <Grid direction="column" item xs={12} container>
                    <TextField
                      style={{ width: 441 }}
                      label="TEU"
                      value={availableTEU}
                      name="availableTEU"
                      type="number"
                      onChange={handleEventInputWithValidation('availableTEU', true)}
                      onBlur={handleBlur}
                      variant="outlined"
                      error={!!(errors.availableTEU && touched.availableTEU)}
                      helperText={
                        errors.availableTEU && touched.availableTEU && errors.availableTEU
                      }
                    />
                    <FormGroup
                      style={{ marginTop: 21 }}
                      onChange={handleCheckedInputWithValidation('VisibleAvailableTEU', false)}
                      value={VisibleAvailableTEU}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={VisibleAvailableTEU} color="primary" />}
                        label="Keep my available TEUs visible in my slot offer."
                      />
                    </FormGroup>
                  </Grid>
                  {/* Available TEUs */}

                  {/* Offer Options */}
                  <Typography className={classes.sectionTitle} variant="h5">
                    Offer Options
                  </Typography>
                  <Grid item xs={12} container>
                    <FormGroup
                      onChange={handleCheckedInputWithValidation('OfferForSale', false)}
                      value={OfferForSale}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={OfferForSale} color="primary" />}
                        label="Offer for Sale"
                      />
                    </FormGroup>
                    <FormGroup
                      onChange={handleCheckedInputWithValidation('OfferForSwap', false)}
                      value={OfferForSwap}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={OfferForSwap} color="primary" />}
                        label="Offer for Slot Swap"
                      />
                    </FormGroup>
                  </Grid>
                  {/* Offer Options */}

                  {/* Price (Optional) */}
                  <Typography className={classes.sectionTitle} variant="h5">
                    Price (Optional)
                  </Typography>
                  <Grid item xs={12} container>
                    <TextField
                      disabled={!OfferForSale}
                      style={{ width: 213 }}
                      value={priceTEU}
                      onChange={handleEventInputWithValidation('priceTEU', false)}
                      type="number"
                      name="service"
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                      label="Price/TEU"
                    />

                    <TextField
                      style={{ marginLeft: 15, width: 213 }}
                      disabled={!OfferForSale}
                      value={priceFEU}
                      onChange={handleEventInputWithValidation('priceFEU', false)}
                      type="number"
                      name="service"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                      variant="outlined"
                      label="Price/FEU"
                    />
                  </Grid>
                  {/* Price (Optional) */}

                  {/* Whose Empties do I Want to Carry */}
                  <Typography className={classes.sectionTitle} variant="h5">
                    Whose Empties do I Want to Carry
                  </Typography>
                  <Grid item xs={12} container>
                    <RadioGroup
                      value={EmptiesWantToCarry}
                      onChange={handleEventInputWithValidation('EmptiesWantToCarry', false)}
                      aria-label="position"
                      name="position"
                      row
                    >
                      <FormControlLabel
                        value="allCompanies"
                        control={<Radio color="primary" />}
                        label="Open to All Companies"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="selectedCompany"
                        control={<Radio color="primary" />}
                        label="Select Companies"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} container>
                    {companies && !!(EmptiesWantToCarry === 'selectedCompany') && (
                      <FormControl>
                        <Select
                          multiple
                          value={selectedCompany}
                          onChange={handleEventInputWithValidation('selectedCompany', false)}
                          MenuProps={{
                            style: {
                              maxHeight: 400,
                              width: 250,
                            },
                          }}
                          input={<OutlinedInput placeholder="Companies" style={{ width: 441 }} />}
                          renderValue={selected => (
                            <div className={classes.chips}>
                              {selected.map(value => (
                                <Chip key={value} label={value} className={classes.chip} />
                              ))}
                            </div>
                          )}
                        >
                          {companies.map(item => (
                            <MenuItem
                              style={{ padding: '15px 15px 0', width: '100%' }}
                              key={item}
                              value={item}
                            >
                              <Checkbox checked={selectedCompany.indexOf(item) !== -1} />
                              <ListItemText primary={item} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                  {/* Whose Empties do I Want to Carry */}

                  {/* Offer Open Until*/}
                  <Typography className={classes.sectionTitle} variant="h5">
                    Offer Open Until
                  </Typography>
                  <Grid item xs={12} container>
                    <FormControl
                      style={{ width: 441 }}
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <KeyboardDatePicker
                        autoOk
                        variant="inline"
                        minDate={new Date()}
                        inputVariant="outlined"
                        label="Expire Date"
                        format="dd/MM/yyyy"
                        value={selectedOpenUntilDate}
                        onBlur={handleBlur}
                        onChange={handleDateWithValidation('selectedOpenUntilDate', true)}
                        InputAdornmentProps={{ position: 'end' }}
                        error={!!(errors.selectedOpenUntilDate && touched.selectedOpenUntilDate)}
                        helperText={
                          errors.selectedOpenUntilDate &&
                          touched.selectedOpenUntilDate &&
                          errors.selectedOpenUntilDate
                        }
                      />
                    </FormControl>
                  </Grid>
                  {/* Offer Open Until */}

                  {/* Point of Contact*/}
                  <Typography
                    className={classes.sectionTitle}
                    style={{ marginBottom: 8 }}
                    variant="h5"
                  >
                    Point of Contact
                  </Typography>
                  <Typography
                    style={{
                      width: '100%',
                      paddingLeft: 8,
                      marginBottom: 27,
                      color: '#7b7b7b',
                    }}
                  >
                    If a party is interested in your offer, his queries will be sent to this
                    contact.
                  </Typography>
                  <Grid item xs={12} container>
                    <FormControl
                      style={{ width: 441 }}
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <TextField
                        onChange={handleEventInputWithValidation('emailContact', true)}
                        value={emailContact}
                        id="email"
                        variant="outlined"
                        type="email"
                        name="email"
                        label="Email"
                        error={!!errors.emailContact && touched.emailContact}
                        helperText={
                          errors.emailContact && touched.emailContact && errors.emailContact
                        }
                      />
                    </FormControl>
                    <FormGroup
                      style={{
                        width: '100%',
                        marginTop: 20,
                      }}
                      onChange={handleCheckedInputWithValidation('companyVisible', false)}
                      value={companyVisible}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={companyVisible} color="primary" />}
                        label="Keep my company name visible in my slot offer listing."
                      />
                    </FormGroup>
                  </Grid>
                  {/*Point of Contact */}
                  <Button
                    onClick={() => handleSubmit(openDialog())}
                    variant="contained"
                    color="primary"
                    style={{
                      zIndex: 1,
                      width: 217,
                      height: 47,
                      color: '#FFFF',
                      backgroundColor: '#00d1be',
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                    }}
                  >
                    Create Offer
                  </Button>
                </Grid>
              </form>
            </Paper>
          </section>
          {newState && (
            <ConfirmOfferDialog
              info={newState}
              open={isOpenConfirmOfferDialog}
              onClose={handleCloseConfirmOfferDialog}
            />
          )}
        </main>
      </MuiPickersUtilsProvider>
    </Layout>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    chosenLoadingPort: '',
    chosenDischargePort: '',
    emailContact: '',
    availableTEU: '',
    chosenService: '',
    selectedLoadingDate: '',
    selectedOpenUntilDate: '',
  }),
  validationSchema,
  handleSubmit: () => {},
})(CreateOffer);
