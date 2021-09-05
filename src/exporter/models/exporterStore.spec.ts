import MOCK_EXPORT_JOBS from '../../__mocks-data__/exportJobs';
import { ResponseState } from '../../common/models/ResponseState';
// eslint-disable-next-line
import '../../__mocks__/confEnvShim';
import { rootStore } from './rootStore';
import { ExportTaskStatusResponse } from './exporterStore';

const exportJobs: ExportTaskStatusResponse = MOCK_EXPORT_JOBS;

describe('Exporter Store', () => {
  it('return an array of export jobs in a result of FETCH', async () => {
    const jobsFetcher = async (): Promise<ExportTaskStatusResponse> =>
      Promise.resolve<ExportTaskStatusResponse>(exportJobs);
    const { exporterStore } = rootStore.create({}, { fetch: jobsFetcher });

    await exporterStore.getJobs();

    const result: ExportTaskStatusResponse = exporterStore.exportJobs as ExportTaskStatusResponse;

    expect(result).toEqual(exportJobs);
  });

  it('status is DONE when export model triggered succesfully', async () => {
    const { exporterStore } = rootStore.create(
      {},
      {
        fetch: async () => Promise.resolve({}),
      }
    );
    const currentDate = new Date().toISOString();

    await exporterStore.exportModel({
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

  it('status is ERROR when export model triggered failed', async () => {
    const { exporterStore } = rootStore.create(
      {},
      {
        fetch: async () => Promise.reject(),
      }
    );
    const currentDate = new Date().toISOString();

    await exporterStore.exportModel({
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
