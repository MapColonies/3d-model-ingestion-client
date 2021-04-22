import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from '@map-colonies/react-core';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
// eslint-disable-next-line
import '../../../../__mocks__/confEnvShim';
import { ProgressRenderer } from './progress.cell-renderer';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: 0,
  valueFormatted: null,
  getValue: () => {},
  setValue: () => {},
  formatValue: () => {},
  data: {progress: 0} as any,
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'progress',false),
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

describe('AgGrid ProgressRenderer component', () => {
  it('renders correctly', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <ProgressRenderer {...mockData} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('value of progress 80 shown as 80%', () => {
    const value = 80;
    const mockData = {
      ...mockDataBase,
      value,
      data: { progress: value }
    };

    const wrapper = shallow(
      <ProgressRenderer {...mockData} />
    );
    
    const percContainer = wrapper.find(Typography);
    expect(percContainer.text()).toBe('80%');
  });

  it('value of progress 0.8 shown as 0.8%', () => {
    const value = 0.8;
    const mockData = {
      ...mockDataBase,
      value,
      data: { progress: value }
    };

    const wrapper = shallow(
      <ProgressRenderer {...mockData} />
    );
    
    const percContainer = wrapper.find(Typography);
    expect(percContainer.text()).toBe('0.8%');
  });
});
