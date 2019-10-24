import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import ShareButton from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import setClipboard from 'utilities/setClipboard';

jest.mock('utilities/setClipboard');

describe('ShareButton', () => {
  afterAll(() => jest.restoreAllMocks());
  it('render ShareButton', () => {
    expect.assertions(9);
    const setNotification = jest.fn();
    const { queryByTestId, getByTestId } = render(
      <ShareButton tweet={tweet} setNotification={setNotification} />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const shareButton = getByTestId('share-button');

    UserEvent.click(shareButton);

    const openClipboardButton = getByTestId('clipboard-button');
    const openRedditButton = getByTestId('reddit-button');
    const openTwitterButton = getByTestId('twitter-button');

    expect(shareButton).toBeTruthy();
    expect(openClipboardButton).toBeTruthy();
    expect(openRedditButton).toBeTruthy();
    expect(openTwitterButton).toBeTruthy();

    UserEvent.click(openClipboardButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setClipboard).toHaveBeenCalledTimes(1);

    UserEvent.click(shareButton);

    const closedClipboardButton = queryByTestId('clipboard-button');

    const closedRedditButton = queryByTestId('reddit-button');

    const closedTwitterButton = queryByTestId('twitter-button');
    expect(closedClipboardButton).toBeFalsy();
    expect(closedRedditButton).toBeFalsy();
    expect(closedTwitterButton).toBeFalsy();
  });
});
