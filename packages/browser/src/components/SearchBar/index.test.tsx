import React from 'react';
import {
  render,
  waitForElement,
  wait,
  getByTestId,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetForm, { SearchBar } from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import user from 'testUtilities/user';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({
  data: {
    data: { users: [user] },
    status: 200,
  },
});

describe('SearchBar', () => {
  it('render SearchBar', async () => {
    expect.assertions(4);

    const { container, getByTestId, getByPlaceholderText } = render(
      <SearchBar />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const input = await waitForElement(() =>
      getByPlaceholderText('Search TwittClone'),
    );

    UserEvent.type(input, 'user');

    expect(container).toBeTruthy();

    await wait(() => {
      //axios.get is called every type the user types
      expect(axios.get).toHaveBeenCalledTimes(4);
    });
    const usersList = await waitForElement(() => getByTestId('users-list'));
    expect(usersList.childElementCount).toBe(1);

    const userOption = await waitForElement(() => getByTestId(user._id));
    expect(userOption).toBeTruthy();
  });
});
