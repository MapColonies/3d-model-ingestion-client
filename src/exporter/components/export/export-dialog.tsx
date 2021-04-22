import React, { useEffect, useState } from 'react';
import { Polygon } from 'geojson';
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
import { PackageInfo } from '../../models/exporterStore';
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
    maxZoomField: {
      width: '40%',
    },
  })
);

// eslint-disable-next-line
const isValidPackName = (e: React.ChangeEvent<any>): boolean => {
  // eslint-disable-next-line
  const data: string = (e.nativeEvent as any).data;
  if (!data)
    return true;

  const charIdx = data.search(/[a-zA-Z0-9-_)]+/i);
  return (charIdx === FIRST_CHAR_IDX);
};

const isValidZoomValue = (zoom: number): boolean => {
  return zoom >= EXPORTER_CONFIG.EXPORT.MIN_ZOOM && zoom <= EXPORTER_CONFIG.EXPORT.MAX_ZOOM;
}

const calcPackSize = (tiles: number): number => {
  return Math.ceil(tiles * EXPORTER_CONFIG.EXPORT.AVG_TILE_SIZE_MB);
}

interface ExportDialogProps {
  isOpen: boolean;
  selectedPolygon: Polygon;
  onSetOpen: (open: boolean) => void;
  handleExport: (packInfo: PackageInfo) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = observer((props) => {
  const { exporterStore } = useStore();
  const { isOpen, onSetOpen, selectedPolygon, handleExport } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      // TODO: Need to be fixed in Shared components - this override changes the value from number to string
      bottomLeftLat: selectedPolygon.coordinates[0][0][1].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
      bottomLeftLon: selectedPolygon.coordinates[0][0][0].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
      topRightLat: selectedPolygon.coordinates[0][2][1].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
      topRightLon: selectedPolygon.coordinates[0][2][0].toFixed(EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS),
      maxZoom: EXPORTER_CONFIG.EXPORT.DEFAULT_ZOOM,
      directoryName: '',
      packageName: ''
    },
    onSubmit: values => {
      void handleExport({
        directoryName: formik.values.directoryName,
        packName: formik.values.packageName,
        maxZoom: formik.values.maxZoom,
        sizeEst: calcPackSize(numTiles),
      });
    },
  });
  // eslint-disable-next-line
  const [numTiles, setNumTiles] = useState<number>(0);
  // eslint-disable-next-line
  const [pixelSize, setPixelSize] = useState<number | string>(0);

  useDebouncedLayoutEffect(() => {
    if (isValidZoomValue(formik.values.maxZoom)) {
      const tilesCount = getTilesCount(selectedPolygon, EXPORTER_CONFIG.EXPORT.MIN_ZOOM, formik.values.maxZoom) * EXPORTER_CONFIG.EXPORT.METRIX_SET_FACTOR;
      setNumTiles(tilesCount);
      setFormErrors({ minMaxZooms: '' });
    } else {
      setFormErrors({ minMaxZooms: intl.formatMessage({ id: 'custom-bbox.form-error.zoom.invalid.text' })});
    }
  }, DEBOUNCE_TIME, [formik.values.maxZoom, selectedPolygon]);

  useDebouncedLayoutEffect(() => {
    if (isValidZoomValue(formik.values.maxZoom)) {
      const resolution = getResolutionInMeteres(formik.values.maxZoom);
      setPixelSize(resolution);
    }
  }, DEBOUNCE_TIME, [formik.values.maxZoom]);

  const [formErrors, setFormErrors] = useState({ minMaxZooms: '' });
  const [serverErrors, setServerErrors] = useState({ duplicate: '', bboxAreaForResolution: '' });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  // eslint-disable-next-line
  const checkName = (e: React.ChangeEvent<any>) => {

    if (serverErrors.duplicate) {
      setServerErrors({ ...serverErrors, duplicate: '' });
    }
    return isValidPackName(e) ? formik.handleChange(e) : false;
  };

  // eslint-disable-next-line
  const checkZoomLevel = (e: React.ChangeEvent<any>) => {
    if (serverErrors.bboxAreaForResolution) {
      setServerErrors({ ...serverErrors, bboxAreaForResolution: '' });
    }
    
    return formik.handleChange(e);
  };

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.DUPLICATE_PATH)) {
      setServerErrors({ ...serverErrors, duplicate: 'export.dialog.duplicate-path.text' });
      exporterStore.cleanError(ExportStoreError.DUPLICATE_PATH);
    }
    else if(exporterStore.hasError(ExportStoreError.BBOX_TOO_SMALL_FOR_RESOLUTION)) {
      setServerErrors({ ...serverErrors, bboxAreaForResolution: 'export.dialog.bbox.resolution.validation.error.text' });
      exporterStore.cleanError(ExportStoreError.BBOX_TOO_SMALL_FOR_RESOLUTION);
    }
  }, [exporterStore, exporterStore.errors, serverErrors]);

  return (
    <Dialog open={isOpen} preventOutsideDismiss={true}>
      <DialogTitle>
        <FormattedMessage id="export.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              placeholder={intl.formatMessage({ id: 'export.dialog-field.directory_name.placeholder' })}
              id="directoryName"
              name="directoryName"
              type="text"
              onChange={checkName}
              value={formik.values.directoryName}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              placeholder={intl.formatMessage({ id: 'export.dialog-field.package_name.placeholder' })}
              id="packageName"
              name="packageName"
              type="text"
              onChange={checkName}
              value={formik.values.packageName}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.top_right_lat.label' })} />}
              id="topRightLat"
              name="topRightLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLat}
              className={classes.spacer}
              readOnly
              outlined
            />
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.top_right_lon.label' })} />}
              id="topRightLon"
              name="topRightLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLon}
              className={classes.spacer}
              readOnly
              outlined
            />
            <BBoxCorner corner={Corner.TOP_RIGHT} />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.bottom_left_lat.label' })} />}
              id="bottomLeftLat"
              name="bottomLeftLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLat}
              className={classes.spacer}
              readOnly
              outlined
            />
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.bottom_left_lon.label' })} />}
              id="bottomLeftLon"
              name="bottomLeftLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLon}
              className={classes.spacer}
              readOnly
              outlined
            />
            <BBoxCorner corner={Corner.BOTTOM_LEFT} />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'export.dialog-field.max_zoom.label' })}
              id="maxZoom"
              name="maxZoom"
              type="number"
              onChange={checkZoomLevel}
              value={formik.values.maxZoom}
              max={EXPORTER_CONFIG.EXPORT.MAX_ZOOM}
              min={EXPORTER_CONFIG.EXPORT.MIN_ZOOM}
              className={`${classes.spacer} ${classes.maxZoomField}`}
            />
            <Box style={{display: 'flex', alignItems: 'center'}}>
              {
                (!formErrors.minMaxZooms) ?
                  <Typography use="body2">
                    {pixelSize} {intl.formatMessage({ id: 'export.dialog-field.zoom_resolution.units.meter' })}
                  </Typography> :
                  null
              }
            </Box>
            <BBoxCorner corner={Corner.UNKNOWN} className={classes.noBorder} />
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
          {/* <Box style={{ display: 'flex' }}>
            <Typography use="body1" className={classes.infoLabel}>
              <FormattedMessage id="export.dialog-info.link.label" /> 
            </Typography>
            <Typography use="body2" id="exportDownloadLink">
              {intl.formatMessage({ id: 'export.dialog-info.link.pattern' }, {packageName: formik.values.packageName})}
            </Typography>
          </Box> */}

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
            <Button raised type="submit" disabled={!!formErrors.minMaxZooms || !formik.values.packageName || 
              !!serverErrors.duplicate || !formik.values.directoryName}>
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
});
