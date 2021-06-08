import React from 'react';
import { mount } from 'enzyme';
import { act, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import MESSAGES from '../../../common/i18n';
import MOCK_EXPORTED_MODELS from '../../../__mocks-data__/exportedModels';
import { updateField } from '../../../common/test-helpers/text-field.helper.spec';
import { getButtonById } from '../../../common/test-helpers/button.helper.spec';
import { ExportTaskStatusResponse } from '../../models/exporterStore';
import { rootStore, StoreProvider } from '../../models/rootStore';
import { ExportDialog } from './export-dialog';

const setOpenFn = jest.fn();
const handleExport = jest.fn();
console.warn = jest.fn();

const exportedModels: ExportTaskStatusResponse = MOCK_EXPORTED_MODELS;
const jobsFetcher = async (): Promise<ExportTaskStatusResponse> => Promise.resolve<ExportTaskStatusResponse>(exportedModels);

// Enzyme doesn’t work properly with hooks in general, especially for `shallow` so this is the way to mock `react-intl` module.
// Enspired by https://github.com/formatjs/formatjs/issues/1477
jest.mock('react-intl', () => {
  /* eslint-disable */
  const reactIntl = require.requireActual('react-intl');
  const MESSAGES = require.requireActual('../../../common/i18n');
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: MESSAGES.default['en'],
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
  /* eslint-enable */
});

describe('ExportDialog component', () => {
  it('renders correctly', async () => {

    const mockStore = rootStore.create({}, { fetch: jobsFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    await waitFor(() => {
      expect(wrapper.exists(ExportDialog)).toBeTruthy();
    });
  });

  it('Initial state of OK button is disabled',  async () => {
    const mockStore = rootStore.create({}, { fetch: jobsFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    await waitFor(() => {
      const okButton = getButtonById(wrapper, 'general.ok-btn.text');
      expect(okButton.prop('disabled')).toBe(true);
    });
  });
  
  it('When model path, tileset filename and model identifier are defined OK button is enabled', async () => {
    const exportModelPath = 'test';
    const exportTilesetFilename = 'test';
    const exportIdentifier = 'test';
    const mockStore = rootStore.create({}, { fetch: jobsFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    await waitFor(() => {
      updateField(wrapper, 'modelPath', exportModelPath);
      updateField(wrapper, 'tilesetFilename', exportTilesetFilename);
      updateField(wrapper, 'identifier', exportIdentifier);
    })

    wrapper.update();

    await waitFor(() => {
      const okButton = getButtonById(wrapper, 'general.ok-btn.text');
      expect(okButton.prop('disabled')).toBe(false);
    });
  });

  it('When all data filled and FORM submitted, handleExport triggered', async () => {
    const exportModelPath = 'test';
    const exportTilesetFilename = 'test';
    const exportIdentifier = 'test';
    const mockStore = rootStore.create({}, { fetch: jobsFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    await waitFor(() => {
      updateField(wrapper, 'modelPath', exportModelPath);
      updateField(wrapper, 'tilesetFilename', exportTilesetFilename);
      updateField(wrapper, 'identifier', exportIdentifier);
    })

    // eslint-disable-next-line
    await act(async () => {
      wrapper
        .find('form')
        .simulate('submit');
    });

    wrapper.update();

    await waitFor(() => {
      expect(getButtonById(wrapper, 'general.ok-btn.text').prop('disabled')).toBe(false);
      expect(handleExport).toHaveBeenCalled();
    });
  });

});
