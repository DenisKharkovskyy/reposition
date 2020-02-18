import React from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import WhiteTypography from 'components/common/WhiteTypography';

function renderInputComponent(inputProps) {
  const { classes, value, valueTitle, title, ...other } = inputProps;
  return (
    <div className={classes.inputWrapper}>
      <WhiteTypography smallFont className={classes.inputTitle}>
        {title}
      </WhiteTypography>
      <TextField
        className={classNames(classes.inputShared, classes.portInputs)}
        value={value}
        placeholder="Enter port, country or region"
        variant="outlined"
        {...other}
      />
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    width: 500,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
  inputWrapper: {
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
}));

export default function IntegrationAutosuggest(props) {
  const classes = useStyles();

  const [stateSuggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(props.searchResults);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  React.useEffect(() => {
    props.searchResults.length && setSuggestions(props.searchResults);
  }, [props.searchResults]);

  const handleChange = (event, { newValue }) => {
    props.handleInput(props.valueTitle)(newValue);
  };

  function onSuggestionSelected(event, { suggestion }) {
    props.handleInput(props.valueTitle, suggestion)(suggestion.selectedLabel);
  }

  const autosuggestProps = {
    renderInputComponent: props => renderInputComponent(props),
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
    onSuggestionSelected,
  };

  return (
    <Autosuggest
      {...autosuggestProps}
      inputProps={{
        classes,
        placeholder: 'Enter port, country or region',
        value: props.value,
        onChange: handleChange,
        title: props.title,
      }}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
      }}
      renderSuggestionsContainer={options => (
        <Paper {...options.containerProps}>{options.children}</Paper>
      )}
    />
  );
}
