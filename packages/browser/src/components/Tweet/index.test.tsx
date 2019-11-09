import React from 'react';
import { render, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import tweet from 'testUtilities/tweet';
import Tweet from './index';

describe('Tweet', () => {
  it('render Tweet', async () => {
    expect.assertions(8);
    const history = createMemoryHistory();
    jest.spyOn(history, 'push');
    const deleteTweetHandler = jest.fn();
    const { container, queryByText, queryByAltText, queryByTestId } = render(
      <Tweet tweet={tweet} deleteTweetHandler={deleteTweetHandler} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );

    const text = queryByText(tweet.text);
    const link = queryByText(tweet.link);
    const image = queryByAltText('');
    const avatar = queryByAltText(tweet.user.username);
    const profileLink = queryByTestId(`profile-link`);

    expect(container).toBeTruthy();
    expect(link).toBeTruthy();
    expect(image).toBeTruthy();
    expect(avatar).toBeTruthy();
    expect(text).toBeTruthy();
    expect(profileLink).toBeTruthy();

    // @ts-ignore
    userEvent.click(profileLink);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledWith(`/users/${tweet.user._id}`);
    });
  });
});
