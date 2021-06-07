import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { ModelInfo } from '../../models/exporterStore';
import { ExportStoreError } from '../../../common/models/exportStoreError';
import { useStore } from '../../models/rootStore';
import { NotchLabel } from './notch-label';

import './export-dialog.css';

const FIRST_CHAR_IDX = 0;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      maxWidth: 'none',
      background: 'blue'
    },
    title: {
      borderBottom: '1px solid lightgray'
    },
    placeholder: {
      height: '16px'
    },
    formError: {
      display: 'block',
      position: 'relative',
      color: theme.palette.error.main,
      fontSize: '12px',
      top: '-16px',
      left: '22px',
      width: '200px',
      height: '16px'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
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
    modelPathAndTileset: {
      display: 'flex',
      marginTop: '30px'
    },
    form: {
      height: '100%',
      overflow: 'hidden'
    },
    metadata: {
      maxHeight: '770px',
      justifyContent: 'space-around',
      borderRadius: '10px',
      border: '1px solid lightgray',
      padding: '20px',
      overflowY: 'auto'
    },
    metadataLabel: {
      display: 'block',
      position: 'relative',
      left: '23px',
      top: '13px'
    },
    textFieldRow: {
      display: 'flex',
      marginBottom: '16px'
    },
    textFieldRowWithValidation: {
      display: 'flex'
    },
    textFieldLastRow: {
      display: 'flex'
    },
    textFieldBox: {
      marginBottom: '16px'
    },
    textFieldBoxEnd: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'flex-end'
    },
    textField: {
      minWidth: '230px',
      marginTop: '5px',
      marginRight: '5px',
      marginLeft: '5px'
    },
    long: {
      minWidth: '200%'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
      gap: '16px'
    }
  })
);

const validate = (values: ModelInfo, intl: IntlShape): GeometryError => {
  const errors: GeometryError = { geometryFormat: '' };
  
  // eslint-disable-next-line
  if (values.wktGeometry != undefined &&
    !new RegExp('POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION|TRIANGLE|TIN|POLYHEDRALSURFACE').test(values.wktGeometry)) {
    errors.geometryFormat = intl.formatMessage({ id: 'ingestion.dialog.form-error.invalid.geometry' });
  }

  return errors;
};

// eslint-disable-next-line
const isValidText = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data) {
    return true;
  }
  const charIdx = data.search(/[a-zA-Z0-9-_.)]+/i);
  return (charIdx === FIRST_CHAR_IDX);
};

// eslint-disable-next-line
const isValidDate = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data) {
    return true;
  }
  const charIdx = data.search(/[TZ0-9-:.)]+/i);
  return (charIdx === FIRST_CHAR_IDX);
};

interface ExportDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  handleExport: (modelInfo: ModelInfo) => void;
}

