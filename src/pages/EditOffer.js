import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';

import queryString from 'query-string';
import { withFormik } from 'formik';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import Chip from '@material-ui/core/Chip';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

import ArrowBack from '@material-ui/icons/ArrowBack';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';

import validationSchema from 'utils/validationSchema';
import useApiContext from 'context/useApiContext';

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
  const api = useApiContext();

  const [isOpenConfirmOfferDialog, setOpenConfirmOffer] = React.useState(false);

  const handleDeleteOffer = () => {
    setState(state => ({
      ...state,
      isDeleteOffer: true,
    }));
    openDeleteDialog();
  };

  const openDeleteDialog = () => {
    setState(state => ({
      ...state,
      newState: state,
    }));
    setOpenConfirmOffer(true);
  };

  const handleEditOffer = handleSubmit => {
    setState(state => ({
      ...state,
      isDeleteOffer: false,
    }));
    handleSubmit(openDialog());
  };

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
      availableTEU,
      VisibleAvailableTEU,
      OfferForSwap,
      OfferForSale,
      priceTEU,
      priceFEU,
      emailContact,
      companyVisible,
      EmptiesWantToCarry,
      selectedLoadingDate,
      selectedOpenUntilDate,
      selectedCompany,
      selectedDischargeDate,
      newState,
      companies,
      editOfferId,
      editOffer,
    },
    setState,
  ] = React.useState(() => ({
    chosenService: '',
    availableTEU: '',
    chosenLoadingPort: '',
    chosenDischargePort: '',
    VisibleAvailableTEU: false,
    OfferForSwap: false,
    OfferForSale: false,
    service_code: '',
    priceTEU: '',
    companies: null,
    priceFEU: '',
    emailContact: '',
    companyVisible: false,
    EmptiesWantToCarry: 'allCompanies',
    selectedLoadingDate: null,
    selectedOpenUntilDate: null,
    newState: null,
    selectedCompany: [],
    selectedDischargeDate: null,
    editOfferId: null,
    editOffer: null,
  }));

  const getOfferId = React.useCallback(
    async editOfferId => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));

      try {
        const res = await api.get(`offers/${editOfferId}`);
        setState(state => ({
          ...state,
          loading: false,
          loadError: null,
          editOffer: res.data.data,
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

  function handleChangeOpenUntilDate(date) {
    setState(state => ({
      ...state,
      selectedOpenUntilDate: date,
    }));
    props.setFieldValue('expireDate', date);
  }

  React.useEffect(() => {
    setState(state => ({
      ...state,
      editOfferId: queryString.parse(props.location.search).id,
    }));
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (editOfferId) {
      getOfferId(editOfferId);
      getCompanies();
    }
  }, [editOfferId, getOfferId, getCompanies]);

  const { errors, touched, handleBlur, handleSubmit } = props;

  React.useEffect(() => {
    if (editOffer) {
      setState(state => ({
        ...state,
        availableTEU: editOffer.nb_teu !== null ? editOffer.nb_teu : 0,
        priceTEU: editOffer.price_teu,
        priceFEU: editOffer.price_feu,
        OfferForSwap: editOffer.for_swap,
        OfferForSale: editOffer.for_sale,
        selectedOpenUntilDate: new Date(editOffer.expiry_offer_at),
        selectedDischargeDate: new Date(editOffer.etd_at),
        selectedLoadingDate: new Date(editOffer.eta_at),
        selectedCompany: editOffer.whitelist_owners,
        emailContact: editOffer.contact_email,
        VisibleAvailableTEU: editOffer.teu_visible,
        companyVisible: !!editOffer.company_name,
        EmptiesWantToCarry: 'selectedCompany',

        chosenService: {
          service_code: editOffer.service_code,
        },
        chosenLoadingPort: {
          terminal: editOffer.origin_terminal,
        },
        isEditOffer: true,
        chosenDischargePort: {
          terminal: editOffer.destination_terminal,
        },
      }));
      if (editOffer) {
      }
      props.setFieldValue('selectedOpenUntilDate', new Date(editOffer.expiry_offer_at));
      props.setFieldValue('availableTEU', editOffer.nb_teu);
      props.setFieldValue('availableTEU', editOffer.nb_teu);
      props.setFieldValue('emailContact', editOffer.contact_email);
      props.setFieldValue('chosenLoadingPort', editOffer.origin_terminal);
      props.setFieldValue('chosenDischargePort', editOffer.destination_terminal);
      props.setFieldValue('chosenService', editOffer.service_code);
      props.setFieldValue('selectedLoadingDate', new Date(editOffer.eta_at));
    }
    // eslint-disable-next-line
  }, [editOffer]);

  return (
    <Layout>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <main className={classes.content}>
          {editOffer && (
            <section style={{ position: 'relative' }}>
              <Link to="my-offers" style={{ textDecoration: 'none' }}>
                <Button
                  variant="text"
                  color="primary"
                  style={{ textTransform: 'none', marginBottom: 20, alignItems: 'normal' }}
                >
                  <ArrowBack />
                  <Typography style={{ marginLeft: 5 }} component="span" variant="subtitle1">
                    Back to My Offers
                  </Typography>
                </Button>
              </Link>
              <Typography style={{ marginBottom: 32, fontWeight: 600 }} variant="h4">
                Edit Offer Slot
              </Typography>
              <Button
                variant="text"
                color="primary"
                style={{
                  textTransform: 'none',
                  position: 'absolute',
                  right: 10,
                  top: 65,
                  alignItems: 'normal',
                }}
                onClick={handleDeleteOffer}
              >
                <DeleteOutlined />
                <Typography style={{ marginRight: 5 }} component="span" variant="subtitle1">
                  Delete Offer
                </Typography>
              </Button>
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
                        style={{ width: 440 }}
                        disabled
                        label="Service"
                        name="service"
                        variant="outlined"
                        value={editOffer.service_code}
                      />
                    </Grid>
                    {/* service */}

                    {/* port of loading */}
                    <Grid item xs={12} container>
                      <TextField
                        style={{ width: 440 }}
                        label="Port of Loading"
                        variant="outlined"
                        disabled
                        value={`${editOffer.origin_terminal.name} , ${editOffer.origin_terminal.port_name}`}
                      />

                      <KeyboardDatePicker
                        autoOk
                        style={{ marginLeft: 20, width: 191 }}
                        variant="inline"
                        inputVariant="outlined"
                        label="ETD"
                        value={selectedLoadingDate}
                        disabled
                        format="dd/MM/yyyy"
                        InputAdornmentProps={{ position: 'end' }}
                      />
                    </Grid>
                    {/* port of loading */}

                    {/* port of Discharge */}
                    <Grid item xs={12} container>
                      <TextField
                        style={{ width: 440 }}
                        disabled
                        label="Port of Discharge"
                        variant="outlined"
                        value={`${editOffer.destination_terminal.port_name}, ${editOffer.destination_terminal.name}`}
                      />
                      <KeyboardDatePicker
                        autoOk
                        style={{ marginLeft: 20, width: 191 }}
                        variant="inline"
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
                        name="priceTEU"
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
                          onChange={date => handleChangeOpenUntilDate(date)}
                          InputAdornmentProps={{ position: 'end' }}
                          error={!!(errors.expireDate && touched.expireDate)}
                          helperText={errors.expireDate && touched.expireDate && errors.expireDate}
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
                          control={
                            <Checkbox
                              value={companyVisible}
                              checked={companyVisible}
                              color="primary"
                            />
                          }
                          label="Keep my company name visible in my slot offer listing."
                        />
                      </FormGroup>
                    </Grid>
                    {/*Point of Contact */}
                    <Button
                      onClick={() => handleEditOffer(handleSubmit)}
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
                      Edit Offer
                    </Button>
                  </Grid>
                </form>
              </Paper>
            </section>
          )}
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
    portOfLoading: '',
    portOfDischarge: '',
    emailContact: '',
    availableTEU: '',
    service: '',
    dateOfLoading: '',
    expireDate: '',
  }),
  validationSchema,
  handleSubmit: () => {},
})(withRouter(CreateOffer));
