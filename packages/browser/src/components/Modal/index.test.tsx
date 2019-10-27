import React, { Children } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestWrapper from 'testUtilities/TestWrapper';
import Modal from './index';

describe('Modal', () => {
  const backdropHandler = jest.fn();
  it('renders', () => {
    expect.assertions(2);
    const childrenElement = <div data-testid="children" />;
    const { getByTestId } = render(
      <Modal backdropHandler={backdropHandler}>{childrenElement}</Modal>,
      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );

    const backdrop = getByTestId('backdrop');

    userEvent.click(backdrop);

    expect(backdropHandler).toHaveBeenCalledTimes(1);
    expect(Children).toBeTruthy();
  });
});
