import React, { useState } from 'react';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { BBoxCorner, Corner } from '../bbox/bbox-corner-indicator';
import { ModelInfo } from '../../models/loaderStore';

const FIRST_CHAR_IDX = 0;

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
    identifierField: {
      backgroundColor: 'red'
    }
  })
);

// eslint-disable-next-line
const isValidText = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data) {
    return true;
  }
  const charIdx = data.search(/[a-zA-Z0-9-_/()\\.]+/i);
  return (charIdx === FIRST_CHAR_IDX);
};

const isValidTilesetFilename = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data) {
    return true;
  }
  return data.endsWith('.json');
};

interface LoadDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  handleLoad: (modelInfo: ModelInfo) => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = observer((props) => {
  const { isOpen, onSetOpen, handleLoad } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      modelPath: '',
      tilesetFilename: '',
      identifier: '',
    },
    onSubmit: values => {
      void handleLoad({
        modelPath: formik.values.modelPath,
        tilesetFilename: formik.values.tilesetFilename,
        identifier: formik.values.identifier
      });
    },
  });
  
  const [formErrors, setFormErrors] = useState({ identifierFormat: '' });
  const [serverErrors, setServerErrors] = useState({ duplicate: '', bboxAreaForResolution: '' });

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

  // eslint-disable-next-line
  const checkTilesetFilename = (e: React.ChangeEvent<any>) => {
    return isValidTilesetFilename(e) ? formik.handleChange(e) : false;
  };

  return (
    <Dialog open={isOpen} preventOutsideDismiss={true}>
      <DialogTitle>
        <FormattedMessage id="load.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              placeholder={intl.formatMessage({ id: 'load.dialog-field.model_path.placeholder' })}
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
              placeholder={intl.formatMessage({ id: 'load.dialog-field.tileset_filename.placeholder' })}
              id="tilesetFilename"
              name="tilesetFilename"
              type="text"
              onInput={checkTilesetFilename}
              value={formik.values.tilesetFilename}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog-field.identifier.label' })}
              id="identifier"
              name="identifier"
              type="text"
              onChange={checkText}
              value={formik.values.identifier}
              className={`${classes.spacer} ${classes.identifierField}`}
            />
            <BBoxCorner corner={Corner.UNKNOWN} className={classes.noBorder} />
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
            {
              (formErrors.identifierFormat) ?
                <div className={classes.errorContainer}>
                  {`${intl.formatMessage({ id: 'general.error.label' })}: ${formErrors.identifierFormat}`}
                </div> :
                null
            }
            {
              // Display any server error that occurred
              Object.entries(serverErrors).map(([error, value], index) => {
                return value ?
                <div key={index} className={classes.errorContainer}>
                  {`${intl.formatMessage({ id: 'general.error.label' })}: ${intl.formatMessage({ id: value })}`}
                </div> :
                null
              })
            }
            <Button type="button" onClick={(): void => { handleClose(false); }}>
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
            <Button raised type="submit" disabled={!!formErrors.identifierFormat || !formik.values.tilesetFilename || 
              !!serverErrors.duplicate || !formik.values.modelPath}>
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
});
