import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import user from 'testUtilities/user';
import { SearchBar } from './index';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({
  data: {
    data: { users: [user] },
    status: 200,
  },
});

describe('SearchBar', () => {
  afterAll(() => jest.restoreAllMocks());

  it('render SearchBar', async () => {
    expect.assertions(4);

    const { container, getByTestId, getByPlaceholderText, getByText } = render(
      <SearchBar />,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );
    const input = getByPlaceholderText('Search TwittClone');

    UserEvent.type(input, 'user');

    expect(container).toBeTruthy();

    await wait(() => {
      // axios.get is called every type the user types
      expect(axios.get).toHaveBeenCalledTimes(4);
    });
    const usersList = getByTestId('datalist');
    expect(usersList.childElementCount).toBe(1);

    const userOption = () => getByText(`@${user.handle}`);
    expect(userOption).toBeTruthy();
  });
});
