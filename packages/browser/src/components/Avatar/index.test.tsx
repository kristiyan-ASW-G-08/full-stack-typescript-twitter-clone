import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Avatar from '.';
import TestWrapper from 'testUtilities/TestWrapper';

describe('Avatar', () => {
  const avatarURL = 'mockAvatarURL';
  const mockAltText = 'mockAltText';
  it('render Avatar', async () => {
    expect.assertions(2);

    const { container, getByAltText } = render(
      <Avatar avatarURL={avatarURL} altText={mockAltText} />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const img = await waitForElement(() => getByAltText(mockAltText));

    expect(container).toBeTruthy();
    expect(img).toBeTruthy();
  });
});