interface GeometryError {
  geometryFormat: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = observer((props) => {
  const { exporterStore } = useStore();
  const { isOpen, onSetOpen, handleExport } = props;
  const classes = useStyle();
  const intl = useIntl();
  const currentDate = new Date().toISOString();
  const formik = useFormik({
    initialValues: {
      modelPath: '',
      tilesetFilename: 'tileset.json',
      identifier: '',
      typename: 'typename',
      schema: 'schema',
      mdSource: 'mdSource',
      xml: 'xml',
      anytext: 'anytext',
      insertDate: currentDate,
      creationDate: currentDate,
      validationDate: currentDate,
      wktGeometry: 'POINT(0 0)',
      title: '',
      producerName: 'IDFMU',
      description: '',
      type: '',
      classification: '',
      srs: '',
      projectName: '',
      version: '',
      centroid: '',
      footprint: '',
      timeBegin: currentDate,
      timeEnd: currentDate,
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
      const err = validate(values, intl);
      if (!err.geometryFormat) {
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
      } else {
        setFormErrors(err);
      }
    },
  });

  const [formErrors, setFormErrors] = useState({ geometryFormat: '' });
  const [serverErrors, setServerErrors] = useState({ duplicate: '' });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  // eslint-disable-next-line
  const checkText = (e: React.ChangeEvent<any>) => {
    if (formErrors.geometryFormat) {
      setFormErrors({ ...formErrors, geometryFormat: '' });
    }
    return isValidText(e) ? formik.handleChange(e) : false;
  };

  // eslint-disable-next-line
  const checkDate = (e: React.ChangeEvent<any>) => {
    return isValidDate(e) ? formik.handleChange(e) : false;
  };

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.DUPLICATE_PATH)) {
      setServerErrors({ ...serverErrors, duplicate: 'export.dialog.duplicate-path.text' });
      exporterStore.cleanError(ExportStoreError.DUPLICATE_PATH);
    }
  }, [exporterStore, exporterStore.errors, serverErrors]);

  return (
    <Box id="ingestionDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle className={classes.title}>
          <FormattedMessage id="ingestion.dialog.title" />
        </DialogTitle>
        <DialogContent className={classes.form}>
          <form onSubmit={formik.handleSubmit}>
            <Box className={classes.modelPathAndTileset}>
              <Box>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.model_path' })}
                  id="modelPath"
                  name="modelPath"
                  type="text"
                  onChange={checkText}
                  value={formik.values.modelPath}
                  className={`${classes.textFieldBox} ${classes.long}`}
                />
              </Box>
              <Box className={classes.textFieldBoxEnd}>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.tileset_filename' })}
                  id="tilesetFilename"
                  name="tilesetFilename"
                  type="text"
                  onChange={checkText}
                  value={formik.values.tilesetFilename}
                  className={classes.textFieldBox}
                />
              </Box>
            </Box>
            <Box className={classes.metadataLabel}>
              <NotchLabel text={intl.formatMessage({ id: 'ingestion.dialog.metadata' })} />
            </Box>
            <Box className={classes.metadata}>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.identifier' })}
                    id="identifier"
                    name="identifier"
                    type="text"
                    onChange={checkText}
                    value={formik.values.identifier}
                    className={classes.textField}
                  />
                </Box>
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.typename' })}
                  id="typename"
                  name="typename"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.typename}
                />
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.schema' })}
                  id="schema"
                  name="schema"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.schema}
                />
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.md_source' })}
                  id="mdSource"
                  name="mdSource"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.mdSource}
                />
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.xml' })}
                  id="xml"
                  name="xml"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.xml}
                />
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.anytext' })}
                  id="anytext"
                  name="anytext"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.anytext}
                />
                <TextField
                  label={intl.formatMessage({ id: 'ingestion.dialog.field.insert_date' })}
                  id="insertDate"
                  name="insertDate"
                  type="hidden"
                  onChange={checkText}
                  value={formik.values.insertDate}
                />
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.creation_date' })}
                    id="creationDate"
                    name="creationDate"
                    type="text"
                    onChange={checkDate}
                    value={formik.values.creationDate}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.validation_date' })}
                    id="validationDate"
                    name="validationDate"
                    type="text"
                    onChange={checkDate}
                    value={formik.values.validationDate}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRowWithValidation}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.wkt_geometry' })}
                    id="wktGeometry"
                    name="wktGeometry"
                    type="text"
                    onChange={checkText}
                    value={formik.values.wktGeometry}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.title' })}
                    id="title"
                    name="title"
                    type="text"
                    onChange={checkText}
                    value={formik.values.title}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.producer_name' })}
                    id="producerName"
                    name="producerName"
                    type="text"
                    defaultValue={formik.values.producerName}
                    className={`${classes.textField} ${classes.readOnly}`}
                    readOnly
                  />
                </Box>
              </Box>
              {
                (formErrors.geometryFormat) ?
                <div className={classes.formError}>{formErrors.geometryFormat}</div> : 
                <div className={classes.placeholder}></div>
              }
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.description' })}
                    id="description"
                    name="description"
                    type="text"
                    onChange={checkText}
                    value={formik.values.description}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.type' })}
                    id="type"
                    name="type"
                    type="text"
                    onChange={checkText}
                    value={formik.values.type}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.classification' })}
                    id="classification"
                    name="classification"
                    type="text"
                    onChange={checkText}
                    value={formik.values.classification}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.srs' })}
                    id="srs"
                    name="srs"
                    type="text"
                    onChange={checkText}
                    value={formik.values.srs}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.project_name' })}
                    id="projectName"
                    name="projectName"
                    type="text"
                    onChange={checkText}
                    value={formik.values.projectName}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.version' })}
                    id="version"
                    name="version"
                    type="text"
                    onChange={checkText}
                    value={formik.values.version}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.centroid' })}
                    id="centroid"
                    name="centroid"
                    type="text"
                    onChange={checkText}
                    value={formik.values.centroid}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.footprint' })}
                    id="footprint"
                    name="footprint"
                    type="text"
                    onChange={checkText}
                    value={formik.values.footprint}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.time_begin' })}
                    id="timeBegin"
                    name="timeBegin"
                    type="text"
                    onChange={checkDate}
                    value={formik.values.timeBegin}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.time_end' })}
                    id="timeEnd"
                    name="timeEnd"
                    type="text"
                    onChange={checkDate}
                    value={formik.values.timeEnd}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.sensor_type' })}
                    id="sensorType"
                    name="sensorType"
                    type="text"
                    onChange={checkText}
                    value={formik.values.sensorType}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.region' })}
                    id="region"
                    name="region"
                    type="text"
                    onChange={checkText}
                    value={formik.values.region}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.nominal_resolution' })}
                    id="nominalResolution"
                    name="nominalResolution"
                    type="text"
                    onChange={checkText}
                    value={formik.values.nominalResolution}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.accuracy_le90' })}
                    id="accuracyLE90"
                    name="accuracyLE90"
                    type="text"
                    onChange={checkText}
                    value={formik.values.accuracyLE90}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.horizontal_accuracy_ce90' })}
                    id="horizontalAccuracyCE90"
                    name="horizontalAccuracyCE90"
                    type="text"
                    onChange={checkText}
                    value={formik.values.horizontalAccuracyCE90}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldLastRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.relative_accuracy_le90' })}
                    id="relativeAccuracyLE90"
                    name="relativeAccuracyLE90"
                    type="text"
                    onChange={checkText}
                    value={formik.values.relativeAccuracyLE90}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.estimated_precision' })}
                    id="estimatedPrecision"
                    name="estimatedPrecision"
                    type="text"
                    onChange={checkText}
                    value={formik.values.estimatedPrecision}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({ id: 'ingestion.dialog.field.measured_precision' })}
                    id="measuredPrecision"
                    name="measuredPrecision"
                    type="text"
                    onChange={checkText}
                    value={formik.values.measuredPrecision}
                    className={classes.textField}
                  />
                </Box>
              </Box>

              {
                Object.entries(serverErrors).map(([error, value], index) => {
                  return value ?
                  <div key={index} className={classes.errorContainer}>
                    {`${intl.formatMessage({ id: 'general.error.label' })}: ${intl.formatMessage({ id: value })}`}
                  </div> :
                  null
                })
              }

            </Box>
            
            <Box className={classes.buttons}>
              <Button type="button" onClick={(): void => { handleClose(false); }}>
                <FormattedMessage id="general.cancel-btn.text" />
              </Button>
              <Button raised type="submit" disabled={!!formErrors.geometryFormat || !!serverErrors.duplicate || 
                !formik.values.modelPath ||
                !formik.values.tilesetFilename ||
                !formik.values.identifier}>
                <FormattedMessage id="general.ok-btn.text" />
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>

  );
});
