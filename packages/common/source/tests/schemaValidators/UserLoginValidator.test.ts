import UserLoginValidator from '@schemaValidators/UserLoginValidator';

describe('UserLoginValidator', (): void => {
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const invalidPassword = '1234';
  it(`should validate successfully`, async (): Promise<void> => {
    const user = {
      email,
      password,
    };
    await expect(
      UserLoginValidator.validate(user, { abortEarly: false }),
    ).resolves.toBe(user);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const user = {
      email: '',
      password: invalidPassword,
    };
    await expect(
      UserLoginValidator.validate(user, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
