import React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/core/Slider';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import searchAlertIcon from '../assets/img/search-alert.svg';

const useStyles = makeStyles({
  filtersWrapper: {
    backgroundColor: '#f9f9f9',
    width: 340,
  },
  filtersBlock: {
    padding: '50px 8px 60px 60px',
    width: 256,
  },
  filtersOpacity: {
    opacity: 0.5,
  },
  filtersTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  filterOptionsShared: {
    marginTop: 30,
  },
  filterTitleShared: {
    fontWeight: 500,
    margin: '20px 0px',
  },
  isChecked: { color: '#03b8a8' },
  divider: {
    marginRight: 24,
    marginTop: 20,
    height: 1,
    backgroundColor: 'rgba(123, 123, 123, 0.4)',
  },
  createAlertBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 241,
    height: 148,
    borderRadius: 4,
    border: 'solid 1px rgba(123,123,123, 0.1)',
    backgroundColor: 'rgba(170, 170, 170, 0.1)',
    marginBottom: 24,
  },
  searchAlertIcon: {
    background: `url('${searchAlertIcon}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: 80,
    height: 70,
    marginRight: -15,
  },
  searchAlertText: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 24,
    width: 208,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  searchAlertButton: {
    backgroundColor: '#00d1be',
    color: '#fff',
    fontSize: 13,
    boxShadow: '2px 2px 4px 0 rgba(175, 175, 175, 0.5)',
    width: 208,
    height: 48,
  },
});

const PriceSlider = withStyles({
  root: {
    color: '#03b8a8',
    height: 8,
    width: 236,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -10,
    marginLeft: -10,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 5,
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider);

const DateSlider = withStyles({
  root: {
    color: '#03b8a8',
    height: 5,
    padding: '13px 0',
    width: 216,
    marginLeft: 10,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -10,
    marginLeft: -13,
    boxShadow: '#ebebeb 0px 2px 2px',
    '&:focus,&:hover,&$active': {
      boxShadow: '#ccc 0px 2px 3px 1px',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
    '&>span': {
      width: 100,
      transform: 'none',
      borderRadius: 5,
      '&>span': {
        transform: 'none',
      },
    },
  },
  track: {
    height: 5,
  },
  rail: {
    color: '#d8d8d8',
    opacity: 1,
    height: 5,
  },
})(Slider);

export default function SearchOffersFilters({
  filterOptions: {
    showSale,
    showSlotSwap,
    showWithoutPrice,
    maxTeuPrice,
    maxFeuPrice,
    minFeuPrice,
    selectedCompanies,
    etaDates,
    daysRange,
    etaValues,
    etaMinDate,
    etaMaxDate,
    EmptiesWantToCarry,
  },
  initialFilterOptions,
  filtersAreNotBlur,
  companyList,
  handleCheckboxes,
  handlePrice,
  handleChangeCompaniesSelector,
  handleChangeMultipleSelector,
  handleResetFilters,
  handleDateSlider,
  handleOpenCreateAlert,
}) {
  const classes = useStyles();

  function formattedValue(value) {
    return format(addDays(etaDates[0], value), 'd MMM yyyy');
  }

  return (
    <div className={classes.filtersWrapper}>
      <div className={classes.filtersBlock}>
        {filtersAreNotBlur && (
          <div className={classes.createAlertBox}>
            <div className={classes.searchAlertText}>
              <Typography>Don't see what you're looking for?</Typography>
              <div className={classes.searchAlertIcon} />
            </div>
            <Button onClick={handleOpenCreateAlert} className={classes.searchAlertButton}>
              Create Search Alert
            </Button>
          </div>
        )}
        <div
          style={{
            opacity: filtersAreNotBlur ? 1 : 0.5,
            pointerEvents: filtersAreNotBlur ? 'all' : 'none',
          }}
        >
          <div className={classes.filtersTopBar}>
            <Typography variant="body1" style={{ color: '#7b7b7b' }}>
              Filter by
            </Typography>
            {filtersAreNotBlur && (
              <Button
                style={{ color: '#006960', textTransform: 'none' }}
                onClick={handleResetFilters}
              >
                Reset all
              </Button>
            )}
          </div>
          <div className={classes.filterOptionsShared}>
            <Typography className={classes.filterTitleShared}>OFFER OPTIONS</Typography>
            <FormGroup style={{ marginTop: 20 }}>
              <FormControlLabel
                style={{ height: 30, fontSize: 14 }}
                control={
                  <Checkbox
                    classes={{ checked: filtersAreNotBlur && classes.isChecked }}
                    color="default"
                    checked={showSale}
                    onChange={handleCheckboxes('showSale')}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                  />
                }
                label={<Typography variant="body2" children="Show offers for sale" />}
              />
              <FormControlLabel
                style={{ height: 30 }}
                control={
                  <Checkbox
                    classes={{ checked: filtersAreNotBlur && classes.isChecked }}
                    color="default"
                    checked={showSlotSwap}
                    onChange={handleCheckboxes('showSlotSwap')}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                  />
                }
                label={<Typography variant="body2" children="Show offers for slot swap" />}
              />
            </FormGroup>
            <div className={classes.divider} />
          </div>
          <div className={classes.filterOptionsShared}>
            <Typography className={classes.filterTitleShared}>PRICE</Typography>
            <Typography gutterBottom variant="body2" style={{ color: '#7b7b7b' }}>
              US$ {maxTeuPrice} per TEU
            </Typography>
            <PriceSlider
              style={{ color: filtersAreNotBlur ? '#03b8a8' : '#8a8a8a' }}
              valueLabelDisplay="off"
              value={maxTeuPrice}
              onChange={handlePrice('maxTeuPrice')}
              min={0}
              max={1000}
            />
            <Typography gutterBottom variant="body2" style={{ color: '#7b7b7b' }}>
              US$ {maxFeuPrice} per FEU
            </Typography>
            <PriceSlider
              style={{ color: filtersAreNotBlur ? '#03b8a8' : '#8a8a8a' }}
              valueLabelDisplay="off"
              value={maxFeuPrice}
              onChange={handlePrice('maxFeuPrice')}
              min={0}
              max={1600}
            />
            <FormGroup style={{ marginTop: 20 }}>
              <FormControlLabel
                style={{ height: 30 }}
                control={
                  <Checkbox
                    classes={{ checked: filtersAreNotBlur && classes.isChecked }}
                    color="default"
                    checked={showWithoutPrice}
                    onChange={handleCheckboxes('showWithoutPrice')}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                  />
                }
                label={<Typography variant="body2" children="Show offers without price" />}
              />
            </FormGroup>
            <div className={classes.divider} />
          </div>
          <div className={classes.filterOptionsShared}>
            <Typography className={classes.filterTitleShared}>EST. ARRIVAL DATE</Typography>
            <Typography gutterBottom style={{ color: '#7b7b7b' }}>
              {format(startOfDay(addDays(etaDates[0], etaValues[0])), 'd MMM yyyy')} -{' '}
              {format(endOfDay(addDays(etaDates[0], etaValues[1])), 'd MMM yyyy')}
              {/* {format(new Date(), 'd MMM yyyy')} - {format(addDays(new Date(), 182), 'd MMM yyyy')} */}
            </Typography>
            <DateSlider
              style={{ color: filtersAreNotBlur ? '#03b8a8' : '#8a8a8a' }}
              defaultValue={[0, daysRange]}
              min={0}
              max={182}
              value={etaValues}
              onChange={handleDateSlider}
              valueLabelDisplay="auto"
              valueLabelFormat={formattedValue}
            />
            <div className={classes.divider} />
          </div>
          <div className={classes.filterOptionsShared}>
            <Typography className={classes.filterTitleShared}>SHIPPING LINES</Typography>
            <div>
              <RadioGroup
                value={EmptiesWantToCarry}
                onChange={handleChangeCompaniesSelector}
                aria-label="position"
                name="position"
                row
              >
                <FormControlLabel
                  value="allCompanies"
                  style={{ fontSize: 12 }}
                  control={<Radio color="primary" />}
                  label="All Companies"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="selectedCompany"
                  control={<Radio color="primary" />}
                  label="Select Companies"
                  labelPlacement="end"
                />
              </RadioGroup>
            </div>
            {!!(EmptiesWantToCarry === 'selectedCompany') && (
              <FormControl>
                <Select
                  multiple
                  displayEmpty
                  value={selectedCompanies}
                  onChange={handleChangeMultipleSelector}
                  MenuProps={{
                    style: {
                      maxHeight: 400,
                      width: 230,
                      display: 'flex',
                    },
                  }}
                  input={
                    <OutlinedInput style={{ width: 230, display: 'flex', flexWrap: 'wrap' }} />
                  }
                  renderValue={selected =>
                    (!!selected.length && (
                      <div className={classes.chips}>
                        {selected.map(value => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>
                    )) ||
                    'All companies'
                  }
                >
                  {companyList.map(item => (
                    <MenuItem
                      style={{ padding: '15px 15px 0', width: '100%' }}
                      key={item.id}
                      value={item.name}
                    >
                      <Checkbox checked={selectedCompanies.indexOf(item.name) !== -1} />
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
