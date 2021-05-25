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
    const currentDate = new Date();

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      modelPath: '/tmp/tilesets/TilesetWithDiscreteLOD',
      tilesetFilename: 'tileset.json',
      identifier: 'a4277d1c-a656-48d9-ad60-5df0de1ed77f',
      typename: 'xxx',
      schema: 'xxx',
      mdSource: 'xxx',
      xml: 'xxx',
      anytext: 'xxx',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'xxx',
      title: 'xxx',
      producerName: 'IDFMU',
      description: 'xxx',
      type: 'xxx',
      classification: 'xxx',
      srs: 'xxx',
      projectName: 'xxx',
      version: 'xxx',
      centroid: 'xxx',
      footprint: 'xxx',
      timeBegin: currentDate,
      timeEnd: currentDate,
      sensorType: 'xxx',
      region: 'xxx',
      nominalResolution: 'xxx',
      accuracyLE90: 'xxx',
      horizontalAccuracyCE90: 'xxx',
      relativeAccuracyLE90: 'xxx',
      estimatedPrecision: 'xxx',
      measuredPrecision: 'xxx'
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
    const currentDate = new Date();

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      modelPath: '/tmp/tilesets/TilesetWithDiscreteLOD',
      tilesetFilename: 'tileset.json',
      identifier: 'a4277d1c-a656-48d9-ad60-5df0de1ed77f',
      typename: 'xxx',
      schema: 'xxx',
      mdSource: 'xxx',
      xml: 'xxx',
      anytext: 'xxx',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'xxx',
      title: 'xxx',
      producerName: 'IDFMU',
      description: 'xxx',
      type: 'xxx',
      classification: 'xxx',
      srs: 'xxx',
      projectName: 'xxx',
      version: 'xxx',
      centroid: 'xxx',
      footprint: 'xxx',
      timeBegin: currentDate,
      timeEnd: currentDate,
      sensorType: 'xxx',
      region: 'xxx',
      nominalResolution: 'xxx',
      accuracyLE90: 'xxx',
      horizontalAccuracyCE90: 'xxx',
      relativeAccuracyLE90: 'xxx',
      estimatedPrecision: 'xxx',
      measuredPrecision: 'xxx'
    });

    expect(exporterStore.state).toBe(ResponseState.ERROR);
  });
});
