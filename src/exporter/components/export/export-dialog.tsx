import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { ModelInfo } from '../../models/exporterStore';
import { ExportStoreError } from '../../../common/models/exportStoreError';
import { useStore } from '../../models/rootStore';
import { NotchLabel } from './notch-label';

const FIRST_CHAR_IDX = 0;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginTop: '5px',
      marginRight: '5px',
      marginLeft: '5px'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main
    },
    noBorder: {
      border: 'unset'
    },
    readOnly: {
      backgroundColor: 'transparent !important'
    },
    infoLabel: {
      width: '110px'
    },
    metadata: {
      justifyContent: 'space-around',
      borderRadius: '10px',
      border: '1px solid lightgray',
      padding: '20px'
    },
    metadataLabel: {
      display: 'block',
      position: 'absolute',
      left: '47px',
      top: '161px'
    },
    textFields: {
      display: 'flex',
      marginBottom: '16px'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
      gap: '16px'
    }
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
  const currentDate = new Date();
  const formik = useFormik({
    initialValues: {
      modelPath: '/tmp/tilesets/TilesetWithDiscreteLOD',
      tilesetFilename: 'tileset.json',
      identifier: 'xxx',
      typename: 'typename',
      schema: 'schema',
      mdSource: 'mdSource',
      xml: 'xml',
      anytext: 'anytext',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'POINT(0 0)',
      title: 'xxx',
      producerName: 'IDFMU',
      description: 'xxx',
      type: 'xxx',
      classification: 'xxx',
      srs: 'xxx',
      projectName: 'xxx',
      version: 'xxx',
      centroid: 'xxx',
      footprint: 'xxx',
      timeBegin: currentDate,
      timeEnd: currentDate,
      sensorType: 'xxx',
      region: 'xxx',
      nominalResolution: 'xxx',
      accuracyLE90: 'xxx',
      horizontalAccuracyCE90: 'xxx',
      relativeAccuracyLE90: 'xxx',
      estimatedPrecision: 'xxx',
      measuredPrecision: 'xxx'
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
        <FormattedMessage id="ingestion.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box className={classes.textFields} style={{ justifyContent: 'space-around' }}>
            <Box className={classes.textFields} style={{ flexGrow: 20 }}>
              <TextField
                label={intl.formatMessage({ id: 'ingestion.dialog.field.model_path' })}
                id="modelPath"
                name="modelPath"
                type="text"
                onChange={checkText}
                value={formik.values.modelPath}
                className={classes.spacer}
              />
            </Box>
            <Box className={classes.textFields} style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
              <TextField
                label={intl.formatMessage({ id: 'ingestion.dialog.field.tileset_filename' })}
                id="tilesetFilename"
                name="tilesetFilename"
                type="text"
                onChange={checkText}
                value={formik.values.tilesetFilename}
                className={classes.spacer}
              />
            </Box>
          </Box>
          <Box className={classes.metadata}>
            <Box className={classes.metadataLabel}>
              <NotchLabel text={intl.formatMessage({ id: 'ingestion.dialog.metadata' })} />
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.identifier' })}
                  id="identifier"
                  name="identifier"
                  type="text"
                  onChange={checkText}
                  value={formik.values.identifier}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.typename' })}
                  id="typename"
                  name="typename"
                  type="text"
                  onChange={checkText}
                  value={formik.values.typename}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.schema' })}
                  id="schema"
                  name="schema"
                  type="text"
                  onChange={checkText}
                  value={formik.values.schema}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.md_source' })}
                  id="mdSource"
                  name="mdSource"
                  type="text"
                  onChange={checkText}
                  value={formik.values.mdSource}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.xml' })}
                  id="xml"
                  name="xml"
                  type="text"
                  onChange={checkText}
                  value={formik.values.xml}
                  className={classes.spacer}
                />
              </Box>
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.anytext' })}
                  id="anytext"
                  name="anytext"
                  type="text"
                  onChange={checkText}
                  value={formik.values.anytext}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.insert_date' })}
                  id="insertDate"
                  name="insertDate"
                  type="text"
                  onChange={checkText}
                  value={formik.values.insertDate.toISOString()}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.creation_date' })}
                  id="creationDate"
                  name="creationDate"
                  type="text"
                  onChange={checkText}
                  value={formik.values.creationDate.toISOString()}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.validation_date' })}
                  id="validationDate"
                  name="validationDate"
                  type="text"
                  onChange={checkText}
                  value={formik.values.validationDate.toISOString()}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.wkt_geometry' })}
                  id="wktGeometry"
                  name="wktGeometry"
                  type="text"
                  onChange={checkText}
                  value={formik.values.wktGeometry}
                  className={classes.spacer}
                />
              </Box>
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.title' })}
                  id="title"
                  name="title"
                  type="text"
                  onChange={checkText}
                  value={formik.values.title}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.producer_name' })}
                  id="producerName"
                  name="producerName"
                  type="text"
                  onChange={checkText}
                  value={formik.values.producerName}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.description' })}
                  id="description"
                  name="description"
                  type="text"
                  onChange={checkText}
                  value={formik.values.description}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.type' })}
                  id="type"
                  name="type"
                  type="text"
                  onChange={checkText}
                  value={formik.values.type}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.classification' })}
                  id="classification"
                  name="classification"
                  type="text"
                  onChange={checkText}
                  value={formik.values.classification}
                  className={classes.spacer}
                />
              </Box>
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.srs' })}
                  id="srs"
                  name="srs"
                  type="text"
                  onChange={checkText}
                  value={formik.values.srs}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.project_name' })}
                  id="projectName"
                  name="projectName"
                  type="text"
                  onChange={checkText}
                  value={formik.values.projectName}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.version' })}
                  id="version"
                  name="version"
                  type="text"
                  onChange={checkText}
                  value={formik.values.version}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.centroid' })}
                  id="centroid"
                  name="centroid"
                  type="text"
                  onChange={checkText}
                  value={formik.values.centroid}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.footprint' })}
                  id="footprint"
                  name="footprint"
                  type="text"
                  onChange={checkText}
                  value={formik.values.footprint}
                  className={classes.spacer}
                />
              </Box>
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.time_begin' })}
                  id="timeBegin"
                  name="timeBegin"
                  type="text"
                  onChange={checkText}
                  value={formik.values.timeBegin.toISOString()}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.time_end' })}
                  id="timeEnd"
                  name="timeEnd"
                  type="text"
                  onChange={checkText}
                  value={formik.values.timeEnd.toISOString()}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.sensor_type' })}
                  id="sensorType"
                  name="sensorType"
                  type="text"
                  onChange={checkText}
                  value={formik.values.sensorType}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.region' })}
                  id="region"
                  name="region"
                  type="text"
                  onChange={checkText}
                  value={formik.values.sensorType}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.nominal_resolution' })}
                  id="nominalResolution"
                  name="nominalResolution"
                  type="text"
                  onChange={checkText}
                  value={formik.values.nominalResolution}
                  className={classes.spacer}
                />
              </Box>
            </Box>
            <Box className={classes.textFields}>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.accuracy_le90' })}
                  id="accuracyLE90"
                  name="accuracyLE90"
                  type="text"
                  onChange={checkText}
                  value={formik.values.accuracyLE90}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.horizontal_accuracy_ce90' })}
                  id="horizontalAccuracyCE90"
                  name="horizontalAccuracyCE90"
                  type="text"
                  onChange={checkText}
                  value={formik.values.horizontalAccuracyCE90}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.relative_accuracy_le90' })}
                  id="relativeAccuracyLE90"
                  name="relativeAccuracyLE90"
                  type="text"
                  onChange={checkText}
                  value={formik.values.relativeAccuracyLE90}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.estimated_precision' })}
                  id="estimatedPrecision"
                  name="estimatedPrecision"
                  type="text"
                  onChange={checkText}
                  value={formik.values.estimatedPrecision}
                  className={classes.spacer}
                />
              </Box>
              <Box className={classes.textFields}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.measured_precision' })}
                  id="measuredPrecision"
                  name="measuredPrecision"
                  type="text"
                  onChange={checkText}
                  value={formik.values.measuredPrecision}
                  className={classes.spacer}
                />
              </Box>
            </Box>
          </Box>

          <Box className={classes.buttons}>
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
