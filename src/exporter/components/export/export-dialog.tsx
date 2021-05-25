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
      identifier: '',
      typename: '',
      schema: '',
      mdSource: '',
      xml: '',
      anytext: '',
      insertDate: new Date(),
      creationDate: new Date(),
      validationDate: new Date(),
      wktGeometry: '',
      title: '',
      producerName: '',
      description: '',
      type: '',
      classification: '',
      srs: '',
      projectName: '',
      version: '',
      centroid: '',
      footprint: '',
      timeBegin: new Date(),
      timeEnd: new Date(),
      sensorType: '',
      region: '',
      nominalResolution: '',
      accuracyLE90: '',
      horizontalAccuracyCE90: '',
      relativeAccuracyLE90: '',
      estimatedPrecision: '',
      measuredPrecision: ''
    },
    onSubmit: values => {
      void handleExport({
        modelPath: formik.values.modelPath,
        tilesetFilename: formik.values.tilesetFilename,
        identifier: formik.values.identifier,
        typename: formik.values.typename,
        schema: formik.values.schema,
        mdSource: formik.values.mdSource,
        xml: formik.values.xml,
        anytext: formik.values.anytext,
        insertDate: formik.values.insertDate,
        creationDate: formik.values.creationDate,
        validationDate: formik.values.validationDate,
        wktGeometry: formik.values.wktGeometry,
        title: formik.values.title,
        producerName: formik.values.producerName,
        description: formik.values.description,
        type: formik.values.type,
        classification: formik.values.classification,
        srs: formik.values.srs,
        projectName: formik.values.projectName,
        version: formik.values.version,
        centroid: formik.values.centroid,
        footprint: formik.values.footprint,
        timeBegin: formik.values.timeBegin,
        timeEnd: formik.values.timeEnd,
        sensorType: formik.values.sensorType,
        region: formik.values.region,
        nominalResolution: formik.values.nominalResolution,
        accuracyLE90: formik.values.accuracyLE90,
        horizontalAccuracyCE90: formik.values.horizontalAccuracyCE90,
        relativeAccuracyLE90: formik.values.relativeAccuracyLE90,
        estimatedPrecision: formik.values.estimatedPrecision,
        measuredPrecision: formik.values.measuredPrecision
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
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.typename' })}
              id="typename"
              name="typename"
              type="text"
              onChange={checkText}
              value={formik.values.typename}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.schema' })}
              id="schema"
              name="schema"
              type="text"
              onChange={checkText}
              value={formik.values.schema}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.md_source' })}
              id="mdSource"
              name="mdSource"
              type="text"
              onChange={checkText}
              value={formik.values.mdSource}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.xml' })}
              id="xml"
              name="xml"
              type="text"
              onChange={checkText}
              value={formik.values.xml}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.anytext' })}
              id="anytext"
              name="anytext"
              type="text"
              onChange={checkText}
              value={formik.values.anytext}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.insert_date' })}
              id="insertDate"
              name="insertDate"
              type="text"
              onChange={checkText}
              value={formik.values.insertDate.toISOString()}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.creation_date' })}
              id="creationDate"
              name="creationDate"
              type="text"
              onChange={checkText}
              value={formik.values.creationDate.toISOString()}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.validation_date' })}
              id="validationDate"
              name="validationDate"
              type="text"
              onChange={checkText}
              value={formik.values.validationDate.toISOString()}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.wkt_geometry' })}
              id="wktGeometry"
              name="wktGeometry"
              type="text"
              onChange={checkText}
              value={formik.values.wktGeometry}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.title' })}
              id="title"
              name="title"
              type="text"
              onChange={checkText}
              value={formik.values.title}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.producer_name' })}
              id="producerName"
              name="producerName"
              type="text"
              onChange={checkText}
              value={formik.values.producerName}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.description' })}
              id="description"
              name="description"
              type="text"
              onChange={checkText}
              value={formik.values.description}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.type' })}
              id="type"
              name="type"
              type="text"
              onChange={checkText}
              value={formik.values.type}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.classification' })}
              id="classification"
              name="classification"
              type="text"
              onChange={checkText}
              value={formik.values.classification}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.srs' })}
              id="srs"
              name="srs"
              type="text"
              onChange={checkText}
              value={formik.values.srs}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.project_name' })}
              id="projectName"
              name="projectName"
              type="text"
              onChange={checkText}
              value={formik.values.projectName}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.version' })}
              id="version"
              name="version"
              type="text"
              onChange={checkText}
              value={formik.values.version}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.centroid' })}
              id="centroid"
              name="centroid"
              type="text"
              onChange={checkText}
              value={formik.values.centroid}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.footprint' })}
              id="footprint"
              name="footprint"
              type="text"
              onChange={checkText}
              value={formik.values.footprint}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.time_begin' })}
              id="timeBegin"
              name="timeBegin"
              type="text"
              onChange={checkText}
              value={formik.values.timeBegin.toISOString()}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.time_end' })}
              id="timeEnd"
              name="timeEnd"
              type="text"
              onChange={checkText}
              value={formik.values.timeEnd.toISOString()}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.sensor_type' })}
              id="sensorType"
              name="sensorType"
              type="text"
              onChange={checkText}
              value={formik.values.sensorType}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.region' })}
              id="region"
              name="region"
              type="text"
              onChange={checkText}
              value={formik.values.sensorType}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.nominal_resolution' })}
              id="nominalResolution"
              name="nominalResolution"
              type="text"
              onChange={checkText}
              value={formik.values.nominalResolution}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.accuracy_le90' })}
              id="accuracyLE90"
              name="accuracyLE90"
              type="text"
              onChange={checkText}
              value={formik.values.accuracyLE90}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.horizontal_accuracy_ce90' })}
              id="horizontalAccuracyCE90"
              name="horizontalAccuracyCE90"
              type="text"
              onChange={checkText}
              value={formik.values.horizontalAccuracyCE90}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.relative_accuracy_le90' })}
              id="relativeAccuracyLE90"
              name="relativeAccuracyLE90"
              type="text"
              onChange={checkText}
              value={formik.values.relativeAccuracyLE90}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.estimated_precision' })}
              id="estimatedPrecision"
              name="estimatedPrecision"
              type="text"
              onChange={checkText}
              value={formik.values.estimatedPrecision}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'load.dialog.field.measured_precision' })}
              id="measuredPrecision"
              name="measuredPrecision"
              type="text"
              onChange={checkText}
              value={formik.values.measuredPrecision}
              fullwidth
            />
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
            <Button raised type="submit" disabled={!!formErrors.minMaxZooms || !!serverErrors.duplicate || 
              !formik.values.modelPath ||
              !formik.values.tilesetFilename}>
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
});
