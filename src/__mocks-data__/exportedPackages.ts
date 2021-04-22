import { ExportStatus } from '../exporter/models/exportTaskStatus';
import { ExportTaskStatusResponse } from '../exporter/models/exporterStore';

const MOCK_EXPORTED_PACKAGES: ExportTaskStatusResponse = [
  {
    fileName: 'kuku',
    sizeEst: 20,
    realSize: 23,
    status: ExportStatus.COMPLETED,
    maxZoom: 18,
    polygon: { type: 'Polygon', coordinates: [] },
    link: 'https://packages/kuku.gpkg',
    creationDate: new Date('2020-10-01T03:24:00'),
    lastUpdateTime: new Date('2020-10-01T03:24:00'),
    expirationTime: new Date('2020-11-01T03:24:00'),
    progress: 100,
    taskId: '11111111',
    sourceLayer: 'kuku_layer_name'
  },
  {
    fileName: 'muku',
    sizeEst: 340,
    realSize: 345,
    status: ExportStatus.IN_PROGRESS,
    maxZoom: 18,
    polygon: { type: 'Polygon', coordinates: [] },
    link: 'https://packages/muku.gpkg',
    creationDate: new Date('2020-09-30T02:24:00'),
    lastUpdateTime: new Date('2020-10-01T03:24:00'),
    expirationTime: new Date('2020-11-01T03:24:00'),
    progress: 80,
    taskId: '2222222',
    sourceLayer: 'muku_layer_name'
  },
];

export default MOCK_EXPORTED_PACKAGES;
