import { types, Instance } from 'mobx-state-tree';

export enum ExportStoreError {
  GENERAL_ERROR = 'GENERAL_ERROR_OCCURED',
  ERROR_SAVING_EXPORT = 'ERR_SAVE_EXPORT_STATUS',
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
