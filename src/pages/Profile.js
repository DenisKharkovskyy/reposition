import React from 'react';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import Done from '@material-ui/icons/Done';

import useAuthContext from 'context/useAuthContext';
import Layout from 'components/Layout';
import NewPasswordDialog from 'components/NewPasswordDialog';

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
    padding: 40,
    marginBottom: 20,
  },
  textField: {
    width: 441,
    marginBottom: 25,
  },
}));

const Profile = props => {
  const classes = useStyles();
  const { profile } = useAuthContext();

  const [isOpenNewPasswordDialog, setOpenNewPasswordDialog] = React.useState(false);

  const handleCloseNewPasswordDialog = () => {
    setOpenNewPasswordDialog(false);
  };

  const handleOpenNewPasswordDialog = offerId => {
    setOpenNewPasswordDialog(true);
  };

  return (
    <Layout>
      <main className={classes.content}>
        <section>
          <Typography style={{ marginBottom: 32, fontWeight: 600 }} variant="h4">
            My Profile
          </Typography>
          <Paper className={classes.paper}>
            <form className={classes.form} noValidate>
              <Typography style={{ width: '100%', textAlign: 'end' }} variant="h3">
                {profile.company.name}
              </Typography>
              <Grid container style={{ margin: '34px 0', position: 'relative' }} spacing={2}>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    label="Full name"
                    value={`${profile.first_name} ${profile.last_name}`}
                    name="fullName"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <Done style={{ color: '#006960' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    label="Role"
                    value={profile.role}
                    name="role"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <Done style={{ color: '#006960' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    className={classes.textField}
                    label="email"
                    value={profile.email}
                    name="email"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <Done style={{ color: '#006960' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    label="Mobile phone"
                    value={profile.mobile_phone}
                    name="mobilePhone"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <Done style={{ color: '#006960' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    className={classes.textField}
                    label="Password"
                    value="*********"
                    name="password"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <Done style={{ color: '#006960' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleOpenNewPasswordDialog}
                    variant="contained"
                    color="primary"
                    style={{
                      width: 217,
                      height: 47,
                      color: '#FFFF',
                      backgroundColor: '#00d1be',
                    }}
                  >
                    Change password
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography style={{ marginTop: 43 }} variant="h5">
                    Team
                  </Typography>
                </Grid>
                {profile.company.users &&
                  profile.company.users.map(teammate => (
                    <Grid key={teammate.last_name} item xs={12} container direction="row">
                      <Grid item xs={3}>
                        <Typography style={{ fontSize: 12, color: '#a8a8a8' }}>
                          FULL NAME
                        </Typography>
                        <Typography>
                          {teammate.first_name} {teammate.last_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </form>
          </Paper>
          <NewPasswordDialog
            open={isOpenNewPasswordDialog}
            onClose={handleCloseNewPasswordDialog}
          />
        </section>
      </main>
    </Layout>
  );
};

export default Profile;
