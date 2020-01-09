import TweetValidator from '@schemaValidators/TweetValidator';

describe('TweetValidator', (): void => {
  const validTweets = [
    {
      type: 'text',
      text:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
    },
    {
      type: 'link',
      text:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
      linkUrl: 'https://fakeLink.fakeLink',
    },
    {
      type: 'retweet',
      text:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
      retweetId: 'mockId',
    },
    {
      type: 'reply',
      replyId: 'mockId',
    },
  ];

  const invalidTweets = [
    {
      type: 'invalid',
      text: 10,
    },
    {
      type: 'link',
      text: '',
      linkUrl: "not a url'",
    },
  ];
  it.each(validTweets)('should validate successfully', async tweet => {
    expect.assertions(1);
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).resolves.toBe(tweet);
  });
  it.each(invalidTweets)('should validate unsuccessfully', async tweet => {
    // expect.assertions(1);
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
