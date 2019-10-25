import React from 'react';
import { render } from '@testing-library/react';
import FeedBar from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import userEvent from '@testing-library/user-event';

describe('FeedBar', () => {
  it('render FeedBar', () => {
    expect.assertions(4);
    const currentUrl = 'http://localhost:8090/tweets';
    const feeds = [
      { name: 'All', url: 'http://localhost:8090/tweets' },
      { name: 'Feed', url: 'http://localhost:8090/users/user/tweets' },
    ];
    const setUrl = jest.fn();
    const { getByText } = render(
      <FeedBar currentUrl={currentUrl} feeds={feeds} setUrl={setUrl} />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    feeds.forEach(({ name, url }) => {
      jest.resetAllMocks();
      const feedBarItem = getByText(name);
      userEvent.click(feedBarItem);
      expect(setUrl).toHaveBeenCalledWith(url);
      expect(setUrl).toHaveBeenCalledTimes(1);
    });
  });
});
