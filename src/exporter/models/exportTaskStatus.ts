import { types, Instance } from 'mobx-state-tree';

export enum ExportStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export const exportTaskStatus = types.model({
  id: types.string,
  resourceId: types.string,
  version: types.string,
  type: types.string,
  description: types.string,
  status: types.enumeration<ExportStatus>(
    'status',
    Object.values(ExportStatus)
  ),
  reason: types.string,
  parameters: types.string,
  creationTime: types.Date,
  updateTime: types.Date,
  percentage: types.number
});

export interface IExportTaskStatus extends Instance<typeof exportTaskStatus> {}
