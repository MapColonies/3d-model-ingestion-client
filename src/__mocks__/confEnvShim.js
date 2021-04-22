if (!window._env_) {
  window._env_ = (function (undefined) {
    return {
      LANGUAGE: 'en',
      MAP_SERVER: 'MAP_SERVER',
      PUBLISH_POINT: 'PUBLISH_POINT',
      CHANNEL: 1002,
      VERSION: 1,
      REQUEST: 'REQUEST',
      SERVICE_PROTOCOL: 'SERVICE_PROTOCOL',
      SERVICE_NAME: 'SERVICE_NAME',
      ACTIVE_LAYER: 'ACTIVE_LAYER',
      BBOX: {
        limit: 20000,
      },
      EXPORT: {
        defaultZoomLevel: 18,
        maxZoomLevel: 22
      },
      MAP: {
        center: [35.14, 31.39],
        zoom: 8,
      },
      ACTIVE_LAYER_PROPERTIES: {
        urlPattern : 'MAP_SERVER/service',
        exportUrlPattern: 'MAP_SERVER/service?REQUEST=REQUEST&SERVICE=SERVICE&LAYERS=LAYER',
        urlPatternParams: {
          service: 'SERVICE',
          layers: 'LAYER',
          tiled: 'TILED',
          matrixSet: 'MATRIXSET',
          style: 'STYLE',
          projection: 'PROJECTION'
        }
      },
    };
  })(void 0);
}
