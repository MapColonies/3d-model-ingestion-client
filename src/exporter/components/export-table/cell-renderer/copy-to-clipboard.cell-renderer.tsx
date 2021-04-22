import React, { useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTheme } from '@map-colonies/react-core';
import './copy-to-clipboard.cell-renderer.css';

export const CopyToClipboardRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const theme = useTheme();
  const [copied, setCopied] = useState<boolean>(false);
  const value = props.getValue() as string;

  if (!value) {
    return <></>; //''; // not null!
  }
  return (
    <>
      {copied ? (
        <div
          className="copyIndicator"
          style={{color: theme.secondary}}
        >
           <FormattedMessage id="export-table.copy-indicator.text" />
        </div>
      ) : null}
      <input
        tabIndex={-1}
        value={value}
        className="linkControl"
      ></input>
      <CopyToClipboard text={value} onCopy={(): void => setCopied(true)}>
        <span className="buttonCopy" style={{ backgroundColor: theme.primary }}>
          <FormattedMessage id="export-table.copy.text" />
        </span>
      </CopyToClipboard>
    </>
  );
};
