import { ExportStatus } from '../exporter/models/exportTaskStatus';
import { ExportTaskStatusResponse } from '../exporter/models/exporterStore';

const MOCK_EXPORTED_PACKAGES: ExportTaskStatusResponse = [
  {
    id: '111',
    resourceId: 'resource1',
    version: '1.0',
    type: '3DModel',
    description: '',
    status: ExportStatus.COMPLETED,
    reason: '',
    parameters: '',
    creationTime: new Date('2020-10-01T03:24:00'),
    updateTime: new Date('2020-11-01T03:24:00'),
    percentage: 100
  },
  {
    id: '222',
    resourceId: 'resource2',
    version: '1.0',
    type: '3DModel',
    description: '',
    status: ExportStatus.IN_PROGRESS,
    reason: '',
    parameters: '',
    creationTime: new Date('2020-10-01T03:24:00'),
    updateTime: new Date('2020-11-01T03:24:00'),
    percentage: 50
  },
];

export default MOCK_EXPORTED_PACKAGES;
