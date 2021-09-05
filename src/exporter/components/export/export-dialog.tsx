import React from 'react';
import { FormikErrors, useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { ModelInfo } from '../../models/exporterStore';
import { NotchLabel } from './notch-label';

import './export-dialog.css';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      maxWidth: 'none',
      background: 'blue',
    },
    title: {
      borderBottom: '1px solid lightgray',
    },
    placeholder: {
      height: '16px',
    },
    formError: {
      color: theme.palette.error.main,
      fontSize: '12px',
      marginLeft: '15px',
      maxHeight: '16px',
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
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
    modelPathAndTileset: {
      display: 'flex',
      marginTop: '30px',
      padding: '0 20px',
    },
    form: {
      height: '100%',
      overflow: 'hidden',
    },
    metadata: {
      maxHeight: '770px',
      justifyContent: 'space-around',
      borderRadius: '10px',
      border: '1px solid lightgray',
      padding: '20px',
      overflowY: 'auto',
    },
    metadataLabel: {
      display: 'block',
      position: 'relative',
      left: '23px',
      top: '13px',
    },
    textFieldRow: {
      display: 'flex',
      marginBottom: '16px',
    },
    textFieldRowWithValidation: {
      display: 'flex',
    },
    textFieldLastRow: {
      display: 'flex',
    },
    textFieldBox: {
      height: '72px',
    },
    textFieldBoxWithError: {
      marginBottom: '0',
    },
    textFieldBoxEnd: {
      height: '72px',
    },
    textFieldBoxStart: {
      flexGrow: 2,
      height: '72px',
    },
    textField: {
      minWidth: '250px',
      margin: '5px 5px 0 5px',
    },
    dateField: {
      margin: '5px 5px 0 5px',
    },
    textFieldPath: {
      width: '80%',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '16px',
      gap: '16px',
    },
  })
);

const validate =
  (intl: IntlShape) => (values: ModelInfo): FormikErrors<ModelInfo> => {
    const errors: FormikErrors<ModelInfo> = {};

    errors.modelPath = checkRequired(intl, values.modelPath);
    errors.tilesetFilename = checkRequired(intl, values.tilesetFilename);
    errors.identifier = checkRequired(intl, values.identifier);
    errors.wktGeometry = checkRequired(intl, values.wktGeometry);
    errors.title = checkRequired(intl, values.title);
    errors.producerName = checkRequired(intl, values.producerName);
    errors.type = checkRequired(intl, values.type);
    errors.classification = checkRequired(intl, values.classification);
    errors.srs = checkRequired(intl, values.srs);
    errors.version = checkRequired(intl, values.version);
    errors.sensorType = checkRequired(intl, values.sensorType);
    errors.region = checkRequired(intl, values.region);

    if(Object.values(errors).every(v => v === undefined)) {
      return {};
    }

    return errors;
  };

const checkRequired = (intl: IntlShape, value: string): string | undefined =>
  value === ''
    ? intl.formatMessage({ id: 'ingestion.dialog.form-error.invalid.required' })
    : undefined;

interface ExportDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  handleExport: (modelInfo: ModelInfo) => void;
}

