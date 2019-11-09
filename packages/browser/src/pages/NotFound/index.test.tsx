import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import NotFound from '.';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.patch.mockReturnValueOnce(Promise.resolve({ data: {}, status: 200 }));

const history = createMemoryHistory();

jest.spyOn(history, 'goBack');
jest.spyOn(history, 'push');
describe('NotFound', () => {
  afterAll(() => jest.restoreAllMocks());
  it('renders', async () => {
    expect.assertions(3);

    const { getByText } = render(<NotFound />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });

    const prevButton = getByText('Previous Page');

    UserEvent.click(prevButton);

    await wait(() => {
      expect(history.goBack).toHaveBeenCalledTimes(1);
    });

    const homeButton = getByText('Home');
    UserEvent.click(homeButton);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenLastCalledWith('/');
    });
  });
});
