import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import useForm from 'react-hook-form';
import useAuthContext from 'context/useAuthContext';

import bgTop from '../assets/img/bg-top.svg';
import logo from '../assets/img/logo.svg';
import arrow from '../assets/img/arrow.svg';
import port from '../assets/img/port.svg';
import ship from '../assets/img/ship.svg';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  topSection: {
    minHeight: '100vh',
    overflow: 'hidden',
  },
  secondSection: {
    minHeight: '50vh',
    overflow: 'hidden',
    position: 'relative',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: '100vh',
    backgroundImage: `url('${bgTop}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center 20%',
    flexDirection: 'column',
  },
  topRight: {
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  logo: {
    backgroundImage: `url('${logo}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: 235,
    height: 29,
  },
  arrow: {
    backgroundImage: `url('${arrow}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: 11,
    height: 22,
  },
  port: {
    margin: 0,
    position: 'absolute',
    zIndex: 2,
    left: '40%',
    bottom: 13,
    width: '100%',
    height: '100%',
    backgroundImage: `url('${port}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'bottom',
  },
  portSection: {
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    width: '70%',
    margin: '10px auto',
    position: 'relative',
    top: '20%',
    zIndex: 3,
    [theme.breakpoints.down('xs')]: {
      top: 0,
      width: '90%',
    },
  },
  ship: {
    margin: 0,
    position: 'absolute',
    zIndex: 2,
    left: '0%',
    bottom: 13,
    width: '100%',
    height: '100%',
    backgroundImage: `url('${ship}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'bottom',
  },
  startSection: {
    position: 'relative',
    minHeight: 315,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.6) 0%,rgba(255,255,255,0.6) 100%), url('${bgTop}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 10,
    maxWidth: 388,
  },
  submit: {
    width: 198,
    backgroundColor: '#00d1be',
    margin: '36px 25% 13px',
  },
}));

const LandingPage = () => {
  const { login } = useAuthContext();
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();
  const [loginLoading, setLoginLoading] = React.useState(false);

  const handleLoginClick = React.useCallback(
    async values => {
      try {
        setLoginLoading(true);
        await login(values);
        setLoginLoading(false);
      } catch (err) {
        setLoginLoading(false);
        alert(err.message);
      }
    },
    [login]
  );

  return (
    <>
      <div className={classes.root}>
        <Grid container className={classes.topSection}>
          <Grid className={classes.topLeft} item sm={12} md={8}>
            <Icon className={classes.logo} />
            <Typography
              style={{
                fontSize: 24,
                maxWidth: 455,
                lineHeight: 1.3,
                textAlign: 'center',
                margin: 20,
              }}
            >
              We match
              <Typography
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
                variant="caption"
              >
                {' '}
                unfilled vessel space{' '}
              </Typography>
              with
              <Typography
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
                variant="caption"
              >
                {' '}
                empty containers{' '}
              </Typography>
              that need to be repositioned.
            </Typography>
            <IconButton
              onClick={() =>
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth',
                })
              }
              variant="text"
            >
              <Typography style={{ fontSize: 12 }} color="primary" variant="subtitle1">
                learn more
              </Typography>
              <Icon className={classes.arrow} />
            </IconButton>
          </Grid>
          <Grid className={classes.topRight} item sm={12} md={4} elevation={6}>
            <div className={classes.paper} />
            <Typography component="h1" variant="h4">
              Welcome
            </Typography>
            <Typography style={{ color: '#7b7b7b' }} component="h2" variant="h6">
              Login to begin matching
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit(handleLoginClick)} noValidate>
              <TextField
                id="email"
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                margin="normal"
                variant="outlined"
                autoFocus
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
                inputRef={register({
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                required
                fullWidth
                error={!!errors.password}
                helperText={errors.password && errors.password.message}
                inputRef={register({
                  required: 'Required',
                  message: 'Invalid password',
                })}
              />
              <Grid container>
                <Grid item xs>
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                </Grid>
                <Grid style={{ margin: 'auto' }} item>
                  Forgot password?
                </Grid>
              </Grid>

              {!loginLoading ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
              ) : (
                <LinearProgress />
              )}
              <Typography align="center" style={{ fontSize: 16 }}>
                Don’t have an account?
                <Link
                  color="primary"
                  style={{ textDecoration: 'none', marginLeft: 5 }}
                  href="mailto:request-access@reposition.it"
                >
                  Request access
                </Link>
              </Typography>
            </form>
          </Grid>
        </Grid>
        <Grid container className={classes.secondSection}>
          <Grid style={{ backgroundColor: '#006960', position: 'relative' }} item sm={12} md={8}>
            <div className={classes.portSection}>
              <Typography variant="h4" style={{ color: 'rgba(255,255,255,.87)', fontWeight: 700 }}>
                Container owners and operators
              </Typography>
              <Typography
                variant="h5"
                style={{
                  color: 'rgba(255,255,255,.87)',
                  margin: '34px 0 22px',
                }}
              >
                Discover empty repositioning options between port pairs and dramatically reduce your
                repositioning costs.
              </Typography>
              <Link style={{ textDecoration: 'none' }} href="mailto:request-access@reposition.it">
                <Button style={{ maxWidth: 202 }} variant="contained">
                  Request access
                </Button>
              </Link>
            </div>
            <Icon className={classes.port} />
          </Grid>
          <Grid style={{ backgroundColor: '#f9f9f9' }} item sm={false} md={4} />
        </Grid>
        <Grid container className={classes.secondSection}>
          <Grid style={{ backgroundColor: '#f9f9f9' }} item sm={12} md={8} />
          <div
            style={{
              position: 'absolute',
              alignItems: 'flex-end',
              textAlign: 'end',
              right: '10%',
            }}
            className={classes.portSection}
          >
            <Typography variant="h4" style={{ color: 'rgba(0, 0, 0, 0.87)', fontWeight: 700 }}>
              Shipping lines
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: 'rgba(0, 0, 0, 0.87)',
                margin: '34px 0 22px',
                maxWidth: '400px',
              }}
            >
              Maximise vessel utilization and offer capacity at minimal marginal cost.
            </Typography>
            <Link style={{ textDecoration: 'none' }} href="mailto:request-access@reposition.it">
              <Button style={{ width: 202 }} variant="contained">
                Request access
              </Button>
            </Link>
          </div>
          <Grid style={{ backgroundColor: '#f9f9f9', position: 'relative' }} item sm={12} md={8} />
          <Icon className={classes.ship} />
        </Grid>

        <div className={classes.startSection}>
          <Typography variant="h4">Get started!</Typography>
          <Typography style={{ color: '#7b7b7b' }} component="h2" variant="h6">
            Login to begin matching
          </Typography>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link style={{ textDecoration: 'none' }} href="mailto:request-access@reposition.it">
              <Button style={{ width: 246, margin: 10 }} variant="contained">
                Request access
              </Button>
            </Link>
            <Button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#00d1be', width: 246, margin: 10 }}
            >
              Log in
            </Button>
          </div>
          <Typography align="center" style={{ fontSize: 16, marginTop: 24 }}>
            Got a question? Contact us at{' '}
            <a
              style={{ textDecoration: 'none', color: '#006960' }}
              href="mailto:support@reposition.it"
            >
              support@reposition.it
            </a>
          </Typography>
        </div>
        <div
          style={{
            height: 69,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '2%',
            background: 'black',
          }}
        >
          <Typography style={{ color: 'white' }}>
            2019
            <Link style={{ marginLeft: 5 }} color="primary" href="https://reposition.it/">
              Reposition.it
            </Link>
            . | All rights reserved
          </Typography>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
