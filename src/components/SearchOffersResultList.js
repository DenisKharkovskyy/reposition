import React from 'react';

import { getTime, parseISO } from 'date-fns';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

import ImportExportIcon from '@material-ui/icons/ImportExport';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import OfferCardsList from 'components/OfferCardsList';

const useStyles = makeStyles({
  offersListRoot: {
    margin: '56px 24px',
  },
  buttonBox: {
    textTransform: 'none',
  },
  greenIconButton: {
    color: '#006960',
    background: 'rgba(3, 184, 168, 0.06)',
    width: 28,
    height: 28,
    borderRadius: '50%',
  },
  offersTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  offersDivider: {
    margin: '40px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'rgba(216, 216, 216, 0.68)',
  },
  dividerTitle: {
    margin: '15px 0px 6px',
  },
});

const SORT_CONSTANTS = [
  { label: 'TEU Price', sortBy: 'price_teu', type: 'number' },
  { label: 'FEU Price', sortBy: 'price_feu', type: 'number' },
  { label: 'Est. Departure', sortBy: 'etd_at', type: 'date' },
  { label: 'Est. Arrival', sortBy: 'eta_at', type: 'date' },
  {
    label: 'Origin Port Name',
    sortBy: 'origin_terminal',
    additionalSortField: 'port_name',
    type: 'custom',
  },
  {
    label: 'Destination Port Name',
    sortBy: 'destination_terminal',
    additionalSortField: 'port_name',
    type: 'custom',
  },
];

function SearchOffersResultList(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [{ offers }, setState] = React.useState(() => ({
    offers: [],
  }));

  React.useEffect(() => {
    props.offers &&
      setState(state => ({
        ...state,
        offers: props.showNewOffers ? [...props.offers.new, ...props.offers.current] : props.offers,
      }));
  }, [props.offers, props.showNewOffers]);

  function handleOpenSortMenu(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const sortByNumber = (list, sortField) => [...list.sort((a, b) => a[sortField] - b[sortField])];

  const sortByDate = (list, sortField) => [
    ...list.sort((a, b) => getTime(parseISO(a[sortField])) - getTime(parseISO(b[sortField]))),
  ];

  const sortByCustomMethod = (list, sortField, additionalSortField) =>
    additionalSortField
      ? [
          ...list.sort((a, b) => {
            const firstTitle = a[sortField][additionalSortField];
            const secondTitle = b[sortField][additionalSortField];

            if (firstTitle < secondTitle) {
              return -1;
            }
            if (firstTitle > secondTitle) {
              return 1;
            }
            return 0;
          }),
        ]
      : list;

  const handleSortResultsBy = ({ sortBy, type, additionalSortField = null }) => () => {
    if (props.showNewOffers) {
      props.handleHideNewOffers();
    }
    const sortList = () => {
      switch (type) {
        case 'number':
          return sortByNumber(offers, sortBy);
        case 'date':
          return sortByDate(offers, sortBy);
        case 'custom':
          return sortByCustomMethod(offers, sortBy, additionalSortField);
        default:
          return offers;
      }
    };

    setState(state => ({
      ...state,
      offers: sortList(),
    }));
    handleOpenSortMenu(null);
  };

  const openSortMenu = Boolean(anchorEl);
  return (
    <Grid className={classes.offersListRoot}>
      <Grid item container justify="space-between">
        <div className={classes.offersTitle}>
          <Typography>
            <strong>{offers.length}</strong> Offers available
          </Typography>
        </div>
        {!!offers.length && (
          <div className={classes.offersTitle}>
            <Button className={classes.buttonBox} color="primary" onClick={handleOpenSortMenu}>
              <ImportExportIcon className={classes.greenIconButton} />
              <Typography style={{ color: '#006960', marginLeft: 12 }}>Sort by</Typography>
            </Button>
            <Popper open={openSortMenu} anchorEl={anchorEl} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    {SORT_CONSTANTS.map(sortField => (
                      <MenuItem key={sortField.label} onClick={handleSortResultsBy(sortField)}>
                        {sortField.label}
                      </MenuItem>
                    ))}
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
        )}
      </Grid>
      <Grid item>
        {props.showNewOffers ? (
          <>
            <OfferCardsList isBrowseOfferPage offers={props.offers.new} />
            {!!props.offers.new.length && (
              <div className={classes.offersDivider}>
                <Grid container wrap="nowrap" alignContent="center" justify="center">
                  <Grid item xs={5} container alignContent="center" justify="center">
                    <div className={classes.divider} />
                  </Grid>
                  <Grid item xs={2} container alignContent="center" justify="center">
                    <CheckCircleOutlineOutlinedIcon
                      style={{ color: '#03b8a8', width: 30, height: 30 }}
                    />
                  </Grid>
                  <Grid item xs={5} container alignContent="center" justify="center">
                    <div className={classes.divider} />
                  </Grid>
                </Grid>
                <Typography variant="h6" className={classes.dividerTitle}>
                  You’re all caught up!
                </Typography>
                <Typography variant="subtitle1">
                  You’ve seen all the newest offers available for your search alert!
                </Typography>
              </div>
            )}
            <OfferCardsList isBrowseOfferPage offers={props.offers.current} />
          </>
        ) : (
          <OfferCardsList isBrowseOfferPage offers={offers} />
        )}
      </Grid>
    </Grid>
  );
}

export default SearchOffersResultList;
