import { ReactWrapper, ShallowWrapper } from 'enzyme';
import { act } from '@testing-library/react';
import { TextField } from '@map-colonies/react-core';

/* eslint-disable */
export const getField = (wrapper: ReactWrapper, fieldName: string) => {
  return wrapper
    .findWhere((n) => {
      return n.type() === TextField &&
        n.prop('name') === fieldName;
    });
};

export const getFieldValue = (wrapper: ReactWrapper | ShallowWrapper, fieldName: string) => {
  const field = wrapper.find(TextField).find({ name: fieldName }).find(TextField);
  // eslint-disable-next-line
  return field.props().value;
};

export const updateFieldAsync = async (wrapper: ReactWrapper, fieldName: string, value: number | string) => {
  const fieldWrapper = wrapper.find(TextField).find({ name: fieldName }).find('input');

  // eslint-disable-next-line
  await act(async () => {
    // await new Promise(resolve => setTimeout(resolve, 0));
    fieldWrapper.simulate('change', {
      nativeEvent: {
        data: value
      },
      // simulate changing e.target.name and e.target.value
      target: {
        name: fieldName,
        value
      },
    });
    fieldWrapper.simulate('blur');
  });

};

export const updateField = (wrapper: ReactWrapper, fieldName: string, value: number | string) => {
  const fieldWrapper = wrapper.find(TextField).find({ name: fieldName }).find('input');

  // fieldWrapper.simulate('focus');

  fieldWrapper.simulate('change', {
    nativeEvent: {
      data: value
    },
    // simulate changing e.target.name and e.target.value
    target: {
      name: fieldName,
      value
    },
  });

  // fieldWrapper.simulate('keyDown', {
  //   which: 27,
  //   target: {
  //     blur() {
  //       // Needed since <EditableText /> calls target.blur()
  //       fieldWrapper.simulate('blur');
  //     },
  //   },
  // });

  fieldWrapper.simulate('blur');
};

describe.skip('TextField helpers dummy suite', () => {
  it('dummy test', () => {
    expect(true).toBe(true);
  });
});
/* eslint-enable */
