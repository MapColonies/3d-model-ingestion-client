import { Method } from 'axios';
import { types, Instance, getEnv } from 'mobx-state-tree';
import { useContext, createContext } from 'react';
import { ResponseState } from '../../common/models/ResponseState';
import { loaderStore, LoaderResponse } from './loaderStore';

type FetchAction = (
  url: string,
  method: Method,
  params: Record<string, unknown>
) => Promise<LoaderResponse>;

export const baseRootLoaderStore = types
  .model({
    loaderStore: types.optional(loaderStore, {
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

export const rootLoaderStore = baseRootLoaderStore;
export interface IBaseRootLoaderStore extends Instance<typeof baseRootLoaderStore> {}
export interface IRootLoaderStore extends Instance<typeof rootLoaderStore> {}
const rootStoreContext = createContext<null | IRootLoaderStore | IBaseRootLoaderStore>(
  null
);

export const StoreProvider = rootStoreContext.Provider;
export const useStore = (): IRootLoaderStore | IBaseRootLoaderStore => {
  const store = useContext(rootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
};
