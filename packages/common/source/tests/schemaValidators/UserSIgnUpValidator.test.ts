import UserSIgnUpValidator from '@schemaValidators/UserSignUpValidator';

describe('UserSIgnUpValidator', (): void => {
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const invalidPassword = '1234';
  it(`should validate successfully`, async (): Promise<void> => {
    const user = {
      username,
      handle,
      email,
      password,
      confirmPassword: password,
    };
    await expect(
      UserSIgnUpValidator.validate(user, { abortEarly: false }),
    ).resolves.toBe(user);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const user = {
      username: '',
      handle: '',
      email: '',
      password: invalidPassword,
      confirmPassword: invalidPassword,
    };
    await expect(
      UserSIgnUpValidator.validate(user, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
