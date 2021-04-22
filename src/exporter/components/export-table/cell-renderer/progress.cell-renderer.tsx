import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { LinearProgress, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import './progress.cell-renderer.css';
import { useState } from 'react';
import EXPORTER_CONFIG from '../../../../common/config';
import { IExportTaskStatus, ExportStatus } from '../../../models/exportTaskStatus';

const PEDING_PROGRESS = 0;
const ONE_HUNDRED = 100;
export const ProgressRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const [isRtl] = useState<boolean>(EXPORTER_CONFIG.I18N.DEFAULT_LANGUAGE === 'he' ? true : false);
  const value: number = (props.data as IExportTaskStatus).progress; 
  const status: string = (props.data as IExportTaskStatus).status;
  if (!value || status === ExportStatus.FAILED) {
    return <></>;//''; // not null!
  }
  const getProgressValue = ():number => {
    return value > PEDING_PROGRESS ? (value / ONE_HUNDRED) : value;
  }

  const getPercentageText = ():string => {
    return value > PEDING_PROGRESS ? `${value}%` : `${value * ONE_HUNDRED}%`;
  }

  return (
    <Box style={{display: 'flex', height: '40px', alignItems: 'center', direction: 'ltr'}}>
      <Typography use="body1" className={'rendererLabel'}>{getPercentageText()}</Typography>
      <LinearProgress progress={getProgressValue()} reversed={isRtl} />
    </Box>
  );

};
