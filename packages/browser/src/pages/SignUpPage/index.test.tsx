import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import SignUpPage from '.';
import TestWrapper from 'testUtilities/TestWrapper';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockReturnValueOnce(Promise.resolve({ data: {}, status: 200 }));
describe('SignUpPage', () => {
  it('it renders', async () => {
    expect.assertions(6);
    const password = 'passwordpassword';
    const credentials = [
      { value: 'newUsername', placeholder: 'Username' },
      {
        value: 'newHandle',
        placeholder: 'Handle',
      },
      {
        value: 'testmail@test.test',
        placeholder: 'Email address',
      },
      {
        value: password,
        placeholder: 'Password',
      },
      {
        value: password,
        placeholder: 'Repeat Password',
      },
    ];
    const { getByText, getByPlaceholderText } = render(<SignUpPage />, {
      wrapper: ({ children }) => <TestWrapper children={children} />,
    });

    for await (const { value, placeholder } of credentials) {
      const input = await waitForElement(() =>
        getByPlaceholderText(placeholder),
      );

      UserEvent.type(input, value);
      expect(input).toHaveAttribute('value', value);
    }

    const submitButton = await waitForElement(() => getByText('Sign Up'));

    UserEvent.click(submitButton);

    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
