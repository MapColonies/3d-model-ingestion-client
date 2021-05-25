import { types, Instance } from 'mobx-state-tree';

export enum LoaderStoreError {
  GENERAL_ERROR = 'GENERAL_ERROR_OCCURED',
  ERROR_SAVING_LOAD = 'ERR_SAVE_LOAD_STATUS',
}

const loaderError = types.maybeNull(
  types.model({
    name: types.enumeration<LoaderStoreError>(
      'Error',
      Object.values(LoaderStoreError)
    ),
    message: types.string,
  })
);

export type ExporterError = Instance<typeof loaderError>;
