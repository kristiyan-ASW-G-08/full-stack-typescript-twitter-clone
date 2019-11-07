import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TestWrapper from 'testUtilities/TestWrapper';
import useIntersection from 'hooks/useIntersection';
import user from 'testUtilities/user';
import UsersContainer from './index';
import getUsers from './getUsers';

jest.mock('hooks/useIntersection');
jest.mock('./getUsers');

const useIntersectionMock = useIntersection as jest.Mock<any>;
const setElement = jest.fn();
useIntersectionMock.mockReturnValue({ setElement });

const getUsersMock = getUsers as jest.Mock<any>;
getUsersMock.mockResolvedValue({ nextUsers: [user], next: null, prev: null });

describe('UsersContainer', () => {
  const setUrl = jest.fn();
  const url = 'url';

  it('render UsersContainer', async () => {
    expect.assertions(5);
    const { container, getByRole, getByTestId } = render(
      <UsersContainer feeds={[]} url={url} setUrl={setUrl} />,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );
    await wait(() => {
      expect(getUsers).toHaveBeenCalledTimes(2);
      expect(getUsers).toHaveBeenCalledWith(url);
    });

    const tweetsFeed = getByRole('feed');
    const tweetElement = getByTestId(user._id);
    expect(tweetsFeed.childElementCount).toBe(1);
    expect(tweetElement).toBeTruthy();
    expect(container).toBeTruthy();
  });
});
