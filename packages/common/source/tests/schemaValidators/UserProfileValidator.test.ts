import UserProfileValidator from '@schemaValidators/UserProfileValidator';

describe('UserProfileValidator', (): void => {
  const username = 'username';
  const handle = 'testUserHandle';
  const website = 'https://testwebsite.test';
  it(`should validate successfully`, async (): Promise<void> => {
    const user = {
      username,
      handle,
      website,
    };
    await expect(
      UserProfileValidator.validate(user, { abortEarly: false }),
    ).resolves.toBe(user);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const user = {
      username: '',
      handle: '',
      website: '',
    };
    await expect(
      UserProfileValidator.validate(user, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
