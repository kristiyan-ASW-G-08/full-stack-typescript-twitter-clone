import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from './Notification';
import TestWrapper from 'testUtilities/TestWrapper';
import activeNotification from 'testUtilities/activeNotification';

describe('Notification', () => {
  it('it renders', async () => {
    expect.assertions(2);

    const { container, getByText, getByPlaceholderText } = render(
      <Notification notification={activeNotification} />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    expect(container).toBeTruthy();

    const notificationContent = await waitForElement(() =>
      getByText(activeNotification.content),
    );
    expect(notificationContent).toBeTruthy();
  });
});
