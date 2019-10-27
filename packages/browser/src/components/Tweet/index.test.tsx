import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import Tweet from './index';

describe('Tweet', () => {
  it('render Tweet', async () => {
    expect.assertions(5);
    const deleteTweetHandler = jest.fn();
    const { container, getByText, getByAltText } = render(
      <Tweet tweet={tweet} deleteTweetHandler={deleteTweetHandler} />,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );

    const text = getByText(tweet.text);
    const link = getByText(tweet.link);
    const image = getByAltText('');
    const avatar = getByAltText(tweet.user.username);

    expect(container).toBeTruthy();
    expect(link).toBeTruthy();
    expect(image).toBeTruthy();
    expect(avatar).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
