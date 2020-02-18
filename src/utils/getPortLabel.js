import { AREA_TITLE_CONSTANTS } from '../constants/areaTitles';

export default function getPortLabel(portDetails) {
  return (
    portDetails &&
    AREA_TITLE_CONSTANTS.reduce(
      (prevResult, currentKey) =>
        portDetails[currentKey] ? [...prevResult, portDetails[currentKey].name] : [...prevResult],
      []
    ).join(' > ')
  );
}
