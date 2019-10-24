import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetForm from './index';
import tweet from 'testUtilities/tweet';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Theme from 'components/Theme/Theme';
import populateFormData from 'utilities/populateFormData';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {}, status: 200 });
axiosMock.patch.mockResolvedValue({ data: {}, status: 200 });

jest.mock('utilities/populateFormData');

const populateFormDataMock = populateFormData as jest.Mock<any>;
populateFormDataMock.mockReturnValue(new FormData());

describe('TweetForm', () => {
  const token = 'mockToken';
  const setNotification = jest.fn();
  const text = 'text';
  const link = 'https://testing-library.com/';
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('render TweetForm (post a new Tweet)', async () => {
    expect.assertions(6);
    const history = createMemoryHistory();
    history.push({
      pathname: ``,
      state: {},
    });
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <TweetForm setNotification={setNotification} token={token} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper children={children} history={history} />
        ),
      },
    );
    const submitButton = getByText('Tweet');
    const linkButton = getByTestId('link-button');

    userEvent.click(linkButton);

    const textInput = getByPlaceholderText('Text');
    const linkInput = getByPlaceholderText('Link');

    UserEvent.type(textInput, text);
    UserEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    UserEvent.click(submitButton);

    await wait(() => {
      expect(populateFormData).toHaveBeenCalledTimes(1);
      expect(populateFormData).toHaveBeenCalledWith({
        linkUrl: 'https://testing-library.com/',
        replyId: undefined,
        retweetId: undefined,
        text: 'text',
        type: 'link',
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8090/tweets',
        new FormData(),
        {
          headers: { Authorization: 'bearer mockToken' },
        },
      );
    });
  });
  it('render TweetForm (edit a Tweet)', async () => {
    expect.assertions(8);

    const history = createMemoryHistory();
    history.push({
      pathname: ``,
      state: { tweet },
    });
    const { getByText, getByPlaceholderText } = render(
      <TweetForm setNotification={setNotification} token={token} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper children={children} history={history} />
        ),
      },
    );
    const submitButton = getByText('Tweet');
    const textInput = getByPlaceholderText('Text');
    const linkInput = getByPlaceholderText('Link');

    expect(textInput.textContent).toMatch(tweet.text);
    expect(linkInput).toHaveAttribute('value', tweet.link);

    UserEvent.type(textInput, text);
    UserEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    UserEvent.click(submitButton);

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
        'http://localhost:8090/tweets/id',
        new FormData(),
        {
          headers: { Authorization: 'bearer mockToken' },
        },
      );
    });
  });
});
