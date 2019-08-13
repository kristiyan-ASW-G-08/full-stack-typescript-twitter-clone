import isAuthorized from '@utilities/isAuthorized';
import mongoose from 'mongoose';

describe('isAuthorized', (): void => {
  const authorizedUserId = mongoose.Types.ObjectId().toString();
  const userId = mongoose.Types.ObjectId().toString();
  it(`should throw an error when the ids don't match`, async (): Promise<
    void
  > => {
    expect.assertions(2);
    expect((): void => isAuthorized(authorizedUserId, userId)).toThrow();
    expect((): void =>
      isAuthorized(authorizedUserId, userId),
    ).toMatchInlineSnapshot(`[Function]`);
  });
  it(`shouldn't throw an error when the ids match`, async (): Promise<void> => {
    expect.assertions(1);
    expect((): void =>
      isAuthorized(authorizedUserId, authorizedUserId),
    ).not.toThrow();
  });
});
