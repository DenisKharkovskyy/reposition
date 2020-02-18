import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Clear from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';

import useAuthContext from 'context/useAuthContext';

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
    margin: '20px auto',
  },
}));

function LogoutDialog(props) {
  const { onClose, selectedValue, open } = props;

  const classes = useStyles();
  const { logout } = useAuthContext();

  const handleLogoutClick = React.useCallback(async () => {
    await logout();
    props.history.push('/');
    // eslint-disable-next-line
  }, [logout]);

  function handleClose() {
    onClose(selectedValue);
  }
  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Button
          onClick={handleClose}
          style={{ position: 'absolute', right: 26, top: 26, zIndex: 1, color: '#909090' }}
        >
          <Clear />
        </Button>
        <Grid
          container
          item
          style={{ padding: '39px 58px', position: 'relative', margin: 0, width: 332 }}
        >
          <Grid item xs={12}>
            <Typography style={{ fontSize: 21, textAlign: 'center' }}>Logout</Typography>
            <Typography style={{ marginTop: 16, fontSize: 12, textAlign: 'center' }}>
              Are you sure you want to logout?
            </Typography>
          </Grid>
          <Grid style={{ display: 'flex' }} item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              onClick={handleLogoutClick}
            >
              Logout
            </Button>
          </Grid>
          <Grid style={{ display: 'flex' }} item xs={12}>
            <Button
              style={{ height: 50, color: '#03b8a8', backgroundColor: '#ffff', margin: 0 }}
              variant="contained"
              className={classes.submitButton}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}

LogoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withRouter(LogoutDialog);
