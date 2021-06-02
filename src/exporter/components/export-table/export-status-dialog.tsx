import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams, GridReadyEvent, GridApi } from 'ag-grid-community';
import { Dialog, DialogTitle, DialogContent, Button } from '@map-colonies/react-core';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Box } from '@map-colonies/react-components';
import EXPORTER_CONFIG from '../../../common/config';
import { useStore } from '../../models/rootStore';
import { IExportTaskStatus, IBbox } from '../../models/exportTaskStatus';
import { ProgressRenderer } from './cell-renderer/progress.cell-renderer';
import { LinkRenderer } from './cell-renderer/link.cell-renderer';
import './export-status-dialog.css';

const unsetSize = 0;

interface ExportStatusDialogProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}

export const ExportStatusDialog: React.FC<ExportStatusDialogProps> = observer(
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
          headerName: intl.formatMessage({ id: 'ingestion.status.field.id' }),
          width: 320,
          field: 'id',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.resourceId' }),
          width: 320,
          field: 'resourceId',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.version' }),
          width: 100,
          field: 'version',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.type' }),
          width: 140,
          field: 'type',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.description' }),
          width: 200,
          field: 'description',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.status' }),
          width: 150,
          field: 'status',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.reason' }),
          width: 200,
          field: 'reason',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.parameters' }),
          width: 180,
          field: 'parameters',
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.creationTime' }),
          width: 150,
          field: 'creationTime',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderDate(data.creationDate);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.updateTime' }),
          width: 150,
          field: 'updateTime',
          cellRenderer: (props: ICellRendererParams): string => {
            const data = props.data as IExportTaskStatus;
            return renderDate(data.lastUpdateTime);
          },
          suppressMovable: true,
        },
        {
          headerName: intl.formatMessage({ id: 'ingestion.status.field.percentage' }),
          width: 120,
          field: 'percentage',
          cellRenderer: 'progressRenderer',
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
      // let pollingInterval: NodeJS.Timeout;
      if (isOpen) {
        void exporterStore.getJobs();
        /*pollingInterval = setInterval(() => {
          setPollingCycle(pollingCycle + 1);
          void exporterStore.getJobs();
        }, EXPORTER_CONFIG.EXPORT.POLLING_CYCLE_INTERVAL);*/
      }

      return (): void => {
        // clearInterval(pollingInterval);
      };
    }, [isOpen, exporterStore, pollingCycle]);

    return (
      <Box id="exportTable">
        <Dialog open={isOpen} preventOutsideDismiss={true}>
          <DialogTitle>
            <FormattedMessage id="ingestion.status.dialog.title" />
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
