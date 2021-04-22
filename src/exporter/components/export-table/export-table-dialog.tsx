import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ICellRendererParams,
  GridReadyEvent,
  GridApi,
  ValueGetterParams,
} from 'ag-grid-community';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@map-colonies/react-core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Box } from '@map-colonies/react-components';
import EXPORTER_CONFIG from '../../../common/config';
import { useStore } from '../../models/rootStore';
import { IExportTaskStatus, IBbox } from '../../models/exportTaskStatus';
import { ProgressRenderer } from './cell-renderer/progress.cell-renderer';
import { LinkRenderer } from './cell-renderer/link.cell-renderer';
import './export-table-dialog.css';

const unsetSize = 0;

interface ExportSatusTableDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const ExportSatusTableDialog: React.FC<ExportSatusTableDialogProps> = observer(
  (props) => {
    const START_CYCLE_ITTERACTION = 0;
    const { exporterStore } = useStore();
    const { isOpen, onSetOpen } = props;
    const intl = useIntl();
    const [gridApi, setGridApi] = useState<GridApi>();
    const [colDef, setColDef] = useState<ColDef[]>([]);
    const [rowData, setRowData] = useState([]);
    const [isRtl] = useState<boolean>( EXPORTER_CONFIG.I18N.DEFAULT_LANGUAGE === 'he' ? true : false);
    const [pollingCycle, setPollingCycle] = useState(START_CYCLE_ITTERACTION);
    const pageSize = 10;

    const handleClose = (): void => {
      onSetOpen(false);
    };

    const renderDate = (date: Date | undefined): string => {
      return date
        ? moment(new Date(date.toLocaleString())).format('DD/MM/YYYY HH:mm')
        : '-';
    };

    const renderSize = (size: number): string => {
      return size !== unsetSize ? `${size}` : '-';
    };

    const renderBbox = (bbox: IBbox | undefined): string => {
      return bbox
        ? `Top right: ${bbox.topRight.lat}, ${bbox.topRight.lon}, Bottom left: ${bbox.bottomLeft.lat}, ${bbox.bottomLeft.lon}`
        : '';
    };

    const onGridReady = (params: GridReadyEvent): void => {
      setGridApi(params.api);
    };

    useEffect(() => {
      setColDef([
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.fileName.text',
          }),
          width: 200,
          field: 'fileName',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.status.text',
          }),
          width: 120,
          field: 'status',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.link.text',
          }),
          width: 120,
          field: 'link',
          cellRenderer: 'linkRenderer',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.creationDate.text',
          }),
          width: 170,
          field: 'creationDate',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderDate(data.creationDate);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.lastUpdateTime.text',
          }),
          width: 170,
          field: 'lastUpdateTime',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderDate(data.lastUpdateTime);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.progress.text',
          }),
          width: 120,
          field: 'progress',
          cellRenderer: 'progressRenderer',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.maxZoom.text',
          }),
          width: 120,
          field: 'maxZoom',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderSize(data.maxZoom);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.sourceLayer.text',
          }),
          width: 180,
          field: 'sourceLayer',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.sizeEst.text',
          }),
          width: 120,
          field: 'sizeEst',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderSize(data.sizeEst);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.realSize.text',
          }),
          width: 120,
          field: 'realSize',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderSize(data.realSize);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.expirationTime.text',
          }),
          width: 170,
          field: 'expirationTime',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderDate(data.expirationTime);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({
            id: 'export-table.table-column-header.bbox.text',
          }),
          width: 800,
          field: 'bbox',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            const polygon = data.polygon;

            const bboxFromPolygon :IBbox = {
              topRight: {
                lat: polygon.coordinates[0][2][1],
                lon: polygon.coordinates[0][2][0]
              },
              bottomLeft: {
                lat: polygon.coordinates[0][0][1],
                lon: polygon.coordinates[0][0][0]
              }
            }

            return renderBbox(bboxFromPolygon);
          },
          suppressMovable: true,
        },
      ]);
    }, [intl]);

    useEffect(() => {
      const updateRowData = (exportedPackages: IExportTaskStatus[]): void => {
        if (gridApi) {
          const itemsToUpdate = new Array<IExportTaskStatus>();
          const itemsToAdd = new Array<IExportTaskStatus>();
          const itemsToRemove = new Array<IExportTaskStatus>();

          // UPDATE or REMOVE 
          gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
            const data = rowNode.data as IExportTaskStatus;
            const item = exportedPackages.find(
              (elem) => elem.taskId === data.taskId
            );
            if (item) {
              if (
                item.status !== data.status ||
                item.lastUpdateTime !== data.lastUpdateTime ||
                item.progress !== data.progress
              ) {
                Object.keys(data).forEach((key: string) => { 
                  // eslint-disable-next-line
                  (data as any)[key] = (item as any)[key];
                });
                itemsToUpdate.push(data);
              }
            } else {
              itemsToRemove.push(data);
            }
          });

          // ADD not exisitng
          exportedPackages.forEach((elem) => {
            let isFound = false;
            gridApi.forEachNode((rowNode) => {
              const data = rowNode.data as IExportTaskStatus;
              isFound = isFound || elem.taskId === data.taskId;
            });
            // eslint-disable-next-line
            if (!isFound) {
              itemsToAdd.push(elem);
            }
          });

          gridApi.applyTransaction({
            update: itemsToUpdate,
            remove: itemsToRemove,
            add: itemsToAdd,
          });
        }
      };

      if (!pollingCycle) setRowData(exporterStore.exportedPackages);
      else updateRowData(exporterStore.exportedPackages);
    }, [exporterStore.exportedPackages, pollingCycle, gridApi]);

    useEffect(() => {
      let pollingInterval: NodeJS.Timeout;
      if (isOpen) {
        void exporterStore.getGeoPackages();
        pollingInterval = setInterval(() => {
          setPollingCycle(pollingCycle + 1);
          void exporterStore.getGeoPackages();
        }, EXPORTER_CONFIG.EXPORT.POLLING_CYCLE_INTERVAL);
      }

      return (): void => {
        clearInterval(pollingInterval);
      };
    }, [isOpen, exporterStore, pollingCycle]);

    return (
      <Box id="exportTable">
        <Dialog open={isOpen} preventOutsideDismiss={true}>
          <DialogTitle>
            <FormattedMessage id="export-table.dialog.title" />
          </DialogTitle>
          <DialogContent>
            <Box
              className="ag-theme-alpine"
              style={{
                height: '450px',
                width: '960px',
              }}
            >
              <AgGridReact
                onGridReady={onGridReady}
                pagination={true}
                paginationPageSize={pageSize}
                columnDefs={colDef}
                enableRtl={isRtl}
                rowData={rowData}
                overlayNoRowsTemplate={intl.formatMessage({
                  id: 'export-table.nodata',
                })}
                frameworkComponents={{
                  progressRenderer: ProgressRenderer,
                  linkRenderer: LinkRenderer,
                }}
              />
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '16px',
                gap: '16px',
              }}
            >
              <Button raised onClick={handleClose}>
                <FormattedMessage id="general.ok-btn.text" />
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
);
