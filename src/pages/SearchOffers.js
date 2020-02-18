import React from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Autocomplete from 'components/Autocomplete';
import queryString from 'query-string';

import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';

import DateFnsUtils from '@date-io/date-fns';
import min from 'date-fns/min';
import max from 'date-fns/max';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import addDays from 'date-fns/addDays';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

import WhiteTypography from 'components/common/WhiteTypography';
import SearchOffersFilters from 'components/SearchOffersFilters';
import SearchOffersResultList from 'components/SearchOffersResultList';
import SearchAlertCreateDialog from 'components/SearchAlertCreateDialog';
import useApiContext from 'context/useApiContext';
import handHelloIcon from '../assets/img/hand_hello.svg';
import useDebounce from 'utils/use-debounce';
import getPortLabel from 'utils/getPortLabel';
import { AREA_TITLE_CONSTANTS } from 'constants/areaTitles';

const useStyles = makeStyles({
  searchPanel: {
    height: 128,
    backgroundColor: '#006960',
    paddingLeft: 60,
    flexWrap: 'nowrap',
  },
  inputWrapper: {
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
  },
  suggestionList: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 500,
    height: 'auto',
    background: '#fff',
    display: 'flex',
  },
  inputTitle: {
    fontSize: 12,
    marginLeft: 16,
  },
  inputShared: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    height: 54,
  },
  portInputs: {
    width: 280,
  },
  datePickers: {
    width: 220,
  },
  searchButton: {
    width: 54,
    height: 54,
    marginTop: 24,
    borderRadius: 4,
    boxShadow: '2px 4px 10px 0 rgba(0, 0, 0, 0.14)',
    backgroundColor: '#03b8a8',
  },
  resultWrapper: {
    backgroundColor: '#fff',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  handHelloIcon: {
    color: '#03b8a8',
    width: 65,
    height: 65,
    margin: '140px 0px 30px',
    backgroundImage: `url('${handHelloIcon}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
});

function SearchOffers(props) {
  const classes = useStyles();
  const api = useApiContext();

  // NOTE:
  // ELD - Earliest loading date
  // LLD - latest loading date
  const [
    {
      origin,
      destination,
      ELD,
      LLD,
      companyList,
      offers,
      isLoading,
      initialFilterOptions,
      filterOptions,
      initialOffersList,
      showNewOffers,
      showCreateAlertDialog,
      selectedOrigin,
      selectedDestination,
      showSideBar,
    },
    setState,
  ] = React.useState(() => ({
    origin: '',
    destination: '',
    selectedOrigin: {
      selectedLabel: '',
    },
    selectedDestination: {
      selectedLabel: '',
    },
    ELD: null,
    LLD: null,
    companyList: [],
    offers: [],
    initialOffersList: { new: [], current: [] },
    initialFilterOptions: {},
    isLoading: false,
    loadingError: null,
    filterOptions: {
      minTeuPrice: 0,
      maxTeuPrice: 1000,
      minFeuPrice: 0,
      maxFeuPrice: 1600,
      showSale: true,
      showSlotSwap: true,
      showWithoutPrice: true,
      selectedCompanies: [],
      etaDates: [new Date(), addDays(new Date(), 182)],
      etaValues: [0, 182],
      daysRange: 1,
      EmptiesWantToCarry: 'allCompanies',
    },
    alertOfferId: null,
    showNewOffers: false,
    showCreateAlertDialog: false,
    showSideBar: false,
  }));

  const getOffers = React.useCallback(
    async ({ selectedOrigin, selectedDestination, ELD, LLD }) => {
      setState(state => ({
        ...state,
        isLoading: true,
      }));

      // NOTE search request should be send only after typing ORIGIN, DESTINATION, ELD, LLD
      try {
        const offers = await api.get(
          `/offers?origin_${selectedOrigin.type.toLowerCase()}_id=${
            selectedOrigin.id
          }&destination_${selectedDestination.type.toLowerCase()}_id=${
            selectedDestination.id
          }&start_loading_on=${ELD.toISOString()}&end_loading_on=${LLD.toISOString()}`
        );
        const newOffers = offers.data.data.new ? offers.data.data.new : [];
        const currentOffers = offers.data.data.current ? offers.data.data.current : [];
        setState(state => ({
          ...state,
          isLoading: false,
          loadingError: null,
          offers: [...newOffers, ...currentOffers],
          initialOffersList: {
            new: [...newOffers],
            current: [...currentOffers],
          },
          showNewOffers: true,
          showSideBar: true,
        }));
      } catch (err) {
        setState(state => ({
          ...state,
          isLoading: false,
          loadingError: err,
        }));
        return;
      }
    },
    [api]
  );

  const getOffersById = React.useCallback(
    async id => {
      setState(state => ({
        ...state,
        isLoading: true,
      }));

      try {
        const alertsOffers = await api.get(`/search_alerts/${id}/offers`);
        const newAlertOffers = alertsOffers.data.data.new ? alertsOffers.data.data.new : [];
        const currentAlertOffers = alertsOffers.data.data.current
          ? alertsOffers.data.data.current
          : [];
        setState(state => ({
          ...state,
          isLoading: false,
          loadingError: null,
          offers: [...newAlertOffers, ...currentAlertOffers],
          initialOffersList: {
            new: [...newAlertOffers],
            current: [...currentAlertOffers],
          },
          showNewOffers: true,
          showSideBar: true,
        }));
      } catch (err) {
        setState(state => ({
          ...state,
          isLoading: false,
          loadingError: err,
        }));
        return;
      }
    },
    [api]
  );

  const getCompanies = React.useCallback(async () => {
    setState(state => ({
      ...state,
      initialized: true,
      isLoading: true,
    }));

    try {
      const companyList = await api.get('companies/');
      setState(state => ({
        ...state,
        isLoading: false,
        loadingError: null,
        companyList: companyList.data.data,
        filterOptions: {
          ...state.filterOptions,
          selectedCompanies: companyList.data.data.map(item => item.name),
        },
      }));
    } catch (err) {
      setState(state => ({
        ...state,
        isLoading: false,
        loadingError: err,
      }));
      return;
    }
  }, [setState, api]);

  React.useEffect(() => {
    const alertOfferId = queryString.parse(props.location.search).id;
    if (alertOfferId) {
      getOffersById(alertOfferId);
      setState(state => ({
        ...state,
        alertOfferId: queryString.parse(props.location.search).id,
      }));
    }
    getCompanies();
  }, [
    getOffers,
    getCompanies,
    getOffersById,
    selectedDestination,
    selectedOrigin,
    ELD,
    LLD,
    props.location.search,
  ]);

  React.useEffect(() => {
    if (
      (!!initialOffersList.new.length || !!initialOffersList.current.length) &&
      !!companyList.length
    ) {
      setInitialFilters();
    }
    // eslint-disable-next-line
  }, [initialOffersList.new, initialOffersList.current, companyList]);

  React.useEffect(
    () => {
      updateFilters();
    },
    // eslint-disable-next-line
    [
      filterOptions.showSale,
      filterOptions.showSlotSwap,
      filterOptions.showWithoutPrice,
      filterOptions.maxFeuPrice,
      filterOptions.maxTeuPrice,
      filterOptions.selectedCompanies,
      filterOptions.etaValues,
    ]
  );

  const debouncedSearchOrigin = useDebounce(origin, 300);
  const debouncedSearchDestination = useDebounce(destination, 300);

  const [searchResults, setResults] = React.useState([]);
  const [searchDestinationResults, setDestinationResults] = React.useState([]);

  const getLocations = React.useCallback(
    async queryStringParams => {
      const res = await api.get(`/locations?kw=${queryStringParams}`);
      return res.data;
    },
    [api]
  );

  React.useEffect(() => {
    if (
      debouncedSearchOrigin &&
      debouncedSearchOrigin.length > 2 &&
      debouncedSearchOrigin !== selectedOrigin.selectedLabel
    ) {
      getLocations(debouncedSearchOrigin).then(data => setResults(data.data));
    } else {
      setResults([]);
    }
    // eslint-disable-next-line
  }, [debouncedSearchOrigin]);

  React.useEffect(() => {
    if (
      debouncedSearchDestination &&
      debouncedSearchDestination.length > 2 &&
      debouncedSearchDestination !== selectedDestination.selectedLabel
    ) {
      getLocations(debouncedSearchDestination).then(data => setDestinationResults(data.data));
    } else {
      setDestinationResults([]);
    }
    // eslint-disable-next-line
  }, [debouncedSearchDestination]);

  function handleChangeDate(date, dateField) {
    setState(state => ({ ...state, [dateField]: date }));
  }

  const handleCommonInput = (title, selectedLocation) => newValue => {
    const newStateValues = { [title]: newValue };
    if (selectedLocation) {
      newStateValues[title === 'origin' ? 'selectedOrigin' : 'selectedDestination'] = {
        ...selectedLocation,
      };
      setResults([]);
      setDestinationResults([]);
    }

    setState(state => ({ ...state, ...newStateValues }));
  };

  function handleChangeMultipleSelector(event) {
    event.persist();
    setState(state => ({
      ...state,
      filterOptions: { ...state.filterOptions, selectedCompanies: event.target.value },
    }));
    handleHideNewOffers();
  }

  function handleChangeCompaniesSelector(event) {
    event.persist();
    setState(state => ({
      ...state,
      filterOptions: {
        ...state.filterOptions,
        EmptiesWantToCarry: event.target.value,
        selectedCompanies: companyList.map(item => item.name),
      },
    }));
    handleHideNewOffers();
  }

  const handleCheckboxes = title => event => {
    const inputValue = event.target.checked;
    setState(state => ({
      ...state,
      filterOptions: { ...state.filterOptions, [title]: inputValue },
    }));
    handleHideNewOffers();
  };

  const handlePrice = title => (event, newValue) => {
    setState(state => ({
      ...state,
      filterOptions: { ...state.filterOptions, [title]: newValue },
    }));
    handleHideNewOffers();
  };

  const handleDateSlider = (event, newValue) => {
    setState(state => ({
      ...state,
      filterOptions: { ...state.filterOptions, etaValues: newValue },
    }));
    handleHideNewOffers();
  };

  const setInitialFilters = () => {
    const allTeuPrices = offers.map(el => el.price_teu);
    const allFeuPrices = offers.map(el => el.price_feu);
    const allEtaDates = offers.map(el => parseISO(el.eta_at));

    const minTeuPrice = Math.min.apply(null, allTeuPrices);
    const maxTeuPrice = 1000;
    //const maxTeuPrice = Math.max.apply(null, allTeuPrices);
    const minFeuPrice = Math.min.apply(null, allFeuPrices);
    // const maxFeuPrice = Math.max.apply(null, allFeuPrices);
    const maxFeuPrice = 1600;

    const minEta = min(allEtaDates);
    const maxEta = max(allEtaDates);
    const daysRange = differenceInCalendarDays(maxEta, minEta);

    const initialFilterOptions = {
      minTeuPrice,
      maxTeuPrice,
      minFeuPrice,
      maxFeuPrice,
      showSale: true,
      showSlotSwap: true,
      showWithoutPrice: true,
      EmptiesWantToCarry: 'allCompanies',
      selectedCompanies: filterOptions.selectedCompanies,
      etaDates: [minEta, maxEta],
      etaValues: [0, 182],
      daysRange,
    };

    setState(state => ({
      ...state,
      filterOptions: { ...initialFilterOptions },
      initialFilterOptions,
    }));
  };

  const updateFilters = () => {
    function setValues(offersList) {
      setState(state => ({ ...state, offers: offersList }));
    }

    const {
      maxTeuPrice,
      maxFeuPrice,
      showSale,
      showSlotSwap,
      showWithoutPrice,
      selectedCompanies,
      etaValues,
      etaDates,
    } = filterOptions;

    const [etaMinDate, etaMaxDate] = etaValues.map((date, index) =>
      index === 0 ? startOfDay(addDays(etaDates[0], date)) : endOfDay(addDays(etaDates[0], date))
    );

    return setValues(
      [...initialOffersList.new, ...initialOffersList.current]
        .filter(offer => {
          if (showSale && showSlotSwap) {
            return true;
          } else if (!showSale && showSlotSwap) {
            return offer.for_swap;
          } else if (showSale && !showSlotSwap) {
            return offer.for_sale;
          }
          return false;
        })
        .filter(offer => (showWithoutPrice ? offer : offer.price_teu > 0 && offer.price_feu > 0))
        .filter(offer =>
          selectedCompanies.length > 0 ? selectedCompanies.includes(offer.company_name) : offer
        )
        .filter(offer => offer.price_feu <= maxFeuPrice || offer.price_teu <= maxTeuPrice)
        .filter(offer => {
          const parsedDate = parseISO(offer.eta_at);
          return isBefore(parsedDate, etaMaxDate) && isAfter(parsedDate, etaMinDate);
        })
    );
  };

  async function handleHideNewOffers() {
    if (showNewOffers) {
      await setState(state => ({ ...state, showNewOffers: false }));
    }
  }

  function handleResetFilters() {
    setState(state => ({
      ...state,
      filterOptions: { ...initialFilterOptions },
      offers: [...initialOffersList.new, ...initialOffersList.current],
    }));
  }

  function renderInputWithTitle(inputNode, inputTitle) {
    return (
      <div className={classes.inputWrapper}>
        <WhiteTypography smallFont className={classes.inputTitle}>
          {inputTitle}
        </WhiteTypography>
        {inputNode}
      </div>
    );
  }

  function renderOriginPortInput({ value, valueTitle, title }) {
    const handledSearchResult = searchResults.slice(0, 5).map(result => ({
      id: result[[...AREA_TITLE_CONSTANTS].reverse().find(key => result[key] && result[key].id)].id,
      selectedLabel:
        result[[...AREA_TITLE_CONSTANTS].reverse().find(key => result[key] && result[key].id)].name,
      label: getPortLabel(result),
      type: result.type,
    }));

    return (
      <Autocomplete
        value={value}
        valueTitle={valueTitle}
        title={title}
        handleInput={handleCommonInput}
        searchResults={handledSearchResult}
      />
    );
  }

  function renderDestinationPortInput({ value, valueTitle, title }) {
    const handledSearchResult = searchDestinationResults.slice(0, 5).map(result => ({
      id: result[[...AREA_TITLE_CONSTANTS].reverse().find(key => result[key] && result[key].id)].id,
      selectedLabel:
        result[[...AREA_TITLE_CONSTANTS].reverse().find(key => result[key] && result[key].id)].name,
      label: getPortLabel(result),
      type: result.type,
    }));

    return (
      <Autocomplete
        value={value}
        valueTitle={valueTitle}
        title={title}
        handleInput={handleCommonInput}
        searchResults={handledSearchResult}
      />
    );
  }

  function renderDatePicker({ value, valueTitle, title }) {
    return renderInputWithTitle(
      <KeyboardDatePicker
        className={classNames(classes.inputShared, classes.datePickers)}
        value={value}
        onChange={date => handleChangeDate(date, valueTitle)}
        autoOk
        variant="filled"
        inputVariant="outlined"
        placeholder="Select Date"
        format="d MMM yyyy"
        InputAdornmentProps={{ position: 'end' }}
        disablePast
      />,
      title
    );
  }

  function renderOffersList(props) {
    return showNewOffers ? (
      <SearchOffersResultList {...props} offers={initialOffersList} />
    ) : (
      <SearchOffersResultList {...props} offers={offers} />
    );
  }

  function handleOpenCreateAlert() {
    setState(state => ({ ...state, showCreateAlertDialog: true }));
  }

  function handleCloseCreateAlertDialog() {
    setState(state => ({ ...state, showCreateAlertDialog: false }));
  }

  const filtersAreNotBlur = !![...initialOffersList.new, ...initialOffersList.current].length;

  return (
    <Layout>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="column">
          <Grid
            item
            container
            className={classes.searchPanel}
            alignItems="center"
            justify="space-around"
          >
            {renderOriginPortInput({ value: origin, valueTitle: 'origin', title: 'Origin' })}
            {renderDestinationPortInput({
              value: destination,
              valueTitle: 'destination',
              title: 'Destination',
            })}
            {renderDatePicker({ value: ELD, valueTitle: 'ELD', title: 'Earliest Loading Date' })}
            {renderDatePicker({ value: LLD, valueTitle: 'LLD', title: 'Latest Loading Date' })}
            <Button
              onClick={() => getOffers({ selectedOrigin, selectedDestination, ELD, LLD })}
              className={classes.searchButton}
            >
              <SearchIcon style={{ color: '#fff' }} />
            </Button>
          </Grid>
          <Grid item container wrap="nowrap">
            <SearchOffersFilters
              filterOptions={filterOptions}
              initialFilterOptions={initialFilterOptions}
              companyList={companyList}
              filtersAreNotBlur={showSideBar}
              handleCheckboxes={handleCheckboxes}
              handlePrice={handlePrice}
              handleChangeMultipleSelector={handleChangeMultipleSelector}
              handleResetFilters={handleResetFilters}
              handleDateSlider={handleDateSlider}
              handleOpenCreateAlert={handleOpenCreateAlert}
              handleChangeCompaniesSelector={handleChangeCompaniesSelector}
            />
            <div className={classes.resultWrapper}>
              {filtersAreNotBlur ? (
                renderOffersList({
                  loading: isLoading,
                  handleHideNewOffers,
                  showNewOffers,
                })
              ) : (
                <>
                  <Icon className={classes.handHelloIcon} />
                  {showSideBar && !filtersAreNotBlur ? (
                    <Typography style={{ color: 'rgba(0, 0, 0, 0.87)' }} variant="h6">
                      There are no offers which match your search criteria
                    </Typography>
                  ) : (
                    <>
                      <Typography style={{ color: 'rgba(0, 0, 0, 0.87)' }} variant="h6">
                        Welcome to Reposition.IT
                      </Typography>
                      <Typography style={{ color: '#7b7b7b' }} variant="body1">
                        Enter your search criteria to begin browsing related offers!
                      </Typography>
                    </>
                  )}
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <SearchAlertCreateDialog
        showCreateAlertDialog={showCreateAlertDialog}
        handleCloseCreateAlertDialog={handleCloseCreateAlertDialog}
        selectedOrigin={selectedOrigin}
        selectedDestination={selectedDestination}
        ELD={ELD}
        LLD={LLD}
        filterOptions={filterOptions}
      />
    </Layout>
  );
}

export default withRouter(SearchOffers);
