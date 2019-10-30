import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import user from 'testUtilities/user';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import populateFormData from 'utilities/populateFormData';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import UserForm from './index';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.patch.mockResolvedValue({ data: { data: { user } } });

jest.mock('utilities/populateFormData');

const populateFormDataMock = populateFormData as jest.Mock<any>;
populateFormDataMock.mockReturnValue(new FormData());

describe('UserForm', () => {
  const token = 'mockToken';
  const setNotification = jest.fn();
  const updateUser = jest.fn();
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('render UserForm', async () => {
    expect.assertions(7);
    const history = createMemoryHistory();
    history.push({
      pathname: ``,
      state: { user },
    });
    const { getByText, getByPlaceholderText } = render(
      <UserForm
        setNotification={setNotification}
        updateUser={updateUser}
        token={token}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const submitButton = getByText('Save Changes');

    const credentials = [
      {
        value: 'https://github.com',
        placeholder: 'Website',
      },
      {
        value: 'newUsername',
        placeholder: 'Username',
      },
      {
        value: 'newHandle',
        placeholder: 'Handle',
      },
    ];
    credentials.forEach(({ value, placeholder }) => {
      const input = getByPlaceholderText(placeholder);
      userEvent.type(input, value);
      expect(input).toHaveAttribute('value', value);
    });

    userEvent.click(submitButton);

    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:8090/users/user/profile',
        {
          handle: 'newHandle',
          username: 'newUsername',
          website: 'https://github.com',
        },
        {
          headers: { Authorization: 'bearer mockToken' },
        },
      );
      expect(updateUser).toHaveBeenCalledTimes(1);
      expect(updateUser).toHaveBeenCalledWith(user);
    });
  });
});
