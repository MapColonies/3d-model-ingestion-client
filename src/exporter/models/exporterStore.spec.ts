import MOCK_EXPORTED_PACKAGES from '../../__mocks-data__/exportedPackages';
import { ResponseState } from '../../common/models/ResponseState';
// eslint-disable-next-line
import '../../__mocks__/confEnvShim';
import { rootStore } from './rootStore';
import { ExportTaskStatusResponse } from './exporterStore';

const exportedPackages: ExportTaskStatusResponse = MOCK_EXPORTED_PACKAGES;

describe('Exporter Store', () => {
  it('return an array of exported packages in a result of FETCH', async () => {
    const packagesFetcher = async (): Promise<ExportTaskStatusResponse> =>
      Promise.resolve<ExportTaskStatusResponse>(exportedPackages);
    const { exporterStore } = rootStore.create({}, { fetch: packagesFetcher });

    await exporterStore.getGeoPackages();

    const result: ExportTaskStatusResponse = exporterStore.exportedPackages as ExportTaskStatusResponse;

    expect(result).toEqual(exportedPackages);
  });

  it('status is DONE when export package trigered succesfully', async () => {
    const { exporterStore } = rootStore.create(
      {},
      {
        fetch: async () => Promise.resolve({}),
      }
    );

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      directoryName: 'kuku',
      packName: 'kuku',
      sizeEst: 20000,
    });

    expect(exporterStore.state).toBe(ResponseState.DONE);
  });

  it('status is ERROR when export package trigered failed', async () => {
    const { exporterStore } = rootStore.create(
      {},
      {
        fetch: async () => Promise.reject(),
      }
    );

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      directoryName: 'kuku',
      packName: 'kuku',
      sizeEst: 20000,
    });

    expect(exporterStore.state).toBe(ResponseState.ERROR);
  });
});
