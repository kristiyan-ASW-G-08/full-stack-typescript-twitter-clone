import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import useIntersection from 'hooks/useIntersection';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import TweetPage from '.';

jest.mock('axios');
jest.mock('hooks/useIntersection');

const setElement = jest.fn();
const useIntersectionMock = useIntersection as jest.Mock<any>;
useIntersectionMock.mockReturnValue({ setElement });

const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({ data: { data: { tweet } } });
describe('TweetPage', () => {
  afterAll(() => jest.restoreAllMocks());
  it('renders', async () => {
    // expect.assertions(1);

    render(<TweetPage />, {
      wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
    });

    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
