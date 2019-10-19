import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import LoginPage from '.';
import TestWrapper from 'testUtilities/TestWrapper';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {} });
describe('LoginPage', () => {
  const email = 'testmail@test.test';
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
    const { container, getByText, getByPlaceholderText } = render(
      <LoginPage />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    for await (const { value, placeholder } of credentials) {
      const input = await waitForElement(() =>
        getByPlaceholderText(placeholder),
      );

      UserEvent.type(input, value);
      expect(input).toHaveAttribute('value', value);
    }

    const submitButton = await waitForElement(() => getByText('Log In'));

    UserEvent.click(submitButton);

    UserEvent.click(submitButton);
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
