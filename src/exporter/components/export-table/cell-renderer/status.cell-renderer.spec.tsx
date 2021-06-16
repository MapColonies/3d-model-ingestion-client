import React from 'react';
import { shallow } from 'enzyme';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
import { StatusRenderer } from './status.cell-renderer';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: '',
  valueFormatted: null,
  getValue: () => {},
  setValue: () => {},
  formatValue: () => {},
  data: {status: ''} as any,
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'status',false),
  $scope: null,
  rowIndex: 1,
  api: new GridApi(),
  columnApi: new ColumnApi(),
  context: null,
  refreshCell: () => {},
  eGridCell: document.createElement('span'),
  eParentOfValue: document.createElement('span'),
  addRenderedRowListener: () => {},
};
/* eslint-enable */

describe('AgGrid StatusRenderer component', () => {
  it('renders correctly', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <StatusRenderer {...mockData} />
    );

    expect(wrapper).toMatchSnapshot();
  });

});
