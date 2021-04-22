import { ReactWrapper } from 'enzyme';
import React, { ReactElement } from 'react';
import { act, waitFor } from '@testing-library/react';

/* eslint-disable */
interface asyncRenderModel {
  (renderMethod: (node: ReactElement) =>
    ReactWrapper<any>, component: ReactElement): Promise<ReactWrapper<any>>
}

export const waitForComponentToPaint = async (wrapper: any) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
};

export const asyncRender: asyncRenderModel = async (renderMethod, component) => {
  let result = renderMethod(<></>);
  try {
    await waitFor(() => {
      result = renderMethod(component)
    })
  } catch (e) {
    console.error(e)
  }
  return result;
}

// USAGE EXAMPLE
// it('test', async () => {
//   const mockStore = rootStore.create({}, { fetch: packagesFetcher });
//   const wrapper = await asyncRender(mount,
//     <StoreProvider value={mockStore}>
//       <IntlProvider locale={'en'} messages={MESSAGES['en']}>
//         <ExportDialog
//           isOpen={true}
//           onSetOpen={setOpenFn}
//           selectedPolygon={polygon}
//           handleExport={handleExport}
//         />
//       </IntlProvider>
//     </StoreProvider>
//   );
//   expect(true).toBe(true);
// });

describe.skip('General helpers dummy suits', () => {
  it('dummy test', () => {
    expect(true).toBe(true);
  });
});
/* eslint-enable */
