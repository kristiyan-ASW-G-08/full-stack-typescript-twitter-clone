import Notification from 'types/Notification';
import User from 'types/User';
import getUpdatedUser from './getUpdatedUser';

const updateUserHandler = async (
  token: string,
  urlExtension: string,
  setNotification: (notification: Notification) => void,
  updateUser: (user: User | undefined) => void,
): Promise<void> => {
  try {
    const user = await getUpdatedUser(
      token,
      `${process.env.REACT_APP_API_URL}/${urlExtension}`,
    );

    updateUser(user);
  } catch (error) {
    setNotification();
  }
};

export default updateUserHandler;
