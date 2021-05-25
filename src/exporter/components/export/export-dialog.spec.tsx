import React from 'react';
import { mount } from 'enzyme';
import { Polygon } from 'geojson';
import { act, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import MESSAGES from '../../../common/i18n';
import MOCK_EXPORTED_PACKAGES from '../../../__mocks-data__/exportedPackages';
import { ExportStoreError } from '../../../common/models/exportStoreError';
import EXPORTER_CONFIG from '../../../common/config';
import { getField, updateField, updateFieldAsync } from '../../../common/test-helpers/text-field.helper.spec';
import { getButtonById } from '../../../common/test-helpers/button.helper.spec';
import { ExportTaskStatusResponse } from '../../models/exporterStore';
import { rootStore, StoreProvider } from '../../models/rootStore';
import { ExportDialog } from './export-dialog';

const setOpenFn = jest.fn();
const handleExport = jest.fn();
console.warn = jest.fn();

const exportedPackages: ExportTaskStatusResponse = MOCK_EXPORTED_PACKAGES;
const packagesFetcher = async (): Promise<ExportTaskStatusResponse> => Promise.resolve<ExportTaskStatusResponse>(exportedPackages);

const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [[[32, 35], [], [31, 34], []]],
}

const fields = {
  bottomLeftLat: polygon.coordinates[0][0][1].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
  bottomLeftLon: polygon.coordinates[0][0][0].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
  topRightLat: polygon.coordinates[0][2][1].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
  topRightLon: polygon.coordinates[0][2][0].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS)
}

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

jest.mock('../../../common/helpers/estimated-tile-list');

describe('ExportDialog component', () => {
  it('renders correctly', async () => {

    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

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

  it('Initial state of Ok button is disabled',  async () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

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

  it('Passed polygon presented as bottom-left and top-right corners coordinates', async () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

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

    for (const field in fields) {
      await waitFor(() => {
        const fieldVal = getField(wrapper, field);
        // eslint-disable-next-line
        expect(fieldVal.prop('value')).toBe((fields as any)[field]);
      });
    }

  });
  
  it('When package name and directory name are defined Ok button is enabled and download link properly generated', async () => {
    const exportModelPath = 'test';
    const exportTilesetFilename = 'test';
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

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
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

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

  it('When all data filled and FORM submitted, export fails', async () => {
    const exportModelPath = 'uniqueName';
    const exportTilesetFilename = 'uniqueName';
    const modelIdentifier = 'a4277d1c-a656-48d9-ad60-5df0de1ed77f';

    const packagesFetcherFailure = async (): Promise<ExportTaskStatusResponse> => Promise.reject<ExportTaskStatusResponse>();
    const mockStore = rootStore.create({}, { fetch: packagesFetcherFailure });

    const handleExportError = jest.fn(x => {
      mockStore.exporterStore.addError({ request: {}, key: ExportStoreError.BBOX_TOO_SMALL_FOR_RESOLUTION });
    });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            handleExport={handleExportError}
          />
        </IntlProvider>
      </StoreProvider>
    );

    await updateFieldAsync(wrapper, 'modelPath', exportModelPath);
    await updateFieldAsync(wrapper, 'tilesetFilename', exportTilesetFilename);
    await updateFieldAsync(wrapper, 'identifier', modelIdentifier);

    // eslint-disable-next-line
    await act(async () => {
      wrapper
        .find('form')
        .simulate('submit');
    });

    wrapper.update();

    await waitFor(() => {
      const errorMessage: string = MESSAGES['en']['export.dialog.bbox.resolution.validation.error.text'] as string;
      // eslint-disable-next-line
      expect(wrapper.text().includes(errorMessage)).toBe(true);
      expect(handleExportError).toHaveBeenCalled();
    });
  });

});
