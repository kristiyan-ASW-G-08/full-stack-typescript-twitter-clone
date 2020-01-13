import EmailValidator from '@schemaValidators/EmailValidator';

describe('EmailValidator', () => {
  const validEmails = [
    'testmail@mail.com',
    'someMail@gmail.com',
    'jojo@test.com',
  ];
  const invalidEmails = ['testmail@mail', 'someMailgmail.com', 'test.com'];
  it.each(validEmails)('should validate successfully', async email => {
    await expect(
      EmailValidator.validate({ email }, { abortEarly: false }),
    ).resolves.toStrictEqual({ email });
  });
  it.each(invalidEmails)('should validate unsuccessfully', async email => {
    await expect(
      EmailValidator.validate({ email }, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