interface GeometryError {
  geometryFormat: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = observer((props) => {
  const { isOpen, onSetOpen, handleExport } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik<ModelInfo>({
    initialValues: {
      modelPath: '',
      tilesetFilename: 'tileset.json',
      identifier: '',
      typename: 'typename',
      schema: 'schema',
      mdSource: 'mdSource',
      xml: 'xml',
      anytext: 'anytext',
      insertDate: '',
      creationDate: undefined,
      validationDate: undefined,
      wktGeometry: '',
      title: '',
      producerName: 'IDFMU',
      description: undefined,
      type: '3DTIles',
      classification: '',
      srs: '',
      projectName: undefined,
      version: '1',
      centroid: undefined,
      footprint: undefined,
      timeBegin: undefined,
      timeEnd: undefined,
      sensorType: '',
      region: '',
      nominalResolution: undefined,
      accuracyLE90: undefined,
      horizontalAccuracyCE90: undefined,
      relativeAccuracyLE90: undefined,
      estimatedPrecision: undefined,
      measuredPrecision: undefined,
    },
    onSubmit: (values) => {
      handleExport({
        ...values,
        insertDate: new Date().toISOString(),
        creationDate: dateStrToISOString(values.creationDate),
        validationDate: dateStrToISOString(values.validationDate),
        timeBegin: dateStrToISOString(values.timeBegin),
        timeEnd: dateStrToISOString(values.timeEnd),
      });
    },
    validate: validate(intl),
    isInitialValid: false,
  });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  const dateStrToISOString = (
    dateStr: string | undefined
  ): string | undefined =>
    dateStr !== undefined ? new Date(dateStr).toISOString() : undefined;
  const removeEmptyString = (str: string | undefined): string | undefined =>
    str !== undefined && str !== '' ? str : undefined;

  return (
    <Box id="ingestionDialog">
      <Dialog open={isOpen} preventOutsideDismiss={true}>
        <DialogTitle className={classes.title}>
          <FormattedMessage id="ingestion.dialog.title" />
        </DialogTitle>
        <DialogContent className={classes.form}>
          <form onSubmit={formik.handleSubmit}>
            <Box className={classes.modelPathAndTileset}>
              <Box className={classes.textFieldBoxStart}>
                <TextField
                  label={intl.formatMessage({
                    id: 'ingestion.dialog.field.model_path',
                  })}
                  id="modelPath"
                  name="modelPath"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.modelPath}
                  className={`${classes.textFieldBoxWithError} ${classes.textFieldPath}`}
                />
                {formik.errors.modelPath !== undefined &&
                  formik.touched.modelPath && (
                    <div className={classes.formError}>
                      {formik.errors.modelPath}
                    </div>
                  )}
              </Box>
              <Box className={classes.textFieldBoxEnd}>
                <TextField
                  label={intl.formatMessage({
                    id: 'ingestion.dialog.field.tileset_filename',
                  })}
                  id="tilesetFilename"
                  name="tilesetFilename"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tilesetFilename}
                  className={classes.textFieldBoxWithError}
                />
                {formik.errors.tilesetFilename !== undefined &&
                  formik.touched.tilesetFilename && (
                    <div className={classes.formError}>
                      {formik.errors.tilesetFilename}
                    </div>
                  )}
              </Box>
            </Box>
            <Box className={classes.metadataLabel}>
              <NotchLabel
                text={intl.formatMessage({ id: 'ingestion.dialog.metadata' })}
              />
            </Box>
            <Box className={classes.metadata}>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.identifier',
                    })}
                    id="identifier"
                    name="identifier"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.identifier}
                    className={classes.textField}
                  />
                  {formik.errors.identifier !== undefined &&
                    formik.touched.identifier && (
                      <div className={classes.formError}>
                        {formik.errors.identifier}
                      </div>
                    )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.creation_date',
                    })}
                    id="creationDate"
                    name="creationDate"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    value={formik.values.creationDate}
                    className={classes.dateField}
                    pattern="yyyy-MM-ddThh:mm:ss.SSSZ"
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.validation_date',
                    })}
                    id="validationDate"
                    name="validationDate"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    value={formik.values.validationDate}
                    className={classes.dateField}
                    pattern="yyyy-MM-ddThh:mm:ss.SSSZ"
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.wkt_geometry',
                    })}
                    id="wktGeometry"
                    name="wktGeometry"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.wktGeometry}
                    className={classes.textField}
                  />
                  {formik.errors.wktGeometry !== undefined &&
                    formik.touched.wktGeometry && (
                      <div className={classes.formError}>
                        {formik.errors.wktGeometry}
                      </div>
                    )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.title',
                    })}
                    id="title"
                    name="title"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    className={classes.textField}
                  />
                  {formik.errors.title !== undefined &&
                    formik.touched.title && (
                      <div className={classes.formError}>
                        {formik.errors.title}
                      </div>
                    )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.producer_name',
                    })}
                    id="producerName"
                    name="producerName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.producerName}
                    className={classes.textField}
                  />
                  {formik.errors.producerName !== undefined &&
                  formik.touched.producerName && (
                    <div className={classes.formError}>
                      {formik.errors.producerName}
                    </div>
                  )}
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.description',
                    })}
                    id="description"
                    name="description"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.type',
                    })}
                    id="type"
                    name="type"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.type}
                    className={classes.textField}
                  />
                  {formik.errors.type !== undefined &&
                  formik.touched.type && (
                    <div className={classes.formError}>
                      {formik.errors.type}
                    </div>
                  )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.classification',
                    })}
                    id="classification"
                    name="classification"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.classification}
                    className={classes.textField}
                  />
                  {formik.errors.classification !== undefined &&
                  formik.touched.classification && (
                    <div className={classes.formError}>
                      {formik.errors.classification}
                    </div>
                  )}
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.srs',
                    })}
                    id="srs"
                    name="srs"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.srs}
                    className={classes.textField}
                  />
                  {formik.errors.srs !== undefined &&
                  formik.touched.srs && (
                    <div className={classes.formError}>
                      {formik.errors.srs}
                    </div>
                  )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.project_name',
                    })}
                    id="projectName"
                    name="projectName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.projectName}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.version',
                    })}
                    id="version"
                    name="version"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.version}
                    className={classes.textField}
                  />
                  {formik.errors.version !== undefined &&
                  formik.touched.version && (
                    <div className={classes.formError}>
                      {formik.errors.version}
                    </div>
                  )}
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.centroid',
                    })}
                    id="centroid"
                    name="centroid"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.centroid}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.footprint',
                    })}
                    id="footprint"
                    name="footprint"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.footprint}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.time_begin',
                    })}
                    id="timeBegin"
                    name="timeBegin"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    value={formik.values.timeBegin}
                    className={classes.dateField}
                    pattern="yyyy-MM-ddThh:mm:ss.SSSZ"
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.time_end',
                    })}
                    id="timeEnd"
                    name="timeEnd"
                    type="datetime-local"
                    onChange={formik.handleChange}
                    value={formik.values.timeEnd}
                    className={classes.dateField}
                    pattern="yyyy-MM-ddThh:mm:ss.SSSZ"
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.sensor_type',
                    })}
                    id="sensorType"
                    name="sensorType"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sensorType}
                    className={classes.textField}
                  />
                  {formik.errors.sensorType !== undefined &&
                  formik.touched.sensorType && (
                    <div className={classes.formError}>
                      {formik.errors.sensorType}
                    </div>
                  )}
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.region',
                    })}
                    id="region"
                    name="region"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.region}
                    className={classes.textField}
                  />
                  {formik.errors.region !== undefined &&
                    formik.touched.region && (
                      <div className={classes.formError}>
                        {formik.errors.region}
                      </div>
                    )}
                </Box>
              </Box>
              <Box className={classes.textFieldRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.nominal_resolution',
                    })}
                    id="nominalResolution"
                    name="nominalResolution"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.nominalResolution}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.accuracy_le90',
                    })}
                    id="accuracyLE90"
                    name="accuracyLE90"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.accuracyLE90}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.horizontal_accuracy_ce90',
                    })}
                    id="horizontalAccuracyCE90"
                    name="horizontalAccuracyCE90"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.horizontalAccuracyCE90}
                    className={classes.textField}
                  />
                </Box>
              </Box>
              <Box className={classes.textFieldLastRow}>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.relative_accuracy_le90',
                    })}
                    id="relativeAccuracyLE90"
                    name="relativeAccuracyLE90"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.relativeAccuracyLE90}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.estimated_precision',
                    })}
                    id="estimatedPrecision"
                    name="estimatedPrecision"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.estimatedPrecision}
                    className={classes.textField}
                  />
                </Box>
                <Box className={classes.textFieldBox}>
                  <TextField
                    label={intl.formatMessage({
                      id: 'ingestion.dialog.field.measured_precision',
                    })}
                    id="measuredPrecision"
                    name="measuredPrecision"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.measuredPrecision}
                    className={classes.textField}
                  />
                </Box>
              </Box>
            </Box>

            <Box className={classes.buttons}>
              <Button
                type="button"
                onClick={(): void => {
                  handleClose(false);
                }}
              >
                <FormattedMessage id="general.cancel-btn.text" />
              </Button>
              <Button raised type="submit" disabled={!formik.isValid}>
                <FormattedMessage id="general.ok-btn.text" />
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
});
