import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';

import CheckCircle from '@material-ui/icons/CheckCircle';
import Clear from '@material-ui/icons/Clear';

import useApiContext from 'context/useApiContext';
import validationSchema from 'utils/validationSchemaNewPassword';

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

function NewPasswordDialog(props) {
  const { onClose, selectedValue, open, handleSubmit, errors, touched, handleBlur } = props;
  const classes = useStyles();
  const api = useApiContext();

  const [
    { currentPassword, newPassword, confirmPassword, snackBarOpen },
    setState,
  ] = React.useState(() => ({
    snackBarOpen: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

  const handleSubmitCLick = () => {
    if (Object.entries(props.errors).length === 0) {
      createNewPassword(currentPassword, newPassword);
    }
  };

  const createNewPassword = React.useCallback(
    async (currentPassword, newPassword) => {
      setState(state => ({
        ...state,
        initialized: true,
        loading: true,
      }));
      try {
        await api.put('/passwords/update_with_password', {
          data: {
            current_password: currentPassword,
            password: newPassword,
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
          style={{ position: 'absolute', right: 16, top: 16, zIndex: 1, color: '#909090' }}
        >
          <Clear />
        </Button>
        <Grid
          container
          item
          style={{ padding: '25px 50px', position: 'relative', margin: 0, width: 458 }}
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography style={{ fontSize: 21, textAlign: 'center' }}>
              Create New Password
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid style={{ marginTop: 30 }} item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Current password"
              value={currentPassword}
              name="currentPassword"
              type="password"
              onChange={handleEventInputWithValidation('currentPassword', true)}
              onBlur={handleBlur}
              variant="outlined"
              error={!!(errors.currentPassword && touched.currentPassword)}
              helperText={
                errors.currentPassword && touched.currentPassword && errors.currentPassword
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="New password"
              value={newPassword}
              name="newPassword"
              type="password"
              onChange={handleEventInputWithValidation('newPassword', true)}
              onBlur={handleBlur}
              variant="outlined"
              error={!!(errors.newPassword && touched.newPassword)}
              helperText={errors.newPassword && touched.newPassword && errors.newPassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              style={{ width: '100%' }}
              label="Confirm password"
              value={confirmPassword}
              name="confirmPassword"
              type="password"
              onChange={handleEventInputWithValidation('confirmPassword', true)}
              onBlur={handleBlur}
              variant="outlined"
              error={!!(errors.confirmPassword && touched.confirmPassword)}
              helperText={
                errors.confirmPassword && touched.confirmPassword && errors.confirmPassword
              }
            />
          </Grid>
        </Grid>

        <Grid
          container
          style={{
            width: 458,
            padding: '10px 50px',
            backgroundColor: 'rgba(216, 216, 216, 0.37)',
          }}
        >
          <Grid container justify="center" alignItems="center" item xs={2}>
            <CheckCircle style={{ color: '#006960' }} />
          </Grid>
          <Grid className={classes.text} item xs={10}>
            <Typography style={{ fontSize: 14 }}>
              Please make sure that your new password is strong enough to security your data.
            </Typography>
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex' }} item xs={12}>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={() => handleSubmit(handleSubmitCLick())}
          >
            Create New Password
          </Button>
        </Grid>
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        message={<span id="message-id">Password changed successfully</span>}
      />
    </>
  );
}

NewPasswordDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withFormik({
  mapPropsToValues: () => ({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }),
  validationSchema,
  handleSubmit: () => {},
})(withRouter(NewPasswordDialog));
