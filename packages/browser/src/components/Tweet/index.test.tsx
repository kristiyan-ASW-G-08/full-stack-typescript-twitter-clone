import React, { Context, Provider } from 'react';
import {
  render,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tweet from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';

describe('Tweet', () => {
  it('render Tweet', async () => {
    expect.assertions(5);

    const { container, getByText, getByAltText } = render(
      <Tweet tweet={tweet} />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const text = await waitForElement(() => getByText(tweet.text));
    const link = await waitForElement(() => getByText(tweet.link));
    const image = await waitForElement(() => getByAltText(''));
    const avatar = await waitForElement(() =>
      getByAltText(tweet.user.username),
    );

    expect(container).toBeTruthy();
    expect(link).toBeTruthy();
    expect(image).toBeTruthy();
    expect(avatar).toBeTruthy();
    expect(text).toBeTruthy();
  });
});
