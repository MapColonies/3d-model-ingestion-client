// eslint-disable-next-line
import '../../__mocks__/confEnvShim';
import { Polygon } from '@turf/helpers';
import { BBoxAreaLimit, isBBoxWithinLimit } from './bbox-area';

const okPolygon: Polygon = {
  type: 'Polygon',
  coordinates: [[[32, 35], [], [31, 34], []]],
};

const largePolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [4.356643689113946, 19.746710300407173],
      [62.672002809741834, 19.746710300407173],
      [62.672002809741834, 45.01407951507276],
      [4.356643689113946, 45.01407951507276],
      [4.356643689113946, 19.746710300407173],
    ],
  ],
};

const smallPolygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ],
};

describe('Polygon area limit', () => {
  it('has a valid area size', () => {
    const res = isBBoxWithinLimit(okPolygon);

    expect(res).toEqual(BBoxAreaLimit.OK);
  });

  it('is larger than upper bound', () => {
    const res = isBBoxWithinLimit(largePolygon);

    expect(res).toEqual(BBoxAreaLimit.TOO_BIG);
  });

  it('is smaller than lower bound', () => {
    const res = isBBoxWithinLimit(smallPolygon);

    expect(res).toEqual(BBoxAreaLimit.TOO_SMALL);
  });
});
