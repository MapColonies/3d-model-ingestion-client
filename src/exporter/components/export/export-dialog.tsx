import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { BBoxCorner, Corner } from '../bbox/bbox-corner-indicator';
import { getTilesCount } from '../../../common/helpers/estimated-tile-list';
import { getResolutionInMeteres } from '../../../common/helpers/zoom-resolution';
import { useDebouncedLayoutEffect } from '../../../common/hooks/debounced.hooks';
import EXPORTER_CONFIG from '../../../common/config';
import { ModelInfo } from '../../models/exporterStore';
import { ExportStoreError } from '../../../common/models/exportStoreError';
import { useStore } from '../../models/rootStore';
import { NotchLabel } from './notch-label';

const FIRST_CHAR_IDX = 0;
const DEBOUNCE_TIME = 300;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginRight: '16px'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main,
    },
    noBorder: {
      border: 'unset',
    },
    readOnly: {
      backgroundColor: 'transparent !important',
    },
    infoLabel: {
      width: '110px',
    },
  })
);

// eslint-disable-next-line
const isValidText = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data)
    return true;

  const charIdx = data.search(/[a-zA-Z0-9-_)]+/i);
  return (charIdx === FIRST_CHAR_IDX);
};

const calcPackSize = (tiles: number): number => {
  return Math.ceil(tiles * EXPORTER_CONFIG.EXPORT.AVG_TILE_SIZE_MB);
}

interface ExportDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  handleExport: (modelInfo: ModelInfo) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = observer((props) => {
  const { exporterStore } = useStore();
  const { isOpen, onSetOpen, handleExport } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      modelPath: '',
      tilesetFilename: '',
      identifier: ''
    },
    onSubmit: values => {
      void handleExport({
        modelPath: formik.values.modelPath,
        tilesetFilename: formik.values.tilesetFilename,
        identifier: formik.values.identifier,
      });
    },
  });
  // eslint-disable-next-line
  const [numTiles, setNumTiles] = useState<number>(0);
  // eslint-disable-next-line
  const [pixelSize, setPixelSize] = useState<number | string>(0);

  const [formErrors, setFormErrors] = useState({ minMaxZooms: '' });
  const [serverErrors, setServerErrors] = useState({ duplicate: '' });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  // eslint-disable-next-line
  const checkText = (e: React.ChangeEvent<any>) => {

    if (serverErrors.duplicate) {
      setServerErrors({ ...serverErrors, duplicate: '' });
    }
    return isValidText(e) ? formik.handleChange(e) : false;
  };

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.DUPLICATE_PATH)) {
      setServerErrors({ ...serverErrors, duplicate: 'export.dialog.duplicate-path.text' });
      exporterStore.cleanError(ExportStoreError.DUPLICATE_PATH);
    }
  }, [exporterStore, exporterStore.errors, serverErrors]);

  return (
    <Dialog open={isOpen} preventOutsideDismiss={true}>
      <DialogTitle>
        <FormattedMessage id="load.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.model_path' })}
              id="modelPath"
              name="modelPath"
              type="text"
              onChange={checkText}
              value={formik.values.modelPath}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.tileset_filename' })}
              id="tilesetFilename"
              name="tilesetFilename"
              type="text"
              onChange={checkText}
              value={formik.values.tilesetFilename}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.identifier' })}
              id="identifier"
              name="identifier"
              type="text"
              onChange={checkText}
              value={formik.values.identifier}
              fullwidth
            />
          </Box>

          <Box style={{ display: 'flex' }}>
            <Typography use="body1" className={classes.infoLabel}>
              <FormattedMessage id="export.dialog-info.label" />
            </Typography>
            <Typography use="body2">
              ~{numTiles} {intl.formatMessage({ id: 'export.dialog.tiles.text' })},&nbsp;
            </Typography>
            <Typography use="body2" style={{ marginLeft: '32px' }}>
              ~{calcPackSize(numTiles)}Mb
            </Typography>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
            {
              (formErrors.minMaxZooms) ?
                <div className={classes.errorContainer}>
                  {`${intl.formatMessage({ id: 'general.error.label' })}: ${formErrors.minMaxZooms}`}
                </div> :
                null
            }
            {
              // Display any server error the occurred
              Object.entries(serverErrors).map(([error, value], index) => {
                return value ?
                <div key={index} className={classes.errorContainer}>
                  {`${intl.formatMessage({ id: 'general.error.label' })}: ${intl.formatMessage({ id: value })}`}
                </div> :
                null
              }
              )
            }
            <Button type="button" onClick={(): void => { handleClose(false); }}>
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
            <Button raised type="submit" disabled={!!formErrors.minMaxZooms || !formik.values.tilesetFilename || 
              !!serverErrors.duplicate || !formik.values.modelPath}>
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
});
