import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from '.';
import TestWrapper from 'testUtilities/TestWrapper';
import activeNotification from 'testUtilities/activeNotification';

describe('Notification', () => {
  it('renders', () => {
    expect.assertions(1);

    const { getByText } = render(
      <Notification notification={activeNotification} />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const notificationContent = getByText(activeNotification.content);
    
    expect(notificationContent).toBeTruthy();
  });
});
