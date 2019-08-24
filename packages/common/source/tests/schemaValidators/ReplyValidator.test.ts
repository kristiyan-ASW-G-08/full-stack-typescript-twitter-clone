import ReplyValidator from '@schemaValidators/ReplyValidator';

describe('ReplyValidator', (): void => {
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  it(`should validate successfully`, async (): Promise<void> => {
    const reply = {
      text,
    };
    await expect(
      ReplyValidator.validate(reply, { abortEarly: false }),
    ).resolves.toBe(reply);
  });
  it(`should throw an error`, async (): Promise<void> => {
    const reply = {
      text: '',
    };
    await expect(
      ReplyValidator.validate(reply, { abortEarly: false }),
    ).rejects.toMatchSnapshot();
  });
});
