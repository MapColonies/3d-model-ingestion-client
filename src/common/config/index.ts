/*eslint-disable */
const LANGUAGE = (window as any)._env_.LANGUAGE;
const MAP_SERVER = (window as any)._env_.MAP_SERVER;
const PUBLISH_POINT = (window as any)._env_.PUBLISH_POINT;
const CHANNEL = (window as any)._env_.CHANNEL;
const VERSION = (window as any)._env_.VERSION;
const REQUEST = (window as any)._env_.REQUEST;
const SERVICE_PROTOCOL = (window as any)._env_.SERVICE_PROTOCOL;
const SERVICE_NAME = (window as any)._env_.SERVICE_NAME;
const ACTIVE_LAYER = (window as any)._env_.ACTIVE_LAYER;
const ACTIVE_LAYER_PROPERTIES = (window as any)._env_.ACTIVE_LAYER_PROPERTIES;
const EXPORT = (window as any)._env_.EXPORT;
const MAP = (window as any)._env_.MAP;
const BBOX = (window as any)._env_.BBOX;

const EXPORTER_CONFIG = {
  SERVICE_PROTOCOL: SERVICE_PROTOCOL,
  SERVICE_NAME: SERVICE_NAME,
  I18N: {
    DEFAULT_LANGUAGE: LANGUAGE,
  },
  BOUNDARIES: {
    AREA: BBOX.limit,
  },
  EXPORT: {
    AVG_TILE_SIZE_MB: 0.02,
    DEFAULT_ZOOM: EXPORT.defaultZoomLevel as number,
    MIN_ZOOM: 0,
    MAX_ZOOM: EXPORT.maxZoomLevel as number,
    METRIX_SET_FACTOR: 2,
    POLLING_CYCLE_INTERVAL: 3000,
    MAX_FRACTION_DIGITS: 5,
    SPLIT_CHARACTER: '.',
    EXPORT_URL: EXPORT.urlPattern,
  },
  MAP: {
    CENTER: MAP.center as [number, number],
    ZOOM: MAP.zoom as number,
    ZERO_ZOOM_LEVEL_RESOLUTION: 78271.52, // pixel_size_meters
    MAX_MIN_LONG_VALUE: 180,
    MAX_MIN_LAT_VALUE: 90,
  },
  ACTIVE_LAYER: ACTIVE_LAYER, // | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_DEFAULT'
  ACTIVE_LAYER_PROPERTIES: ACTIVE_LAYER_PROPERTIES,
  WMTS_LAYER: {
    ATTRIBUTIONS:
      `Tiles © <a href="${MAP_SERVER}/service?REQUEST=GetCapabilities">MapProxy</a>`,
    URL:
      `${ACTIVE_LAYER_PROPERTIES.urlPattern}`,
    LAYER: `${PUBLISH_POINT}`,
    MATRIX_SET: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.matrixSet}`,
    STYLE: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.style}`,
    PROJECTION: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.projection}`,
    FORMAT: `${ACTIVE_LAYER_PROPERTIES.urlPatternParams.format}`,
  },
  WMS_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${ACTIVE_LAYER_PROPERTIES.urlPattern}`,
    PARAMS: {...ACTIVE_LAYER_PROPERTIES.urlPatternParams},
    SERVERTYPE: 'geoserver',
    TRANSITION: 0.5,
  },
  XYZ_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${MAP_SERVER}/${PUBLISH_POINT}/query?request=${REQUEST}&channel=${CHANNEL}&version=${VERSION}&x={x}&y={y}&z={z}`,
  },
};

export default EXPORTER_CONFIG;
