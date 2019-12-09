import mongoose from 'mongoose';
import User from 'src/users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';

describe('User', (): void => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  beforeAll(
    async (): Promise<void> => {
      await connectToDB(mongoURI);
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  it('should throw an error when the object passed to the model does not pass validation', (): void => {
    const user = new User();
    expect(user.validate).toThrow();
  });
  it('should create a new user when validation is successful', async (): Promise<
    void
  > => {
    expect.assertions(6);
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testEmail@mail.com';
    const password = 'testPassword';
    const user: UserType = new User({
      username,
      handle,
      email,
      password,
    });
    const saveSpy = jest.spyOn(user, 'save');
    await user.save();

    expect(saveSpy).toHaveBeenCalled();
    expect(user).toMatchObject({
      username,
      handle,
      email,
      password,
    });
    expect(user.username).toBe(username);
    expect(user.handle).toBe(handle);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    saveSpy.mockRestore();
  });
});
