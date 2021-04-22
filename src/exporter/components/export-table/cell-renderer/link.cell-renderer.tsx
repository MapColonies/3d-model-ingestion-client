import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@map-colonies/react-core';
import './link.cell-renderer.css';
import { IExportTaskStatus } from '../../../models/exportTaskStatus';

export const LinkRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: string = (props.data as IExportTaskStatus).link; 
  const theme = useTheme();
  
  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <a href={value} target="_blank" rel="noopener noreferrer" className="buttonLink" style={{backgroundColor:theme.primary}}>
      <FormattedMessage id="export-table.link.text" />
    </a>
  );

};
