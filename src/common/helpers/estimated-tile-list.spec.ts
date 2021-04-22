import { Polygon } from '@turf/helpers';
import { getTiles, getTilesCount } from './estimated-tile-list';

const minZoom = 1;
const maxZoom = 2;
const polygonGeometry:Polygon = {
  "type": "Polygon",
  "coordinates": [
    [ 
      [-50, 80], [150, 80], [150, -80], [150, -80], [-150, -80], 
      [-150, -70], [120, -70], [120, -30], [80, -30], [80, -20],
      [120, -20], [120, 20], [-50, 20], [-50, 80] 
    ]
  ]
};
const RESULT = [
  '1/0/0.png', '1/0/1.png', 
  '1/1/0.png', '1/1/1.png',
  '2/0/3.png', 
  '2/1/0.png', '2/1/1.png', '2/1/3.png',
  '2/2/0.png', '2/2/1.png', '2/2/2.png', '2/2/3.png',
  '2/3/0.png', '2/3/1.png', '2/3/2.png', '2/3/3.png',
];


describe('Polygon estimated tiles', () => {
  it('return an array of estimated tiles',  () => {
    const tilesArr = getTiles(polygonGeometry,minZoom, maxZoom);

    expect(tilesArr).toEqual(RESULT);
  });

  it('return an count of estimated tiles',  () => {
    const count = getTilesCount(polygonGeometry,minZoom, maxZoom);

    expect(count).toEqual(RESULT.length);
  });
});
