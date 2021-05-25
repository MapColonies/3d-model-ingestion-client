import { types, Instance } from 'mobx-state-tree';

export enum LoadStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export const loadModelStatus = types.model({
  id: types.string,
  resourceId: types.string,
  version: types.string,
  type: types.string,
  description: types.string,
  parameters: types.string,
  creationTime: types.Date,
  updateTime: types.Date,
  status: types.enumeration<LoadStatus>(
    'status',
    Object.values(LoadStatus)
  ),
});

export interface ILoadModelStatus extends Instance<typeof loadModelStatus> {}
