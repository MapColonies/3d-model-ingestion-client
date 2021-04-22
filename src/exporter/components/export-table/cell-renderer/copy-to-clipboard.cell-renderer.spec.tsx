import React from 'react';
import { shallow } from 'enzyme';
import { ICellRendererParams, Column, RowNode, GridApi, ColumnApi } from 'ag-grid-community';
import { CopyToClipboardRenderer } from './copy-to-clipboard.cell-renderer';

/* eslint-disable */
const mockDataBase:ICellRendererParams = {
  value: '',
  valueFormatted: null,
  getValue: () => './test/folder/file.gpkg',
  setValue: () => {},
  formatValue: () => {},
  data: {link: './test/folder/file.gpkg'} as any,
  node: new RowNode(),
  colDef: {},
  column: new Column({},null,'link',false),
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

describe('AgGrid CopyToClipboardRenderer component', () => {
  it('renders correctly', () => {
    const mockData = {
      ...mockDataBase
    };

    const wrapper = shallow(
      <CopyToClipboardRenderer {...mockData} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('value of content to be copied from getValue() finction', () => {
    const value = 'http://kuku.com/1';
    const mockData = {
      ...mockDataBase,
      value,
      data: { link: value },
    };

    const wrapper = shallow(
      <CopyToClipboardRenderer {...mockData} />
    );
    
    const linkContainer = wrapper.find('input');
    expect(linkContainer.props().value).toBe(mockDataBase.getValue());
  });
});
