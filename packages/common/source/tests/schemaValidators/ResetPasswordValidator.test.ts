import ResetPasswordValidator from '@schemaValidators/ResetPasswordValidator';

describe('ResetPasswordValidator', (): void => {
  const validPasswords = ['123456789012', 'somePassword10', 'validPassword'];
  const invalidPasswords = [
    { password: 'somePassword10', confirmPassword: 'validPassword' },
    { password: '' },
    { password: 'Password' },
  ];
  it.each(validPasswords)('should validate successfully', async password => {
    await expect(
      ResetPasswordValidator.validate(
        { password, confirmPassword: password },
        { abortEarly: false },
      ),
    ).resolves.toStrictEqual({ password, confirmPassword: password });
  });
  it.each(invalidPasswords)('should validate unsuccessfully', async body => {
    await expect(
      ResetPasswordValidator.validate(body, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
