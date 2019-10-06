import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from '.';
import TestWrapper from 'testUtilities/TestWrapper';
import activeNotification from 'testUtilities/activeNotification';

describe('Notification', () => {
  it('renders', async () => {
    expect.assertions(2);

    const { container, getByText } = render(
      <Notification notification={activeNotification} />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const notificationContent = await waitForElement(() =>
      getByText(activeNotification.content),
    );

    expect(container).toBeTruthy();
    expect(notificationContent).toBeTruthy();
  });
});
