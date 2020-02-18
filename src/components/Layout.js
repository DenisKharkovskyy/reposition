import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useAuthContext from 'context/useAuthContext';
import WhiteTypography from './common/WhiteTypography';
import LogoutDialog from 'components/LogoutDialog';
import handHelloIcon from '../assets/img/hand_hello.svg';
import logo from '../assets/img/logo-white-blue.svg';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    background: '#f9f9f9',
    height: '100%',
  },
  header: {
    backgroundColor: '#03b8a8',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 80px',
  },
  tabRoot: {
    height: '100%',
    fontSize: 16,
    color: '#fff',
  },
  tabFixed: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  tabIndicator: {
    height: 8,
    backgroundColor: 'rgba(230, 250, 253, 0.72)',
  },
  profileWrapper: {
    display: 'flex',
  },
  profileTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 15,
  },
  logo: {
    backgroundImage: `url('${logo}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: 246,
    height: 39,
    paddingLeft: 50,
  },
  greenIconButton: {
    backgroundColor: 'rgba(3, 184, 168, 0.06)',
  },
  handHelloIcon: {
    color: '#03b8a8',
    width: 65,
    height: 65,
    backgroundImage: `url('${handHelloIcon}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  subtitleEmpty: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 500,
    margin: '20px 0',
  },
});

function Layout(props) {
  const classes = useStyles();

  const { profile } = useAuthContext();

  const menuRef = React.useRef();
  const [{ activeTab, menuAnchorEl, isOpenSnack }, setState] = React.useState(() => ({
    activeTab: profile.role === 'capacity' ? 'create-offer' : 'browse-offers',
    menuAnchorEl: null,
    isOpenSnack: false,
  }));

  const menuIsOpen = Boolean(menuAnchorEl);

  function logoutMenuHandler(event) {
    setState(state => ({ ...state, menuAnchorEl: menuRef.current }));
  }

  function closeMenuHandler() {
    setState(state => ({ ...state, menuAnchorEl: null }));
  }

  function handleChangeTabs(_, tab) {
    setState(state => ({ ...state, activeTab: tab }));
    // NOTE: setTimeout for tab animation
    setTimeout(() => props.history.push(tab), 300);
  }
  function handleOpenSnack() {
    setState(state => ({ ...state, isOpenSnack: true }));
  }

  function handleCloseSnack() {
    setState(state => ({ ...state, isOpenSnack: false }));
  }
  React.useEffect(() => {
    if (props.loadError) {
      handleOpenSnack();
    }
  }, [props.loadError]);

  React.useEffect(() => {
    const activeRoute = props.location.pathname;
    if (profile.role === 'capacity') {
      if (activeRoute === '/' || activeRoute === '/create-offer') {
        setState(state => ({ ...state, activeTab: 'create-offer' }));
      } else {
        setState(state => ({ ...state, activeTab: 'my-offers' }));
      }
    } else {
      if (activeRoute === '/' || activeRoute === '/browse-offers') {
        setState(state => ({ ...state, activeTab: 'browse-offers' }));
      } else {
        setState(state => ({ ...state, activeTab: 'search-alerts' }));
      }
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const [isOpenLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
    closeMenuHandler();
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
    closeMenuHandler();
  };

  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width > 1200 ? (
    <div className={classes.root}>
      <Snackbar
        open={isOpenSnack}
        onClose={handleCloseSnack}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Something went wrong</span>}
      />
      <header className={classes.header}>
        <Button>
          <Icon className={classes.logo} onClick={() => props.history.push('/')} />
        </Button>
        <Tabs
          classes={{
            root: classes.tabRoot,
            fixed: classes.tabFixed,
            indicator: classes.tabIndicator,
          }}
          onChange={handleChangeTabs}
          value={activeTab}
        >
          {profile.role === 'capacity'
            ? [
                <Tab
                  style={{ textTransform: 'none', fontSize: 16 }}
                  label="Create offer"
                  key="create-offer"
                  value="create-offer"
                />,
                <Tab
                  style={{ textTransform: 'none', fontSize: 16 }}
                  label="My offers"
                  key="my-offers"
                  value="my-offers"
                />,
              ]
            : [
                <Tab
                  style={{ textTransform: 'none', fontSize: 16 }}
                  label="Browse offers"
                  key="browse-offers"
                  value="browse-offers"
                />,
                <Tab
                  style={{ textTransform: 'none', fontSize: 16 }}
                  label="Search alerts"
                  key="search-alerts"
                  value="search-alerts"
                />,
              ]}
        </Tabs>
        {profile && (
          <div className={classes.profileWrapper}>
            <div className={classes.profileTitle} ref={menuRef}>
              <WhiteTypography>{`${profile.first_name} ${profile.last_name}`}</WhiteTypography>
              <WhiteTypography>{profile.company.name}</WhiteTypography>
            </div>
            <div>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={logoutMenuHandler}
              >
                <ArrowDropDownIcon style={{ color: '#fff' }} />
              </IconButton>
              <Popover
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                anchorEl={menuAnchorEl}
                open={menuIsOpen}
                onClose={closeMenuHandler}
              >
                <MenuItem to="/profile" component={Link} style={{ width: 203, height: 51 }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleOpenLogoutDialog} style={{ width: 203, height: 51 }}>
                  Logout
                </MenuItem>
              </Popover>
            </div>
            <LogoutDialog open={isOpenLogoutDialog} onClose={handleCloseLogoutDialog} />
          </div>
        )}
      </header>
      {props.children}
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '40%',
      }}
    >
      <Icon className={classes.handHelloIcon} />
      <Typography className={classes.subtitleEmpty} variant="h5">
        The app available only on laptop and desktop devices
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenLogoutDialog}
        style={{ width: 203, height: 51 }}
      >
        Logout
      </Button>
      <LogoutDialog open={isOpenLogoutDialog} onClose={handleCloseLogoutDialog} />
    </div>
  );
}

export default withRouter(Layout);
