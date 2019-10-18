import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import getTweets from './getTweets';
import TweetsContainer from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import useIntersection from 'hooks/useIntersection';
import tweet from 'testUtilities/tweet';

jest.mock('hooks/useIntersection');
jest.mock('./getTweets');

const useIntersectionMock = useIntersection as jest.Mock<any>;
const setElement = jest.fn();
useIntersectionMock.mockReturnValue({ setElement });

const getTweetsMock = getTweets as jest.Mock<any>;
getTweetsMock.mockResolvedValue({ newTweets: [tweet], next: null, prev: null });

describe('TweetsContainer', () => {
  const setNotification = jest.fn();
  const url = 'url';
  it('render TweetsContainer', async () => {
    expect.assertions(6);

    const { container, getByRole, getByTestId } = render(
      <TweetsContainer url={url} setNotification={setNotification} />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    await wait(() => {
      expect(getTweets).toHaveBeenCalledTimes(1);
      expect(getTweets).toHaveBeenCalledWith(
        `${url}?sort=new`,
        setNotification,
      );
    });
    const tweetsFeed = await waitForElement(() => getByRole('feed'));
    const tweetElement = await waitForElement(() => getByTestId(tweet._id));

    expect(setElement).toHaveBeenCalledTimes(2);
    expect(tweetsFeed.childElementCount).toBe(1);
    expect(tweetElement).toBeTruthy();
    expect(container).toBeTruthy();
  });
});
