import React, { Children } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './index';
import TestWrapper from 'testUtilities/TestWrapper';

describe('Modal', () => {
  const backdropHandler = jest.fn();
  it('renders', () => {
    expect.assertions(2);
    const childrenElement = <div data-testid="children" />;
    const { getByTestId, queryByTestId } = render(
      <Modal backdropHandler={backdropHandler} children={childrenElement} />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const backdrop = getByTestId('backdrop');
    const children = queryByTestId('children');

    userEvent.click(backdrop);

    expect(backdropHandler).toHaveBeenCalledTimes(1);
    expect(Children).toBeTruthy();
  });
});
