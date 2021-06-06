import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { AgGridReact } from 'ag-grid-react';
import { waitFor } from '@testing-library/react';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import MOCK_EXPORTED_MODELS from '../../../__mocks-data__/exportedModels';
import MESSAGES from '../../../common/i18n';
import { rootStore, StoreProvider } from '../../models/rootStore';
import { ExportTaskStatusResponse } from '../../models/exporterStore';
import { ExportStatusDialog } from './export-status-dialog';

const setOpenFn = jest.fn();

const exportedModels: ExportTaskStatusResponse = MOCK_EXPORTED_MODELS;
const packagesFetcher = async (): Promise<ExportTaskStatusResponse> => Promise.resolve<ExportTaskStatusResponse>(exportedModels);

describe('ExportStatusTable component', () => {
  it('renders correctly', async () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });
    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportStatusDialog
            isOpen={true}
            onSetOpen={setOpenFn}
          />
        </IntlProvider>  
      </StoreProvider>
    );

    wrapper.update();

    await waitFor(() => {
      return mockStore.exporterStore.exportedModels !== [];
    });

    await waitFor(() => {
      expect(wrapper.exists(ExportStatusDialog)).toBeTruthy();
    });
  });

  it('exported packages fetched during component lifecycle', async () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });
    const getJobsMock = jest.spyOn(mockStore.exporterStore, "getJobs");
        
    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportStatusDialog
            isOpen={true}
            onSetOpen={setOpenFn}
          />
        </IntlProvider>  
      </StoreProvider>
    );
  
    wrapper.update(); 

    await waitFor(() => {
      return mockStore.exporterStore.exportedModels !== [];
    });
  
    await waitFor(() => {
      expect(getJobsMock).toHaveBeenCalled();
      getJobsMock.mockRestore();
    });
  });

  
  it('fetched mock data propregated to aggrid rowdata ', async () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });
        
    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportStatusDialog
            isOpen={true}
            onSetOpen={setOpenFn}
          />
        </IntlProvider>  
      </StoreProvider>
    );

    await waitFor(() => {
      return mockStore.exporterStore.exportedModels !== [];
    });

    wrapper.update();

    await waitFor(() => {
      const aggrid = wrapper.find(AgGridReact);
      expect(aggrid.props().rowData).toBe(exportedModels);
    });
  });
});
