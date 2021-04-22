import React from 'react';
import ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';
import Axios, { Method } from 'axios';
import moment from 'moment';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StoreProvider, rootStore } from './exporter/models/rootStore';
import { ExporterResponse } from './exporter/models/exporterStore';
import { CLIENT_SYSTEM_INFO } from './common/helpers/client-info';
import EXPORTER_CONFIG from './common/config';
import logger from './logger/logger';
import './index.css';

const store = rootStore.create(
  {},
  {
    fetch: async (url: string, method: Method, params: Record<string, unknown>) => {
      const errorMsg = 'CLIENT HTTP ERROR BY AXIOS';
      return Axios.request({
        url, 
        method, 
        data: params,
        baseURL: `${(EXPORTER_CONFIG.SERVICE_PROTOCOL as string)}${(EXPORTER_CONFIG.SERVICE_NAME as string)}` 
      })
      .then((res) => res.data as ExporterResponse)
      .catch ((error) => {
        // eslint-disable-next-line
        logger.error(errorMsg, {response:error, ...CLIENT_SYSTEM_INFO, dateTime: moment(new Date()).format('DD/MM/YYYY HH:mm')});
        throw(error);
      })
    },
  }
);

// REMARK IIFE to discard language presentation logic
((): void=>{
  const lang = EXPORTER_CONFIG.I18N.DEFAULT_LANGUAGE as string;//navigator.language.split(/[-_]/)[0];  // language without region code

  document.documentElement.lang = lang;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if(lang === 'he'){
    document.body.dir = 'rtl';  
  }
})();
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
