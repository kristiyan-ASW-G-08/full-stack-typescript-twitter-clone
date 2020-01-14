import UserProfileValidator from '@schemaValidators/UserProfileValidator';

describe('UserProfileValidator', (): void => {
  const validUsers = [
    {
      username: 'validUsername',
      handle: 'testUserHandle',
      website: 'https://testwebsite.test',
    },
    {
      username: 'Barbatos',
      handle: 'LupusREx',
      website: 'http://somewebsite.com',
    },
  ];
  const invalidUsers = [
    {
      username: '',
      handle: '',
      website: 'testwebsite.test',
    },
  ];
  it.each(validUsers)('should validate successfully', async user => {
    expect.assertions(1);
    await expect(
      UserProfileValidator.validate(user, { abortEarly: false }),
    ).resolves.toBe(user);
  });
  it.each(invalidUsers)('should validate unsuccessfully', async user => {
    expect.assertions(1);
    await expect(
      UserProfileValidator.validate(user, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
