import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import user from 'testUtilities/user';
import TestWrapper from 'testUtilities/TestWrapper';
import UserItem from './index';

describe('UserItem', () => {
  it('render UserItem', () => {
    expect.assertions(1);

    const { container } = render(<UserItem user={user} />, {
      wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
    });

    expect(container).toMatchSnapshot();
  });
});
