import MOCK_EXPORTED_MODELS from '../../__mocks-data__/exportedModels';
import { ResponseState } from '../../common/models/ResponseState';
// eslint-disable-next-line
import '../../__mocks__/confEnvShim';
import { rootStore } from './rootStore';
import { ExportTaskStatusResponse } from './exporterStore';

const exportedModels: ExportTaskStatusResponse = MOCK_EXPORTED_MODELS;

describe('Exporter Store', () => {
  it('return an array of exported packages in a result of FETCH', async () => {
    const packagesFetcher = async (): Promise<ExportTaskStatusResponse> =>
      Promise.resolve<ExportTaskStatusResponse>(exportedModels);
    const { exporterStore } = rootStore.create({}, { fetch: packagesFetcher });

    await exporterStore.getJobs();

    const result: ExportTaskStatusResponse = exporterStore.exportedModels as ExportTaskStatusResponse;

    expect(result).toEqual(exportedModels);
  });

  it('status is DONE when export package trigered succesfully', async () => {
    const { exporterStore } = rootStore.create(
      {},
      {
        fetch: async () => Promise.resolve({}),
      }
    );
    const currentDate = new Date().toISOString();

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      modelPath: '/tmp/tilesets/TilesetWithDiscreteLOD',
      tilesetFilename: 'tileset.json',
      identifier: 'a4277d1c-a656-48d9-ad60-5df0de1ed77f',
      typename: 'typename',
      schema: 'schema',
      mdSource: 'mdSource',
      xml: 'xml',
      anytext: 'anytext',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'POINT(0 0)',
      title: '',
      producerName: 'IDFMU',
      description: '',
      type: '',
      classification: '',
      srs: '',
      projectName: '',
      version: '',
      centroid: '',
      footprint: '',
      timeBegin: currentDate,
      timeEnd: currentDate,
      sensorType: '',
      region: '',
      nominalResolution: '',
      accuracyLE90: '',
      horizontalAccuracyCE90: '',
      relativeAccuracyLE90: '',
      estimatedPrecision: '',
      measuredPrecision: ''
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
    const currentDate = new Date().toISOString();

    exporterStore.searchParams.setLocation({
      type: 'MultiPolygon',
      coordinates: [[[[32, 35]], [[32, 35]], [[31.5, 34.5]], [[32, 35]]]],
    });

    await exporterStore.startExportGeoPackage({
      modelPath: '/tmp/tilesets/TilesetWithDiscreteLOD',
      tilesetFilename: 'tileset.json',
      identifier: 'a4277d1c-a656-48d9-ad60-5df0de1ed77f',
      typename: 'typename',
      schema: 'schema',
      mdSource: 'mdSource',
      xml: 'xml',
      anytext: 'anytext',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'POINT(0 0)',
      title: '',
      producerName: 'IDFMU',
      description: '',
      type: '',
      classification: '',
      srs: '',
      projectName: '',
      version: '',
      centroid: '',
      footprint: '',
      timeBegin: currentDate,
      timeEnd: currentDate,
      sensorType: '',
      region: '',
      nominalResolution: '',
      accuracyLE90: '',
      horizontalAccuracyCE90: '',
      relativeAccuracyLE90: '',
      estimatedPrecision: '',
      measuredPrecision: ''
    });

    expect(exporterStore.state).toBe(ResponseState.ERROR);
  });
});
