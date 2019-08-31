import EmailValidator from '@schemaValidators/EmailValidator';

describe('EmailValidator', (): void => {
  const email = 'testmail@mail.com';
  it(`should validate successfully`, async (): Promise<void> => {
    const body = {
      email,
    };
    await expect(
      EmailValidator.validate(body, { abortEarly: false }),
    ).resolves.toBe(body);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const body = {
      email: '',
    };
    await expect(
      EmailValidator.validate(body, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
