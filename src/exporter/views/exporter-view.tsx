import React, { useState, useEffect } from 'react';
import {
  TileLayer,
  TileWMTS,
  TileWMS,
  TileXYZ,
  TileOsm,
  getWMTSOptions,
  getWMSOptions,
  getXYZOptions
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Button, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { Polygon } from 'geojson';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import EXPORTER_CONFIG from '../../common/config';
import { ExportDialog } from '../components/export/export-dialog';
import { ResponseState } from '../../common/models/ResponseState';
import { ExportSatusTableDialog } from '../components/export-table/export-table-dialog';
import { ExportStoreError } from '../../common/models/exportStoreError';
import { BBoxAreaLimit } from '../../common/helpers/bbox-area';

type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

const wmtsOptions = getWMTSOptions({
  attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.WMTS_LAYER.URL,
  layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
  projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
  format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  matrixSet: EXPORTER_CONFIG.WMTS_LAYER.MATRIX_SET,
  style: EXPORTER_CONFIG.WMTS_LAYER.STYLE,
});

const wmsOptions = getWMSOptions({
  attributions: EXPORTER_CONFIG.WMS_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.WMS_LAYER.URL,
  params: EXPORTER_CONFIG.WMS_LAYER.PARAMS as {[key: string]: string},
  serverType: EXPORTER_CONFIG.WMS_LAYER.SERVERTYPE as ServerType,
  transition: EXPORTER_CONFIG.WMS_LAYER.TRANSITION,
});

const xyzOptions = getXYZOptions({
  attributions: EXPORTER_CONFIG.XYZ_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.XYZ_LAYER.URL,
});

interface SnackDetails {
  message: string;
}

const ExporterView: React.FC = observer(() => {
  const { exporterStore } = useStore();
  const onExportClick = (): void => {
    setOpen(true);
  }
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [isDrawDisabled, setDrawDisabled] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({ message: '' });
  const intl = useIntl();
  const onExportStatusClick = (): void => {
    setOpenStatus(true);
  }
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
    if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_LARGE)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed.draw.bbox.large',
      });
    }
    else if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_SMALL)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed.draw.bbox.small',
      });
    }
  }, [exporterStore, exporterStore.errors]);

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.ERROR_SAVING_EXPORT)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.server.failed',
      });
      setOpen(false);
    }
  }, [exporterStore, exporterStore.errors]);

  const handleError = (isWithinLimit : BBoxAreaLimit): void => {
    const key = isWithinLimit === BBoxAreaLimit.TOO_BIG ? ExportStoreError.BBOX_AREA_TOO_LARGE : ExportStoreError.BBOX_AREA_TOO_SMALL;
    exporterStore.addError({
      key: key,
      request: undefined
    });
  }

  return (
    <MapContainer
      selectionPolygon={exporterStore.searchParams.geojson as Polygon}
      handlePolygonSelected={exporterStore.searchParams.setLocation}
      handlePolygonReset={exporterStore.searchParams.resetLocation.bind(
        exporterStore.searchParams
      )}
      handleError={handleError}
      isDrawDisabled={isDrawDisabled}
      filters={[
        <>
          <Button
            raised
            disabled={exporterStore.searchParams.geojson && !isDrawDisabled ? false : true}
            onClick={onExportClick}>
            <FormattedMessage id="export.export-btn.text" />
          </Button>
          {
            exporterStore.searchParams.geojson && open && <ExportDialog
              isOpen={open}
              onSetOpen={setOpen}
              selectedPolygon={exporterStore.searchParams.geojson as Polygon}
              handleExport={exporterStore.startExportGeoPackage}>
            </ExportDialog>
          }
          {
            !!snackOpen && <Snackbar
              open={snackOpen}
              onOpen={(): void => {
                if (exporterStore.hasErrors()) {
                  setDrawDisabled(true);
                } else {
                  // on success (no errors)
                  exporterStore.searchParams.resetLocation();
                  setOpen(false);
                }
              }}
              onClose={(evt): void => {
                if (exporterStore.hasErrors()) {
                  if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_LARGE) || 
                      exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_SMALL)) {
                    exporterStore.searchParams.resetLocation();
                  }
                  setDrawDisabled(false);
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
          <Button
            raised
            onClick={onExportStatusClick}>
            <FormattedMessage id="export.export-status-btn.text" />
          </Button>
          {
            openStatus && <ExportSatusTableDialog
              isOpen={openStatus}
              onSetOpen={setOpenStatus}>
            </ExportSatusTableDialog>
          }
        </>
      ]}
      mapContent={
        <>
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'OSM_DEFAULT' && <TileLayer>
              <TileOsm />
            </TileLayer>
          }
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && <TileLayer>
              <TileWMTS options={wmtsOptions} />
            </TileLayer>
          }
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && <TileLayer>
              <TileWMS options={wmsOptions} />
            </TileLayer>
          }

          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && <TileLayer>
              <TileXYZ options={xyzOptions} />
            </TileLayer>
          }
        </>

      }
    />
  );
});

export default ExporterView;
