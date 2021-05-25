/* eslint-disable camelcase */
import { types, Instance, flow, getParent, getSnapshot } from 'mobx-state-tree';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/ResponseState';
import { ExportStoreError } from '../../common/models/exportStoreError';
import EXPORTER_CONFIG from '../../common/config';
import { searchParams } from './search-params';
import { IRootStore } from './rootStore';
import { IExportTaskStatus } from './exportTaskStatus';
import { model } from 'mobx-state-tree/dist/internal';

export type ExportTaskStatusResponse = IExportTaskStatus[];
export interface ExportResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface ModelInfo {
  modelPath: string;
  tilesetFilename: string;
  identifier: string;
  typename: string;
  schema: string;
  mdSource: string;
  xml: string;
  anytext: string;
  insertDate: Date;
  creationDate?: Date;
  validationDate?: Date;
  wktGeometry?: string;
  title?: string;
  producerName: string; // IDFMU
  description: string;
  type: string;
  classification: string;
  srs: string;
  projectName: string;
  version: string;
  centroid: string;
  footprint: string;
  timeBegin: Date;
  timeEnd: Date;
  sensorType: string;
  region: string;
  nominalResolution: string;
  accuracyLE90: string;
  horizontalAccuracyCE90: string;
  relativeAccuracyLE90: string;
  estimatedPrecision: string;
  measuredPrecision: string;
}

export type ExporterResponse = ApiHttpResponse<ExportResult>;

const internalError = types.model({
  request: types.maybe(types.frozen<AxiosRequestConfig>()),
  key: types.frozen<ExportStoreError>(),
});
export interface IInternalError extends Instance<typeof internalError> {}

export const exporterStore = types
  .model({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    exportedPackages: types.maybe(types.frozen<any>([])),
    errors: types.frozen<IInternalError[]>([]),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const startExportGeoPackage: (
      modelInfo: ModelInfo
    ) => Promise<void> = flow(function* startExportGeoPackage(
      modelInfo: ModelInfo
    ): Generator<Promise<ExporterResponse>, void, ExporterResponse> {
      self.state = ResponseState.PENDING;
      const snapshot = getSnapshot(self.searchParams);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: Record<string, unknown> = {};
      // Get the source layer name
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const sourceLayer: string = EXPORTER_CONFIG.ACTIVE_LAYER_PROPERTIES.urlPatternParams.layers as string;
      // Prepare body data for request
      params.modelPath = modelInfo.modelPath;
      params.tilesetFilename = modelInfo.tilesetFilename;
      params.identifier = modelInfo.identifier;
      params.typename = modelInfo.typename;
      params.schema = modelInfo.schema;
      params.mdSource = modelInfo.mdSource;
      params.xml = modelInfo.xml;
      params.anytext = modelInfo.anytext;
      params.insertDate = modelInfo.insertDate;
      params.creationDate = modelInfo.creationDate;
      params.validationDate = modelInfo.validationDate;
      params.wktGeometry = modelInfo.wktGeometry;
      params.title = modelInfo.title;
      params.producerName = modelInfo.producerName;
      params.description = modelInfo.description;
      params.type = modelInfo.type;
      params.classification = modelInfo.classification;
      params.srs = modelInfo.srs;
      params.projectName = modelInfo.projectName;
      params.version = modelInfo.version;
      params.centroid = modelInfo.centroid;
      params.footprint = modelInfo.footprint;
      params.timeBegin = modelInfo.timeBegin;
      params.timeEnd = modelInfo.timeEnd;
      params.sensorType = modelInfo.sensorType;
      params.region = modelInfo.region;
      params.nominalResolution = modelInfo.nominalResolution;
      params.accuracyLE90 = modelInfo.accuracyLE90;
      params.horizontalAccuracyCE90 = modelInfo.horizontalAccuracyCE90;
      params.relativeAccuracyLE90 = modelInfo.relativeAccuracyLE90;
      params.estimatedPrecision = modelInfo.estimatedPrecision;
      params.measuredPrecision = modelInfo.measuredPrecision;

      try {
        const result = yield self.root.fetch(
          '/models',
          'POST',
          params,
          'http://localhost:8082'
        );
        // const responseBody = result.data.data;
        self.state = ResponseState.DONE;
      } catch (e) {
        const error = e as AxiosError;
        // eslint-disable-next-line
        if (error) {
          if (
            error.response &&
            error.response.data &&
            // eslint-disable-next-line
            error.response.data.name
          ) {
            addError({
              request: error.config,
              // eslint-disable-next-line
              key: error.response.data.name as ExportStoreError,
            });
          } else {
            addError({
              request: error.config,
              key: ExportStoreError.GENERAL_ERROR,
            });
          }
        }
        self.state = ResponseState.ERROR;
      }
    });
    const getGeoPackages: () => Promise<void> = flow(
      function* getGeoPackages(): Generator<
        Promise<ExporterResponse>,
        void,
        ExportTaskStatusResponse
      > {
        try {
          self.state = ResponseState.IDLE;
          const result = yield self.root.fetch('/jobs', 'GET', {}, 'http://localhost:8081');
          // const result = yield Promise.resolve(MOCK_EXPORTED_PACKAGES);
          self.exportedPackages = result;
        } catch (e) {
          const error = e as AxiosError;
          self.state = ResponseState.ERROR;
          addError({
            request: error.config,
            key: ExportStoreError.GENERAL_ERROR,
          });
        }
      }
    );

    const addError = (error: IInternalError): void => {
      self.errors = [...self.errors, error];
    };

    const hasError = (key: ExportStoreError): boolean => {
      return Boolean(self.errors.find((err) => err.key === key));
    };

    const hasErrors = (): boolean => {
      const minimalLength = 0;
      return self.errors.length > minimalLength;
    };

    const cleanError = (key: ExportStoreError): boolean => {
      if (hasError(key)) {
        self.errors = self.errors.filter((err) => err.key !== key);
        return true;
      }
      return false;
    };

    const cleanErrors = (): void => {
      self.errors = [];
    };

    return {
      startExportGeoPackage,
      getGeoPackages,
      addError,
      hasError,
      hasErrors,
      cleanError,
      cleanErrors,
    };
  });

export interface IConflictsStore extends Instance<typeof exporterStore> {}
