import { types, Instance } from 'mobx-state-tree';
import { Polygon } from '@turf/helpers';

export enum ExportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

const bbox = types.model({
  topRight: types.model({
    lat: types.number,
    lon: types.number,
  }),
  bottomLeft: types.model({
    lat: types.number,
    lon: types.number,
  }),
});

export const exportTaskStatus = types.model({
  fileName: types.string,
  sizeEst: types.number,
  realSize: types.number,
  status: types.enumeration<ExportStatus>(
    'status',
    Object.values(ExportStatus)
  ),
  maxZoom: types.number,
  polygon: types.frozen<Polygon>(),
  link: types.string,
  creationDate: types.Date,
  lastUpdateTime: types.Date,
  expirationTime: types.Date,
  progress: types.number,
  taskId: types.string,
  sourceLayer: types.string
});

export interface IExportTaskStatus extends Instance<typeof exportTaskStatus> {}

export interface IBbox extends Instance<typeof bbox> {}
