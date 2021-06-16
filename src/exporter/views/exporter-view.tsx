import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box } from '@map-colonies/react-components';
import { useStore } from '../models/rootStore';
import { ExportDialog } from '../components/export/export-dialog';
import { ResponseState } from '../../common/models/ResponseState';
import { ExportStatusDialog } from '../components/export-table/export-status-dialog';
import { ExportStoreError } from '../../common/models/exportStoreError';

type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

interface SnackDetails {
  message: string;
}

const ExporterView: React.FC = observer(() => {
  const { exporterStore } = useStore();
  const onStatusClick = (): void => {
    setOpenStatus(true);
  }
  const onModelIngestionClick = (): void => {
    setOpenModelIngestion(true);
  }
  const [openStatus, setOpenStatus] = useState(false);
  const [openModelIngestion, setOpenModelIngestion] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({ message: '' });
  const intl = useIntl();
  useEffect(() => {
    switch (exporterStore.state) {
      case ResponseState.DONE:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.success',
        })
        break;
      default:
        break;
    }
  }, [exporterStore.state]);

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.GENERAL_ERROR)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed',
      });
    }
  }, [exporterStore, exporterStore.errors]);

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.ERROR_SAVING_EXPORT)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.server.failed',
      });
      setOpenModelIngestion(false);
    }
  }, [exporterStore, exporterStore.errors]);

  return (
    <>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button raised onClick={onModelIngestionClick} style={{ margin: '15px 20px 0 0' }}>
          <FormattedMessage id="ingestion.btn.text" />
        </Button>
        {
          openModelIngestion && <ExportDialog
            isOpen={openModelIngestion}
            onSetOpen={setOpenModelIngestion}
            handleExport={exporterStore.exportModel}>
          </ExportDialog>
        }
        <Button raised onClick={onStatusClick} style={{ margin: '15px 20px 0 0' }}>
          <FormattedMessage id="ingestion.status.btn.text" />
        </Button>
        {
          openStatus && <ExportStatusDialog
            isOpen={openStatus}
            onSetOpen={setOpenStatus}>
          </ExportStatusDialog>
        }
      </Box>
      {
        !!snackOpen && <Snackbar
          open={snackOpen}
          onOpen={(): void => {
            if (!exporterStore.hasErrors()) {
              setOpenModelIngestion(false);
            }
          }}
          onClose={(evt): void => {
            if (exporterStore.hasErrors()) {
              exporterStore.cleanErrors();
            }
            setSnackOpen(false);
          }}
          message={intl.formatMessage({ id: snackDetails.message })}
          dismissesOnAction
          action={
            <SnackbarAction
              label={intl.formatMessage({ id: 'snack.dismiss-btn.text' })}
            />
          }
        />
      }
    </>
  );
});

export default ExporterView;
