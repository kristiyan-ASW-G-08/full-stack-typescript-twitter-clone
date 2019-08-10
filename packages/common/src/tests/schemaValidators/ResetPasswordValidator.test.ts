import ResetPasswordValidator from '@schemaValidators/ResetPasswordValidator';

describe('ResetPasswordValidator', (): void => {
  const password = '123456789012';
  it(`should validate successfully`, async (): Promise<void> => {
    const resetPasswordObj = { password, confirmPassword: password };
    await expect(
      ResetPasswordValidator.validate(resetPasswordObj),
    ).resolves.toBe(resetPasswordObj);
  });
  it(`should throw an errors`, async (): Promise<void> => {
    const invalidPassword = 'invalid';
    const resetPasswordObj = {
      password: invalidPassword,
      confirmPassword: invalidPassword,
    };
    await expect(
      ResetPasswordValidator.validate(resetPasswordObj),
    ).rejects.toMatchSnapshot();
  });
  it(`should throw an errors`, async (): Promise<void> => {
    const confirmPassword = 'invalid';
    const resetPasswordObj = { password, confirmPassword };
    await expect(
      ResetPasswordValidator.validate(resetPasswordObj),
    ).rejects.toMatchSnapshot();
  });
});
