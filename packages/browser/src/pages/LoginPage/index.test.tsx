import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import LoginPage from '.';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {} });

describe('LoginPage', () => {
  afterAll(() => jest.restoreAllMocks());
  const password = 'passwordpassword';

  it('it renders', async () => {
    expect.assertions(3);
    const credentials = [
      {
        value: 'testmail@test.test',
        placeholder: 'Email address',
      },
      {
        value: password,
        placeholder: 'Password',
      },
    ];
    const { getByText, getByPlaceholderText } = render(<LoginPage />, {
      wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
    });

    credentials.forEach(({ value, placeholder }) => {
      const input = getByPlaceholderText(placeholder);
      UserEvent.type(input, value);
      expect(input).toHaveAttribute('value', value);
    });

    const submitButton = getByText('Log In');

    UserEvent.click(submitButton);

    UserEvent.click(submitButton);
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
