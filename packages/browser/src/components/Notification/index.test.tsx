import React from 'react';
import { render } from '@testing-library/react';
import TestWrapper from 'testUtilities/TestWrapper';
import activeNotification from 'testUtilities/activeNotification';
import Notification from '.';

describe('Notification', () => {
  it('renders', () => {
    expect.assertions(1);

    const { getByText } = render(
      <Notification notification={activeNotification} />,
      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );

    const notificationContent = getByText(activeNotification.content);

    expect(notificationContent).toBeTruthy();
  });
});
