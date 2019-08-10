import TweetValidator from '@schemaValidators/TweetValidator';

describe('TweetValidator', (): void => {
  const type = 'text';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const linkUrl = 'https://fakeLink.fakeLink';
  it(`should validate successfully`, async (): Promise<void> => {
    const tweet = {
      type,
      text,
    };
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).resolves.toBe(tweet);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const tweet = {
      type: 'text',
      linkUrl,
    };
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
  it(`should throw an error`, async (): Promise<void> => {
    const tweet = {
      type: 'link',
      text,
    };
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
  it(`should throw an error`, async (): Promise<void> => {
    const tweet = {
      type: 'invalidType',
      text,
    };
    await expect(
      TweetValidator.validate(tweet, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
