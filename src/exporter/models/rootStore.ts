import { Method } from 'axios';
import { types, Instance, getEnv } from 'mobx-state-tree';
import { useContext, createContext } from 'react';
import { ResponseState } from '../../common/models/ResponseState';
import { exporterStore, ExporterResponse } from './exporterStore';

type FetchAction = (
  url: string,
  method: Method,
  params: Record<string, unknown>
) => Promise<ExporterResponse>;

export const baseRootStore = types
  .model({
    exporterStore: types.optional(exporterStore, {
      state: ResponseState.IDLE,
      searchParams: {},
      errors: [],
    }),
  })
  .views((self) => ({
    get fetch(): FetchAction {
      const env: { fetch: FetchAction } = getEnv(self);
      return env.fetch;
    },
  }));

export const rootStore = baseRootStore;
export interface IBaseRootStore extends Instance<typeof baseRootStore> {}
export interface IRootStore extends Instance<typeof rootStore> {}
const rootStoreContext = createContext<null | IRootStore | IBaseRootStore>(
  null
);

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootStore | IBaseRootStore => {
  const store = useContext(rootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
