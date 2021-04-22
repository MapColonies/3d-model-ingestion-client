import { types, Instance } from 'mobx-state-tree';

export enum ExportStoreError {
  BBOX_AREA_TOO_LARGE = 'BBOX_TOO_LARGE',
  BBOX_AREA_TOO_SMALL = 'ERR_BBOX_AREA_TOO_SMALL',
  GENERAL_ERROR = 'GENERAL_ERROR_OCCURED',
  DUPLICATE_PATH = 'ERR_EXPORT_DATA_DUPLICATION',
  ERROR_SAVING_EXPORT = 'ERR_SAVE_EXPORT_STATUS',
  BBOX_TOO_SMALL_FOR_RESOLUTION = 'ERR_BBOX_RESOLUTION_VALIDATION_ERROR',
}

const exporterError = types.maybeNull(
  types.model({
    name: types.enumeration<ExportStoreError>(
      'Error',
      Object.values(ExportStoreError)
    ),
    message: types.string,
  })
);

export type ExporterError = Instance<typeof exporterError>;
