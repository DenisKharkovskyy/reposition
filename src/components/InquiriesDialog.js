import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';

import useApiContext from 'context/useApiContext';
import validationSchema from 'utils/validationSchemaContact';

const useStyles = makeStyles(theme => ({
  submitButton: {
    width: 217,
    height: 47,
    color: '#FFFF',
    backgroundColor: '#00d1be',
    alignSelf: 'center',
    margin: '20px auto',
  },
}));

function InquiriesDialog(props) {
  const { onClose, selectedValue, open, handleSubmit, errors, touched, handleBlur } = props;
  const classes = useStyles();
  const api = useApiContext();

  const [{ quantity, email, fullName, snackBarOpen }, setState] = React.useState(() => ({
    offerId: null,
    quantity: '',
    snackBarOpen: false,
    email: '',
    fullName: '',
  }));

  function handleOpenSnackBar() {
    setState(state => ({
      ...state,
      snackBarOpen: true,
    }));
  }

  function handleCloseSnackBar() {
    setState(state => ({ ...state, snackBarOpen: false }));
  }

  const sendInquiries = React.useCallback(
    async (fullName, email, quantity) => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));
      try {
        await api.post('inquiries/', {
          data: {
            full_name: fullName,
            email,
            quantity: Number(quantity),
            offer_id: props.offerId,
          },
        });
        setState(state => ({
          ...state,
          loading: false,
          loadError: null,
        }));
        handleOpenSnackBar();
        handleClose();
      } catch (err) {
        setState(state => ({
          ...state,
          loading: false,
          loadError: err,
        }));
      }
    },
    // eslint-disable-next-line
    [api, props.offerId]
  );

  const handleEventInputWithValidation = (name, withValidation) => event => {
    event.persist();
    setState(state => ({
      ...state,
      [name]: event.target.value,
    }));
    withValidation && props.setFieldValue(name, event.target.value);
  };

  function handleClose() {
    onClose(selectedValue);
  }
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Button
          onClick={handleClose}
          style={{ position: 'absolute', right: 26, top: 26, zIndex: 1 }}
        >
          <Clear />
        </Button>
        <Grid
          container
          item
          style={{ padding: '25px 50px', position: 'relative', margin: 0, width: 458 }}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography style={{ fontSize: 21, textAlign: 'center' }}>Contact</Typography>
            <Typography style={{ fontSize: 12, textAlign: 'center' }}>
              Send the contact details of the person who will be liaising with the shipping line on
              the request.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: 360 }}
              label="Full Name"
              value={fullName}
              name="name"
              onChange={handleEventInputWithValidation('fullName', true)}
              onBlur={handleBlur}
              variant="outlined"
              error={!!(errors.fullName && touched.fullName)}
              helperText={errors.fullName && touched.fullName && errors.fullName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: 360 }}
              label="Email"
              value={email}
              name="email"
              type="email"
              onChange={handleEventInputWithValidation('email', true)}
              onBlur={handleBlur}
              variant="outlined"
              error={!!(errors.email && touched.email)}
              helperText={errors.email && touched.email && errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: 360 }}
              label="Quantity in TEU (Optional)"
              value={quantity}
              name="Quantity"
              type="number"
              onChange={handleEventInputWithValidation('quantity', false)}
              onBlur={handleBlur}
              variant="outlined"
            />
          </Grid>
          <Grid style={{ display: 'flex' }} item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              onClick={() => handleSubmit(sendInquiries(fullName, email, quantity))}
            >
              Send details
            </Button>
          </Grid>
        </Grid>
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        message={<span id="message-id">Inquiries created successfully</span>}
      />
    </>
  );
}

InquiriesDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
    fullName: '',
  }),
  validationSchema,
  handleSubmit: () => {},
})(withRouter(InquiriesDialog));
