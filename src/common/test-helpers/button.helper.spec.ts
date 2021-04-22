import { Button } from "@map-colonies/react-core";
import { ReactWrapper, ShallowWrapper } from "enzyme";

/* eslint-disable */
export const getButtonById = (wrapper: ReactWrapper | ShallowWrapper, id: string): ReactWrapper | ShallowWrapper => {
  return wrapper
    // @ts-ignore
    .findWhere((n) => {
      return n.type() === Button &&
        n.prop('children').props['id'] === id;
    });
};

describe.skip('Button helpers dummy suite', () => {
  it('dummy test', () => {
    expect(true).toBe(true);
  });
});
/* eslint-enable */
