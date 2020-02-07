import React from 'react';
import { render, wait, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import TestWrapper from 'testUtilities/TestWrapper';
import useIntersection from 'hooks/useIntersection';
import tweet from 'testUtilities/tweet';
import TweetsContainer from './index';
import getTweets from './getTweets';

jest.mock('hooks/useIntersection');
jest.mock('./getTweets');

const useIntersectionMock = useIntersection as jest.Mock<any>;
const setElement = jest.fn();
useIntersectionMock.mockReturnValue({ setElement });

const getTweetsMock = getTweets as jest.Mock<any>;
getTweetsMock.mockResolvedValue({ newTweets: [tweet], next: null, prev: null });

describe('TweetsContainer', () => {
  const setUrl = jest.fn();
  const url = 'url';
  const token = 'token';

  it('render TweetsContainer', async () => {
    expect.assertions(13);
    const { getByRole, getByTestId } = render(
      <TweetsContainer token={token} feeds={[]} url={url} setUrl={setUrl} />,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );
    await wait(() => {
      expect(getTweets).toHaveBeenCalledTimes(1);
      expect(getTweets).toHaveBeenCalledWith(`${url}?sort=new`, token);
    });

    const tweetsFeed = getByRole('feed');
    const tweetElement = getByTestId(tweet._id);
    const sortSelect = getByTestId('sort');

    const options = ['trending', 'new', 'top', 'replies'];
    options.forEach(option => {
      const sortOption = getByTestId(option) as HTMLOptionElement;
      act(() => UserEvent.selectOptions(sortSelect, option));
      expect(sortOption.selected).toBe(true);
      expect(getTweets).toHaveBeenCalledWith(`${url}?sort=${option}`, token);
    });
    expect(getTweets).toHaveBeenCalledTimes(5);
    expect(tweetsFeed.childElementCount).toBe(1);
    expect(tweetElement).toBeTruthy();
  });
});
