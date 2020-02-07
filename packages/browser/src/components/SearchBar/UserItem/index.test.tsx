import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import user from 'testUtilities/user';
import UserItem from './index';

describe('UserItem', () => {
  it('render UserItem', () => {
    expect.assertions(1);

    const { container } = render(<UserItem user={user} />);

    expect(container).toMatchSnapshot();
  });
});
