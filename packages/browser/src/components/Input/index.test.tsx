import React from 'react';
import { render } from '@testing-library/react';
import { Formik, Form } from 'formik';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import userEvent from '@testing-library/user-event';
import Input from '.';

describe('Input', () => {
  const inputArr = [
    {
      name: 'username',
      value: 'John Doe',
      placeholder: 'Username',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      value: 'test@test.test',
      placeholder: 'Email',
    },
    {
      name: 'password',
      type: 'password',
      value: 'newPassword',
      placeholder: 'Password',
    },
  ];
  afterAll(() => jest.restoreAllMocks());
  it.each(inputArr)('render Input', ({ name, type, value, placeholder }) => {
    expect.assertions(3);
    const { getByPlaceholderText } = render(
      <Input name={name} placeholder={placeholder} type={type} />,
      {
        wrapper: ({ children }) => (
          <TestWrapper>
            <Formik
              validationSchema={{}}
              initialValues={{}}
              onSubmit={jest.fn()}
            >
              <Form>{children}</Form>
            </Formik>
          </TestWrapper>
        ),
      },
    );
    const input = getByPlaceholderText(placeholder);
    userEvent.type(input, value);
    expect(input).toHaveAttribute('name', name);
    expect(input).toHaveAttribute('type', type);
    expect(input).toHaveAttribute('value', value);
  });
});
