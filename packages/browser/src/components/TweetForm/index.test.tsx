import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import tweet from 'testUtilities/tweet';
import { createMemoryHistory } from 'history';
import populateFormData from 'utilities/populateFormData';
import useStores from 'hooks/useStores';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import TweetForm from './index';

jest.mock('axios');
jest.mock('utilities/populateFormData');
jest.mock('hooks/useStores');

const setNotification = jest.fn();

const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {}, status: 200 });
axiosMock.patch.mockResolvedValue({ data: {}, status: 200 });
const populateFormDataMock = populateFormData as jest.Mocked<any>;
populateFormDataMock.mockReturnValue(new FormData());

const useStoresMock = useStores as jest.Mocked<any>;
const token = 'mockToken';

useStoresMock.mockReturnValue({
  notificationStore: {
    setNotification,
  },
  authStore: {
    authState: {
      token,
    },
  },
});

describe('TweetForm', () => {
  const text = 'text';
  const link = 'https://testing-library.com/';
  afterEach(jest.clearAllMocks);
  afterAll(() => jest.restoreAllMocks());
  it('render TweetForm (post a new Tweet)', async () => {
    jest.setTimeout(30000);
    expect.assertions(5);
    const history = createMemoryHistory();
    history.push({
      pathname: ``,
      state: {},
    });

    jest.spyOn(history, 'replace');
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <TweetForm />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const submitButton = getByText('Tweet');
    const linkButton = getByTestId('link-button');

    userEvent.click(linkButton);

    const textInput = getByPlaceholderText('Text');
    const linkInput = getByPlaceholderText('Link');

    userEvent.type(textInput, text);
    userEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    userEvent.click(submitButton);

    await wait(() => {
      // expect(populateFormData).toHaveBeenCalledTimes(1);
      expect(populateFormData).toHaveBeenCalledWith({
        linkUrl: 'https://testing-library.com/',
        replyId: undefined,
        retweetId: undefined,
        text: 'text',
        type: 'link',
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/tweets',
        new FormData(),
        {
          headers: { Authorization: 'bearer mockToken' },
        },
      );
    });
  });
  it('render TweetForm (edit a Tweet)', async () => {
    jest.setTimeout(30000);
    expect.assertions(10);

    const history = createMemoryHistory();
    history.push({
      pathname: ``,
      state: { tweet },
    });
    jest.spyOn(history, 'push');
    const { getByText, getByPlaceholderText } = render(
      <TweetForm />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const submitButton = getByText('Tweet');
    const textInput = getByPlaceholderText('Text');
    const linkInput = getByPlaceholderText('Link');

    expect(textInput.textContent).toMatch(tweet.text);
    expect(linkInput).toHaveAttribute('value', tweet.link);

    userEvent.type(textInput, text);
    userEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    userEvent.click(submitButton);

    await wait(() => {
      expect(populateFormData).toHaveBeenCalledTimes(1);
      expect(populateFormData).toHaveBeenCalledWith({
        linkUrl: 'https://testing-library.com/',
        replyId: undefined,
        retweetId: undefined,
        text: 'text',
        type: 'link',
      });
      expect(axios.patch).toHaveBeenCalledTimes(1);
      expect(axios.patch).toHaveBeenCalledWith(
        `http://localhost:9000/tweets/${tweet._id}`,
        new FormData(),
        {
          headers: { Authorization: 'bearer mockToken' },
        },
      );

      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledWith(`/tweet/${tweet._id}`);
    });
  });
});
