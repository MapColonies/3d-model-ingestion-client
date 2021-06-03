import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@map-colonies/react-components';
import { IExportTaskStatus } from '../../../models/exportTaskStatus';

import './status.cell-renderer.css';

export const StatusRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: string = (props.data as IExportTaskStatus).status;
  
  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <Box className={`status${value}`}>{value}</Box>
  );

};
