import EXPORTER_CONFIG from '../config';

const getParamsString = (params: {[key: string]: string | boolean | number}) : string  => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const paramArray = Object.keys(params).map((key: string) => `${key}=${String(encodeURIComponent(params[key]))}`);
  return paramArray.join('&');
}

const fullUrls : {[key : string] : string} = {
  // TODO: 'WMS_LAYER': `${EXPORTER_CONFIG.WMS_LAYER.URL}?${getParamsString(EXPORTER_CONFIG.WMS_LAYER.PARAMS)}`,
  // eslint-disable-next-line
  'WMS_LAYER': EXPORTER_CONFIG.ACTIVE_LAYER_PROPERTIES.exportUrlPattern,
  // eslint-disable-next-line
  'WMTS_LAYER': EXPORTER_CONFIG.ACTIVE_LAYER_PROPERTIES.exportUrlPattern,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'XYZ_LAYER': EXPORTER_CONFIG.XYZ_LAYER.URL,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'OSM_DEFAULT': 'NOT_VALID_URL'
};

export const getExportLayerUrl = () : string => {
  const activeLayer = EXPORTER_CONFIG.ACTIVE_LAYER as string;
  return fullUrls[activeLayer];
}
