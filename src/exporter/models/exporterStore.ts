/* eslint-disable camelcase */
import { types, Instance, flow, getParent } from 'mobx-state-tree';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/ResponseState';
import { ExportStoreError } from '../../common/models/exportStoreError';
import EXPORTER_CONFIG from '../../common/config';
import { IRootStore } from './rootStore';
import { IExportTaskStatus } from './exportTaskStatus';

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
  insertDate: string;
  creationDateStr?: string;
  creationDate?: string;
  validationDateStr?: string;
  validationDate?: string;
  wktGeometry?: string;
  title?: string;
  producerName: string;
  description: string;
  type: string;
  classification: string;
  srs: string;
  projectName: string;
  version: string;
  centroid: string;
  footprint: string;
  timeBeginStr: string;
  timeBegin: string;
  timeEndStr: string;
  timeEnd: string;
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
    // eslint-disable-next-line
    exportJobs: types.maybe(types.frozen<any>([])),
    errors: types.frozen<IInternalError[]>([]),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const exportModel: (
      modelInfo: ModelInfo
    ) => Promise<void> = flow(function* exportModel(
      modelInfo: ModelInfo
    ): Generator<Promise<ExporterResponse>, void, ExporterResponse> {
      self.state = ResponseState.PENDING;
      // Prepare body data for request
      const params: Record<string, unknown> = {};
      const { modelPath, tilesetFilename, ...metadata } = modelInfo;
      params.modelPath = modelPath;
      params.tilesetFilename = tilesetFilename;
      params.metadata = metadata;

      try {
        /*const result = */yield self.root.fetch(
          EXPORTER_CONFIG.MODELS_BASE_URL,
          EXPORTER_CONFIG.MODELS_URL,
          'POST',
          params
        );
        // const responseBody = result.data.data;
        self.state = ResponseState.DONE;
      } catch (e) {
        const error = e as AxiosError;
        // eslint-disable-next-line
        if (error) {
          // eslint-disable-next-line
          if ( error.response?.data?.name ) {
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
    const getJobs: () => Promise<void> = flow(
      function* getJobs(): Generator<
        Promise<ExporterResponse>,
        void,
        ExportTaskStatusResponse
      > {
        try {
          self.state = ResponseState.IDLE;
          const result = yield self.root.fetch(
            EXPORTER_CONFIG.JOBS_BASE_URL,
            EXPORTER_CONFIG.JOBS_URL,
            'GET',
            {}
          );
          // const result = yield Promise.resolve(MOCK_EXPORT_JOBS);
          self.exportJobs = result;
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
      exportModel,
      getJobs,
      addError,
      hasError,
      hasErrors,
      cleanError,
      cleanErrors,
    };
  });

export interface IConflictsStore extends Instance<typeof exporterStore> {}
