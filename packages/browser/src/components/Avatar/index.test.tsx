import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import Avatar from '.';

describe('Avatar', () => {
  const avatar = 'mockavatar';
  const mockAltText = 'mockAltText';
  it('render Avatar', () => {
    expect.assertions(2);

    const { container, getByAltText } = render(
      <Avatar avatar={avatar} altText={mockAltText} />,
      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );
    const img = getByAltText(mockAltText);

    expect(container).toBeTruthy();
    expect(img).toBeTruthy();
  });
});
