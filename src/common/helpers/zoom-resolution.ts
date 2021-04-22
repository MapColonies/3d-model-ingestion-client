import EXPORTER_CONFIG from '../../common/config';

// const prettyFloat = (value: number, precision: number=0, localize: boolean=false): string => {
//   const rounded = (!isNaN(precision) && parseInt(precision.toString(), 10) > 0)
//       ? parseFloat(value.toString()).toFixed(parseInt(precision.toString(), 10))
//       : value;
//   const trimmed = parseFloat(rounded.toString()).toString();
//   if (localize) {
//       return parseFloat(trimmed).toLocaleString();
//   }
//   return trimmed;
// };

const getResolutionInMeteres = (zoomLevel: number): number | string => {
  // prettyFloat() might be used to trim trailing zeros
  // eslint-disable-next-line
  return (EXPORTER_CONFIG.MAP.ZERO_ZOOM_LEVEL_RESOLUTION / Math.pow(2, zoomLevel)).toFixed(3);
};

export { getResolutionInMeteres };
